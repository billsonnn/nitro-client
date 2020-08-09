import { NitroConfiguration } from '../../../NitroConfiguration';
import { NitroLogger } from '../../common/logger/NitroLogger';
import { EventDispatcher } from '../../events/EventDispatcher';
import { EvaWireFormat } from '../codec/evawire/EvaWireFormat';
import { ICodec } from '../codec/ICodec';
import { SocketConnectionEvent } from '../events/SocketConnectionEvent';
import { ICommunicationManager } from '../ICommunicationManager';
import { IMessageComposer } from '../messages/IMessageComposer';
import { IMessageConfiguration } from '../messages/IMessageConfiguration';
import { IMessageDataWrapper } from '../messages/IMessageDataWrapper';
import { IMessageEvent } from '../messages/IMessageEvent';
import { MessageClassManager } from '../messages/MessageClassManager';
import { WebSocketEventEnum } from './enums/WebSocketEventEnum';
import { IConnection } from './IConnection';
import { IConnectionStateListener } from './IConnectionStateListener';

export class SocketConnection extends EventDispatcher implements IConnection
{
    private _communicationManager: ICommunicationManager;
    private _stateListener: IConnectionStateListener;
    private _socket: WebSocket;
    private _messages: MessageClassManager;
    private _codec: ICodec;
    private _dataBuffer: ArrayBuffer;
    private _isReady: boolean;

    private _pendingClientMessages: IMessageComposer[];
    private _pendingServerMessages: IMessageDataWrapper[];


    private _isAuthenticated: boolean;

    constructor(communicationManager: ICommunicationManager, stateListener: IConnectionStateListener)
    {
        super();

        this._communicationManager  = communicationManager;
        this._stateListener         = stateListener;
        this._socket                = null;
        this._messages              = new MessageClassManager();
        this._codec                 = new EvaWireFormat();
        this._dataBuffer            = null;
        this._isReady               = false;

        this._pendingClientMessages = [];
        this._pendingServerMessages = [];

        this._isAuthenticated       = false;
    }

    public init(socketUrl: string): void
    {
        if(this._stateListener)
        {
            this._stateListener.connectionInit(socketUrl);
        }

        this.createSocket(socketUrl);
    }

    protected onDispose(): void
    {
        super.onDispose();
        
        this.destroySocket();

        this._communicationManager  = null;
        this._stateListener         = null;
        this._messages              = null;
        this._codec                 = null;
        this._dataBuffer            = null;
    }

    public onReady(): void
    {
        if(this._isReady) return;
        
        this._isReady = true;

        if(this._pendingServerMessages && this._pendingServerMessages.length) this.processWrappers(...this._pendingServerMessages);

        if(this._pendingClientMessages && this._pendingClientMessages.length) this.send(...this._pendingClientMessages);

        this._pendingServerMessages = [];
        this._pendingClientMessages = [];
    }

    private createSocket(socketUrl: string): void
    {
        if(!socketUrl) return;

        this.destroySocket();

        this._dataBuffer    = new ArrayBuffer(0);
        this._socket        = new WebSocket(socketUrl);

        this._socket.addEventListener(WebSocketEventEnum.CONNECTION_OPENED, this.onOpen.bind(this));
        this._socket.addEventListener(WebSocketEventEnum.CONNECTION_CLOSED, this.onClose.bind(this));
        this._socket.addEventListener(WebSocketEventEnum.CONNECTION_ERROR, this.onError.bind(this));
        this._socket.addEventListener(WebSocketEventEnum.CONNECTION_MESSAGE, this.onMessage.bind(this));
    }

    private destroySocket(): void
    {
        if(!this._socket) return;

        this._socket.removeEventListener(WebSocketEventEnum.CONNECTION_OPENED, this.onOpen.bind(this));
        this._socket.removeEventListener(WebSocketEventEnum.CONNECTION_CLOSED, this.onClose.bind(this));
        this._socket.removeEventListener(WebSocketEventEnum.CONNECTION_ERROR, this.onError.bind(this));
        this._socket.removeEventListener(WebSocketEventEnum.CONNECTION_MESSAGE, this.onMessage.bind(this));

        if(this._socket.readyState === WebSocket.OPEN) this._socket.close();

        this._socket = null;
    }

    private onOpen(event: Event): void
    {
        this.dispatchConnectionEvent(SocketConnectionEvent.CONNECTION_OPENED, event);
    }

    private onClose(event: CloseEvent): void
    {
        this.dispatchConnectionEvent(SocketConnectionEvent.CONNECTION_CLOSED, event);
    }

    private onError(event: Event): void
    {
        this.dispatchConnectionEvent(SocketConnectionEvent.CONNECTION_ERROR, event);
    }

