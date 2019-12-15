import { NitroManager } from '../../core/common/NitroManager';
import { WebSocketEventEnum } from '../../core/communication/connections/enums/WebSocketEventEnum';
import { IConnection } from '../../core/communication/connections/IConnection';
import { IConnectionStateListener } from '../../core/communication/connections/IConnectionStateListener';
import { ICommunicationManager } from '../../core/communication/ICommunicationManager';
import { IMessageConfiguration } from '../../core/communication/messages/IMessageConfiguration';
import { IMessageEvent } from '../../core/communication/messages/IMessageEvent';
import { NitroEvent } from '../../core/events/NitroEvent';
import { NitroInstance } from '../NitroInstance';
import { NitroCommunicationDemo } from './demo/NitroCommunicationDemo';
import { NitroCommunicationEventEnum } from './enums/NitroCommunicationEventEnum';
import { INitroCommunicationManager } from './INitroCommunicationManager';
import { NitroMessages } from './NitroMessages';

export class NitroCommunicationManager extends NitroManager implements INitroCommunicationManager, IConnectionStateListener
{
    private _communication: ICommunicationManager;
    private _connection: IConnection;
    private _messages: IMessageConfiguration;

    private _demo: NitroCommunicationDemo;

    constructor(communication: ICommunicationManager)
    {
        super();

        this._communication = communication;
        this._connection    = null;
        this._messages      = new NitroMessages();

        this._demo          = new NitroCommunicationDemo(this);
    }

    protected onInit(): void
    {
        if(this._connection) return;

        NitroInstance.instance.events.addEventListener(NitroCommunicationEventEnum.CONNECTION_AUTHENTICATED, this.onConnectionAuthenticatedEvent.bind(this));
        
        this._connection = this._communication.createConnection(this);

        this._connection.registerMessages(this._messages);

        this._connection.addEventListener(WebSocketEventEnum.CONNECTION_OPENED, this.onConnectionOpenedEvent.bind(this));
        this._connection.addEventListener(WebSocketEventEnum.CONNECTION_CLOSED, this.onConnectionClosedEvent.bind(this));
        this._connection.addEventListener(WebSocketEventEnum.CONNECTION_ERROR, this.onConnectionErrorEvent.bind(this));

        if(this._demo) this._demo.init();

        this._connection.init('wss://system.nitrots.co');
    }

    protected onDispose(): void
    {
        if(this._demo) this._demo.dispose();
        
        if(this._connection)
        {
            this._connection.removeEventListener(WebSocketEventEnum.CONNECTION_OPENED, this.onConnectionOpenedEvent.bind(this));
            this._connection.removeEventListener(WebSocketEventEnum.CONNECTION_CLOSED, this.onConnectionClosedEvent.bind(this));
            this._connection.removeEventListener(WebSocketEventEnum.CONNECTION_ERROR, this.onConnectionErrorEvent.bind(this));
        }
    }

    private onConnectionOpenedEvent(event: Event): void
    {
        this.logger.log(`Connection Initialized`);
    }

    private onConnectionClosedEvent(event: CloseEvent): void
    {
        this.logger.log(`Connection Closed`);
    }

    private onConnectionErrorEvent(event: Event): void
    {
        this.logger.log(`Connection Error`);
    }

    public connectionInit(socketUrl: string): void
    {
        this.logger.log(`Initializing Connection: ${ socketUrl }`);
    }

    private onConnectionAuthenticatedEvent(event: NitroEvent): void
    {
        this.logger.log('Connection Authenticated');

        if(this._connection) this._connection.authenticated();
    }

    public registerMessageEvent(event: IMessageEvent): IMessageEvent
    {
        if(this._connection) this._connection.addMessageEvent(event);

        return event;
    }

    public removeMessageEvent(event: IMessageEvent): void
    {
        if(!this._connection) return;

        this._connection.removeMessageEvent(event);
    }

    public get connection(): IConnection
    {
        return this._connection;
    }
}