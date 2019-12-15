import { IMessageConfiguration } from '../../core/communication/messages/IMessageConfiguration';
import { ClientPingEvent } from './messages/incoming/client/ClientPingEvent';
import { IncomingHeader } from './messages/incoming/IncomingHeader';
import { AuthenticatedEvent } from './messages/incoming/security/AuthenticatedEvent';
import { UserInfoEvent } from './messages/incoming/user/data/UserInfoEvent';
import { ClientPongComposer } from './messages/outgoing/client/ClientPongComposer';
import { ClientReleaseVersionComposer } from './messages/outgoing/client/ClientReleaseVersionComposer';
import { OutgoingHeader } from './messages/outgoing/OutgoingHeader';
import { SecurityTicketComposer } from './messages/outgoing/security/SecurityTicketComposer';
import { UserInfoComposer } from './messages/outgoing/user/data/UserInfoComposer';

export class NitroMessages implements IMessageConfiguration
{
    private _events: Map<number, Function>;
    private _composers: Map<number, Function>;

    constructor()
    {
        this._events    = new Map();
        this._composers = new Map();

        this.registerEvents();
        this.registerComposers();
    }
    
    private registerEvents(): void
    {
        // CLIENT
        this._events.set(IncomingHeader.CLIENT_PING, ClientPingEvent);

        // SECURITY
        this._events.set(IncomingHeader.AUTHENTICATED, AuthenticatedEvent);

        // USER

            // DATA
            this._events.set(IncomingHeader.USER_INFO, UserInfoEvent);
    }

    private registerComposers(): void
    {
        // CLIENT
        this._composers.set(OutgoingHeader.CLIENT_PONG, ClientPongComposer);
        this._composers.set(OutgoingHeader.RELEASE_VERSION, ClientReleaseVersionComposer);
        
        // SECURITY
        this._composers.set(OutgoingHeader.SECURITY_TICKET, SecurityTicketComposer);

        // USER
        this._composers.set(OutgoingHeader.USER_INFO, UserInfoComposer);
    }

    public get events(): Map<number, Function>
    {
        return this._events;
    }

    public get composers(): Map<number, Function>
    {
        return this._composers;
    }
}