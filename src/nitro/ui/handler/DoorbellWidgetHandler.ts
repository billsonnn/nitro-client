import { NitroEvent } from '../../../core/events/NitroEvent';
import { RoomSessionDoorbellEvent } from '../../session/events/RoomSessionDoorbellEvent';
import { IRoomWidgetHandler } from '../IRoomWidgetHandler';
import { IRoomWidgetHandlerContainer } from '../IRoomWidgetHandlerContainer';
import { RoomWidgetEnum } from '../widget/enums/RoomWidgetEnum';
import { RoomWidgetDoorbellEvent } from '../widget/events/RoomWidgetDoorbellEvent';
import { RoomWidgetUpdateEvent } from '../widget/events/RoomWidgetUpdateEvent';
import { RoomWidgetLetUserInMessage } from '../widget/messages/RoomWidgetLetUserInMessage';
import { RoomWidgetMessage } from '../widget/messages/RoomWidgetMessage';

export class DoorbellWidgetHandler implements IRoomWidgetHandler
{
    private _disposed: boolean;
    private _container: IRoomWidgetHandlerContainer;

    constructor()
    {
        this._disposed  = false;
        this._container = null;
    }

    public dispose(): void
    {
        this._disposed  = true;
        this._container = null;
    }

    public processWidgetMessage(message: RoomWidgetMessage): RoomWidgetUpdateEvent
    {
        switch(message.type)
        {
            case RoomWidgetLetUserInMessage.RWLUIM_LET_USER_IN:
                const letUserInMessage = (message as RoomWidgetLetUserInMessage);

                this._container.roomSession.sendDoorbellApprovalMessage(letUserInMessage.userName, letUserInMessage._Str_23117);
                break;
        }

        return null;
    }

    public processEvent(event: NitroEvent): void
    {
        switch(event.type)
        {
            case RoomSessionDoorbellEvent.RSDE_DOORBELL:
                const doorbellEvent = (event as RoomSessionDoorbellEvent);

                this._container.events.dispatchEvent(new RoomWidgetDoorbellEvent(RoomWidgetDoorbellEvent.RWDE_RINGING, doorbellEvent.userName));
                return;
            case RoomSessionDoorbellEvent.REJECTED:
                const doorbellRejectedEvent = (event as RoomSessionDoorbellEvent);

                this._container.events.dispatchEvent(new RoomWidgetDoorbellEvent(RoomWidgetDoorbellEvent.REJECTED, doorbellRejectedEvent.userName));
                return;
            case RoomSessionDoorbellEvent.RSDE_ACCEPTED:
                const doorbellAcceptedEvent = (event as RoomSessionDoorbellEvent);

                this._container.events.dispatchEvent(new RoomWidgetDoorbellEvent(RoomWidgetDoorbellEvent.RWDE_ACCEPTED, doorbellAcceptedEvent.userName));
                return;
        }
    }

    public update(): void
    {
    }

    public get disposed(): boolean
    {
        return this._disposed;
    }

    public get type(): string
    {
        return RoomWidgetEnum.DOORBELL;
    }

    public set container(k: IRoomWidgetHandlerContainer)
    {
        this._container = k;
    }

    public get messageTypes(): string[]
    {
        return [ RoomWidgetLetUserInMessage.RWLUIM_LET_USER_IN];
    }

    public get eventTypes(): string[]
    {
        return [ RoomSessionDoorbellEvent.RSDE_DOORBELL, RoomSessionDoorbellEvent.REJECTED, RoomSessionDoorbellEvent.RSDE_ACCEPTED ];
    }
}