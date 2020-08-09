import { NitroManager } from '../../core/common/NitroManager';
import { IConnection } from '../../core/communication/connections/IConnection';
import { IConnectionStateListener } from '../../core/communication/connections/IConnectionStateListener';
import { SocketConnectionEvent } from '../../core/communication/events/SocketConnectionEvent';
import { ICommunicationManager } from '../../core/communication/ICommunicationManager';
import { IMessageConfiguration } from '../../core/communication/messages/IMessageConfiguration';
import { IMessageEvent } from '../../core/communication/messages/IMessageEvent';
import { NitroEvent } from '../../core/events/NitroEvent';
import { NitroConfiguration } from '../../NitroConfiguration';
import { Nitro } from '../Nitro';
import { NitroCommunicationDemo } from './demo/NitroCommunicationDemo';
import { NitroCommunicationDemoEvent } from './demo/NitroCommunicationDemoEvent';
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

        Nitro.instance.events.addEventListener(NitroCommunicationDemoEvent.CONNECTION_AUTHENTICATED, this.onConnectionAuthenticatedEvent.bind(this));
        
        this._connection = this._communication.createConnection(this);

        this._connection.registerMessages(this._messages);

        this._connection.addEventListener(SocketConnectionEvent.CONNECTION_OPENED, this.onConnectionOpenedEvent.bind(this));
        this._connection.addEventListener(SocketConnectionEvent.CONNECTION_CLOSED, this.onConnectionClosedEvent.bind(this));
        this._connection.addEventListener(SocketConnectionEvent.CONNECTION_ERROR, this.onConnectionErrorEvent.bind(this));

        if(this._demo) this._demo.init();

        this._connection.init(NitroConfiguration.SOCKET_URL);
    }

    protected onDispose(): void
    {
        if(this._demo) this._demo.dispose();
        
        if(this._connection)
        {
            this._connection.removeEventListener(SocketConnectionEvent.CONNECTION_OPENED, this.onConnectionOpenedEvent.bind(this));
            this._connection.removeEventListener(SocketConnectionEvent.CONNECTION_CLOSED, this.onConnectionClosedEvent.bind(this));
            this._connection.removeEventListener(SocketConnectionEvent.CONNECTION_ERROR, this.onConnectionErrorEvent.bind(this));
        }

        super.onDispose();
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

    private onConnectionAuthenticatedEvent(event: NitroEvent): void
    {
        this.logger.log('Connection Authenticated');

        if(this._connection) this._connection.authenticated();
    }

    public connectionInit(socketUrl: string): void
    {
        this.logger.log(`Initializing Connection: ${ socketUrl }`);
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

    public get demo(): NitroCommunicationDemo
    {
        return this._demo;
    }

    public get connection(): IConnection
    {
        return this._connection;
    }
}