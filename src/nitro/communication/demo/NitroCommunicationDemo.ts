import { NitroManager } from '../../../core/common/NitroManager';
import { WebSocketEventEnum } from '../../../core/communication/connections/enums/WebSocketEventEnum';
import { IConnection } from '../../../core/communication/connections/IConnection';
import { NitroEvent } from '../../../core/events/NitroEvent';
import { NitroInstance } from '../../NitroInstance';
import { NitroCommunicationEventEnum } from '../enums/NitroCommunicationEventEnum';
import { INitroCommunicationManager } from '../INitroCommunicationManager';
import { ClientPingEvent } from '../messages/incoming/client/ClientPingEvent';
import { AuthenticatedEvent } from '../messages/incoming/security/AuthenticatedEvent';
import { ClientPongComposer } from '../messages/outgoing/client/ClientPongComposer';
import { ClientReleaseVersionComposer } from '../messages/outgoing/client/ClientReleaseVersionComposer';
import { SecurityTicketComposer } from '../messages/outgoing/security/SecurityTicketComposer';
import { UserInfoComposer } from '../messages/outgoing/user/data/UserInfoComposer';

export class NitroCommunicationDemo extends NitroManager
{
    private _communication: INitroCommunicationManager;

    private _sso: string;
    private _handShaking: boolean;

    constructor(communication: INitroCommunicationManager)
    {
        super();

        this._communication = communication;

        this._sso           = null;
        this._handShaking   = false;
    }

    protected onInit(): void
    {
        const connection = this._communication.connection;

        if(connection)
        {
            connection.addEventListener(WebSocketEventEnum.CONNECTION_OPENED, this.onConnectionOpenedEvent.bind(this));
            connection.addEventListener(WebSocketEventEnum.CONNECTION_CLOSED, this.onConnectionClosedEvent.bind(this));
        }

        this._communication.registerMessageEvent(new ClientPingEvent(this.onClientPingEvent.bind(this)));
        this._communication.registerMessageEvent(new AuthenticatedEvent(this.onAuthenticatedEvent.bind(this)));

        this.setSSO();
    }

    protected onDispose(): void
    {
        const connection = this._communication.connection;

        if(connection)
        {
            connection.removeEventListener(WebSocketEventEnum.CONNECTION_OPENED, this.onConnectionOpenedEvent.bind(this));
            connection.removeEventListener(WebSocketEventEnum.CONNECTION_CLOSED, this.onConnectionClosedEvent.bind(this));
        }

        this._sso           = null;
        this._handShaking   = false;
    }

    private onConnectionOpenedEvent(event: Event): void
    {
        const connection = this._communication.connection;

        if(!connection) return;

        this.dispatchEvent(NitroCommunicationEventEnum.CONNECTION_ESTABLISHED);

        this.startHandshake(connection);

        connection.send(new ClientReleaseVersionComposer());

        this.tryAuthentication(connection);
    }

    private onConnectionClosedEvent(event: CloseEvent): void
    {
        console.log('The connection was closed');
    }

    private tryAuthentication(connection: IConnection): void
    {
        if(!connection || !this._sso) return;

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

        this.dispatchEvent(NitroCommunicationEventEnum.CONNECTION_AUTHENTICATED);

        event.connection.send(new UserInfoComposer());
    }

    private setSSO(): void
    {
        this._sso = null;

        const params = new URLSearchParams(window.location.search);

        const sso = params.get('sso');

        if(!sso)
        {
            console.log('Login without an SSO ticket is not supported');

            return;
        }
        
        this._sso = sso;
    }

    private startHandshake(connection: IConnection): void
    {
        this.dispatchEvent(NitroCommunicationEventEnum.CONNECTION_HANDSHAKING);

        this._handShaking = true;
    }

    private completeHandshake(connection: IConnection): void
    {
        this.dispatchEvent(NitroCommunicationEventEnum.CONNECTION_HANDSHAKED);

        this._handShaking = false;
    }

    private dispatchEvent(type: string): void
    {
        NitroInstance.instance.events.dispatchEvent(new NitroEvent(type));
    }
} 