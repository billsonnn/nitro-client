import * as ByteBuffer from 'bytebuffer';
import { NitroConfiguration } from '../../../NitroConfiguration';
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
    private _dataBuffer: ByteBuffer;

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

    private createSocket(socketUrl: string): void
    {
        if(!socketUrl) return;

        this.destroySocket();

        this._dataBuffer = new ByteBuffer();
        
        this._socket = new WebSocket(socketUrl);

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

        reader.onloadend = progress =>
        {
            const buffer = ByteBuffer.wrap(new Uint8Array(<ArrayBuffer> reader.result));

            this._dataBuffer = buffer;

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
        if(this.isDisposed || !composers) return false;
        
        composers = [ ...composers ];
        
        for(let composer of composers)
        {
            if(!composer) continue;

            const header = this._messages.getComposerId(composer);

            if(header === -1)
            {
                if(NitroConfiguration.PACKET_LOG) console.log(`Unknown Composer: ${ composer.constructor.name }`);

                continue;
            }

            const encoded = this._codec.encode(header, composer.getMessageArray());

            if(!encoded)
            {
                if(NitroConfiguration.PACKET_LOG) console.log(`Encoding Failed: ${ composer.constructor.name }`);

                continue;
            }

            if(NitroConfiguration.PACKET_LOG) console.log(`OutgoingComposer: ${ composer.constructor.name }`);

            this.write(encoded.toBuffer());
        }

        return true;
    }

    private write(buffer: Buffer): void
    {
        if(this._socket.readyState !== WebSocket.OPEN) return;

        this._socket.send(buffer);
    }

    private processReceivedData(): void
    {
        try
        {
            this.processData();
        }

        catch(err)
        {
            console.log(err);
        }
    }

    private processData(): void
    {
        const wrappers = this.splitReceivedMessages();

        if(!wrappers) return;

        for(let wrapper of wrappers)
        {
            if(!wrapper) continue;

            const messages = this.getMessagesForWrapper(wrapper);

            if(!messages || !messages.length) continue;

            if(NitroConfiguration.PACKET_LOG) console.log(`IncomingMessage: ${ messages[0].constructor.name } [${ wrapper.header }]`);

            if(!messages || !messages.length) continue;
            
            this.handleMessages(...messages);
        }
    }

    private splitReceivedMessages(): IMessageDataWrapper[]
    {
        if(!this._dataBuffer) return null;

        this._dataBuffer.offset = 0;

        if(this._dataBuffer.remaining() === 0) return null;

        const messages = this._codec.decode(this._dataBuffer);

        if(this._dataBuffer.remaining() === 0) this._dataBuffer = new ByteBuffer();

        return messages;
    }

    private getMessagesForWrapper(wrapper: IMessageDataWrapper): IMessageEvent[]
    {
        if(!wrapper) return null;

        const events = this._messages.getEvents(wrapper.header);

        if(!events || !events.length) return null;

        const parser = events[0].parser;

        if(!parser || !parser.flush() || !parser.parse(wrapper)) return null;

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
}