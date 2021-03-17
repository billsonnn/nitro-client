import { NitroEvent } from 'nitro-renderer/src/core/events/NitroEvent';
import { RoomSessionDoorbellEvent } from 'nitro-renderer/src/nitro/session/events/RoomSessionDoorbellEvent';
import { IRoomWidgetHandler } from 'nitro-renderer/src/nitro/ui/IRoomWidgetHandler';
import { RoomWidgetEnum } from 'nitro-renderer/src/nitro/ui/widget/enums/RoomWidgetEnum';
import { RoomWidgetUpdateEvent } from 'nitro-renderer/src/nitro/ui/widget/events/RoomWidgetUpdateEvent';
import { RoomWidgetMessage } from 'nitro-renderer/src/nitro/ui/widget/messages/RoomWidgetMessage';
import { IRoomWidgetManager } from '../../IRoomWidgetManager';
import { RoomWidgetDoorbellEvent } from '../events/RoomWidgetDoorbellEvent';
import { RoomWidgetLetUserInMessage } from '../messages/RoomWidgetLetUserInMessage';


export class DoorbellWidgetHandler implements IRoomWidgetHandler
{
    private _isDisposed: boolean = false;
    private _container: IRoomWidgetManager = null;

    public dispose(): void
    {
        this._isDisposed = true;
        this._container = null;
    }

    public processWidgetMessage(k: RoomWidgetMessage): RoomWidgetUpdateEvent
    {
        if(!k || !this._container) return null;

        const letUserInMessage = <RoomWidgetLetUserInMessage>k;

        if(!letUserInMessage || letUserInMessage.type != RoomWidgetLetUserInMessage.RWLUIM_LET_USER_IN) return null;

        this._container.roomSession.sendDoorbellApprovalMessage(letUserInMessage.userName, letUserInMessage._Str_23117);
        return null;
    }

    public processEvent(event: NitroEvent): void
    {
        if(!event) return;

        const rsdEvent = <RoomSessionDoorbellEvent>event;

        if(!rsdEvent) return;

        switch(event.type)
        {
            case RoomSessionDoorbellEvent.RSDE_REJECTED:
                this._container.events.dispatchEvent(new RoomWidgetDoorbellEvent(RoomWidgetDoorbellEvent.REJECTED, rsdEvent.userName));
                return;
            case RoomSessionDoorbellEvent.DOORBELL:
                this._container.events.dispatchEvent(new RoomWidgetDoorbellEvent(RoomWidgetDoorbellEvent.RWDE_RINGING,rsdEvent.userName));
                return;
            case RoomSessionDoorbellEvent.RSDE_ACCEPTED:
                this._container.events.dispatchEvent(new RoomWidgetDoorbellEvent(RoomWidgetDoorbellEvent.RWDE_ACCEPTED, rsdEvent.userName));
                return;
        }
        return;
    }

    public update(): void
    {
    }


    public get disposed(): boolean
    {
        return this._isDisposed;
    }

    public get type(): string
    {
        return RoomWidgetEnum.DOORBELL;
    }

    public set container(k: IRoomWidgetManager)
    {
        this._container = k;
    }

    public get messageTypes(): string[]
    {
        return [RoomWidgetLetUserInMessage.RWLUIM_LET_USER_IN];
    }

    public get eventTypes(): string[]
    {
        return [
            RoomSessionDoorbellEvent.DOORBELL, RoomSessionDoorbellEvent.RSDE_REJECTED, RoomSessionDoorbellEvent.RSDE_ACCEPTED
        ];
    }
}