    private onMessage(event: MessageEvent): void
    {
        if(!event) return;

        this.dispatchConnectionEvent(SocketConnectionEvent.CONNECTION_MESSAGE, event);

        const reader = new FileReader();

        reader.readAsArrayBuffer(event.data);

        reader.onloadend = () =>
        {
            this._dataBuffer = this.concatArrayBuffers(this._dataBuffer, <ArrayBuffer> reader.result);

            this.processReceivedData();
        }
    }

    private dispatchConnectionEvent(type: string, event: Event): void
    {
        this.dispatchEvent(new SocketConnectionEvent(type, this, event));
    }

    public authenticated(): void
    {
        this._isAuthenticated = true;
    }

    public send(...composers: IMessageComposer[]): boolean
    {
        if(this.disposed || !composers) return false;
        
        composers = [ ...composers ];

        if(this._isAuthenticated && !this._isReady)
        {
            if(!this._pendingClientMessages) this._pendingClientMessages = [];

            this._pendingClientMessages.push(...composers);

            return false;
        }
        
        for(let composer of composers)
        {
            if(!composer) continue;

            const header = this._messages.getComposerId(composer);

            if(header === -1)
            {
                NitroLogger.log(`Unknown Composer: ${ composer.constructor.name }`);

                continue;
            }

            const encoded = this._codec.encode(header, composer.getMessageArray());

            if(!encoded)
            {
                if(NitroConfiguration.PACKET_LOG) NitroLogger.log(`Encoding Failed: ${ composer.constructor.name }`);

                continue;
            }

            if(NitroConfiguration.PACKET_LOG) NitroLogger.log(`OutgoingComposer: ${ composer.constructor.name }`);

            this.write(encoded.toBuffer());
        }

        return true;
    }

    private write(buffer: Buffer): void
    {
        if(this._socket.readyState !== WebSocket.OPEN) return;

        this._socket.send(buffer);
    }

    public processReceivedData(): void
    {
        try
        {
            this.processData();
        }

        catch(err)
        {
            NitroLogger.log(err);
        }
    }

    private processData(): void
    {
        const wrappers = this.splitReceivedMessages();

        if(!wrappers || !wrappers.length) return;

        if(this._isAuthenticated && !this._isReady)
        {
            if(!this._pendingServerMessages) this._pendingServerMessages = [];

            this._pendingServerMessages.push(...wrappers);

            return;
        }

        this.processWrappers(...wrappers);
    }

    private processWrappers(...wrappers: IMessageDataWrapper[]): void
    {
        if(!wrappers || !wrappers.length) return;

        for(let wrapper of wrappers)
        {
            if(!wrapper) continue;

            const messages = this.getMessagesForWrapper(wrapper);

            if(!messages || !messages.length) continue;

            if(NitroConfiguration.PACKET_LOG) NitroLogger.log(`IncomingMessage: ${ messages[0].constructor.name } [${ wrapper.header }]`);
            
            this.handleMessages(...messages);
        }
    }

    private splitReceivedMessages(): IMessageDataWrapper[]
    {
        if(!this._dataBuffer || !this._dataBuffer.byteLength) return null;

        return this._codec.decode(this);
    }

    private concatArrayBuffers(buffer1: ArrayBuffer, buffer2: ArrayBuffer): ArrayBuffer
    {
        const newBuffer = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
        
        newBuffer.set(new Uint8Array(buffer1), 0);
        newBuffer.set(new Uint8Array(buffer2), buffer1.byteLength);
        
        return newBuffer.buffer;
    }

    private getMessagesForWrapper(wrapper: IMessageDataWrapper): IMessageEvent[]
    {
        if(!wrapper) return null;

        const events = this._messages.getEvents(wrapper.header);

        if(!events || !events.length) return null;

        try
        {
            const parser = events[0].parser;

            if(!parser || !parser.flush() || !parser.parse(wrapper)) return null;
        }

        catch(e)
        {
            NitroLogger.log(`Error parsing message: ${ e }`, events[0].constructor.name);

            return null;
        }

        return events;
    }

    private handleMessages(...messages: IMessageEvent[]): void
    {
        messages = [ ...messages ];

        for(let message of messages)
        {
            if(!message) continue;

            message.connection = this;

            if(message.callBack) message.callBack(message);
        }
    }

    public registerMessages(configuration: IMessageConfiguration): void
    {
        if(!configuration) return;

        this._messages.registerMessages(configuration);
    }

    public addMessageEvent(event: IMessageEvent): void
    {
        if(!this._messages) return;

        this._messages.registerMessageEvent(event);
    }

    public removeMessageEvent(event: IMessageEvent): void
    {
        if(this._messages) return;

        this._messages.removeMessageEvent(event);
    }

    public get isAuthenticated(): boolean
    {
        return this._isAuthenticated;
    }

    public get dataBuffer(): ArrayBuffer
    {
        return this._dataBuffer;
    }

    public set dataBuffer(buffer: ArrayBuffer)
    {
        this._dataBuffer = buffer;
    }
}