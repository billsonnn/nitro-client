import { NitroLogger } from '../../../core/common/logger/NitroLogger';
import { NitroManager } from '../../../core/common/NitroManager';
import { IConnection } from '../../../core/communication/connections/IConnection';
import { SocketConnectionEvent } from '../../../core/communication/events/SocketConnectionEvent';
import { Nitro } from '../../Nitro';
import { INitroCommunicationManager } from '../INitroCommunicationManager';
import { ClientPingEvent } from '../messages/incoming/client/ClientPingEvent';
import { AuthenticatedEvent } from '../messages/incoming/security/AuthenticatedEvent';
import { ClientPongComposer } from '../messages/outgoing/client/ClientPongComposer';
import { ClientReleaseVersionComposer } from '../messages/outgoing/client/ClientReleaseVersionComposer';
import { SecurityTicketComposer } from '../messages/outgoing/security/SecurityTicketComposer';
import { UserInfoComposer } from '../messages/outgoing/user/data/UserInfoComposer';
import { NitroCommunicationDemoEvent } from './NitroCommunicationDemoEvent';

export class NitroCommunicationDemo extends NitroManager
{
    private _communication: INitroCommunicationManager;

    private _sso: string;
    private _handShaking: boolean;
    private _didConnect: boolean;

    constructor(communication: INitroCommunicationManager)
    {
        super();

        this._communication = communication;

        this._sso           = null;
        this._handShaking   = false;
        this._didConnect    = false;
    }

    protected onInit(): void
    {
        const connection = this._communication.connection;

        if(connection)
        {
            connection.addEventListener(SocketConnectionEvent.CONNECTION_OPENED, this.onConnectionOpenedEvent.bind(this));
            connection.addEventListener(SocketConnectionEvent.CONNECTION_CLOSED, this.onConnectionClosedEvent.bind(this));
            connection.addEventListener(SocketConnectionEvent.CONNECTION_ERROR, this.onConnectionErrorEvent.bind(this));
        }

        this._communication.registerMessageEvent(new ClientPingEvent(this.onClientPingEvent.bind(this)));
        this._communication.registerMessageEvent(new AuthenticatedEvent(this.onAuthenticatedEvent.bind(this)));
    }

    protected onDispose(): void
    {
        const connection = this._communication.connection;

        if(connection)
        {
            connection.removeEventListener(SocketConnectionEvent.CONNECTION_OPENED, this.onConnectionOpenedEvent.bind(this));
            connection.removeEventListener(SocketConnectionEvent.CONNECTION_CLOSED, this.onConnectionClosedEvent.bind(this));
            connection.removeEventListener(SocketConnectionEvent.CONNECTION_ERROR, this.onConnectionErrorEvent.bind(this));
        }

        this._sso           = null;
        this._handShaking   = false;

        super.onDispose();
    }

    private onConnectionOpenedEvent(event: Event): void
    {
        const connection = this._communication.connection;

        if(!connection) return;

        this._didConnect = true;

        this.dispatchCommunicationDemoEvent(NitroCommunicationDemoEvent.CONNECTION_ESTABLISHED, connection);

        this.startHandshake(connection);

        connection.send(new ClientReleaseVersionComposer());

        this.tryAuthentication(connection);
    }

    private onConnectionClosedEvent(event: CloseEvent): void
    {
        const connection = this._communication.connection;

        if(!connection) return;

        if(this._didConnect) this.dispatchCommunicationDemoEvent(NitroCommunicationDemoEvent.CONNECTION_CLOSED, connection);
    }

    private onConnectionErrorEvent(event: CloseEvent): void
    {
        const connection = this._communication.connection;

        if(!connection) return;

        this.dispatchCommunicationDemoEvent(NitroCommunicationDemoEvent.CONNECTION_ERROR, connection);
    }

    private tryAuthentication(connection: IConnection): void
    {
        if(!connection || !this._sso)
        {
            if(!this._sso)
            {
                NitroLogger.log(`Login without an SSO ticket is not supported`);
            }

            this.dispatchCommunicationDemoEvent(NitroCommunicationDemoEvent.CONNECTION_HANDSHAKE_FAILED, connection);

            return;
        }

        connection.send(new SecurityTicketComposer(this._sso));
    }

    private onClientPingEvent(event: ClientPingEvent): void
    {
        if(!(event instanceof ClientPingEvent) || !event.connection) return;

        event.connection.send(new ClientPongComposer());
    }

    private onAuthenticatedEvent(event: AuthenticatedEvent): void
    {
        if(!(event instanceof AuthenticatedEvent) || !event.connection) return;

        this.completeHandshake(event.connection);

        this.dispatchCommunicationDemoEvent(NitroCommunicationDemoEvent.CONNECTION_AUTHENTICATED, event.connection);

        //event.connection.send(new UserHomeRoomComposer(15867));

        event.connection.send(new UserInfoComposer());
    }

    public setSSO(sso: string): void
    {
        if(!sso || (sso === '') || this._sso) return;

        this._sso = sso;
    }

    private startHandshake(connection: IConnection): void
    {
        this.dispatchCommunicationDemoEvent(NitroCommunicationDemoEvent.CONNECTION_HANDSHAKING, connection);

        this._handShaking = true;
    }

    private completeHandshake(connection: IConnection): void
    {
        this.dispatchCommunicationDemoEvent(NitroCommunicationDemoEvent.CONNECTION_HANDSHAKED, connection);

        this._handShaking = false;
    }

    private dispatchCommunicationDemoEvent(type: string, connection: IConnection): void
    {
        Nitro.instance.events.dispatchEvent(new NitroCommunicationDemoEvent(type, connection));
    }
} 