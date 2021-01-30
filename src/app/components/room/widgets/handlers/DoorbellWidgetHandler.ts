import { NitroEvent } from '../../../../../client/core/events/NitroEvent';
import { IRoomWidgetHandler } from '../../../../../client/nitro/ui/IRoomWidgetHandler';
import { IRoomWidgetHandlerContainer } from '../../../../../client/nitro/ui/IRoomWidgetHandlerContainer';
import { RoomWidgetEnum } from '../../../../../client/nitro/ui/widget/enums/RoomWidgetEnum';
import { RoomWidgetUpdateEvent } from '../../../../../client/nitro/ui/widget/events/RoomWidgetUpdateEvent';
import { RoomWidgetMessage } from '../../../../../client/nitro/ui/widget/messages/RoomWidgetMessage';

import { RoomSessionDoorbellEvent } from '../../../../../client/nitro/session/events/RoomSessionDoorbellEvent';
import { RoomWidgetLetUserInMessage } from '../messages/RoomWidgetLetUserInMessage';
import { RoomWidgetDoorbellEvent } from '../events/RoomWidgetDoorbellEvent';

export class DoorbellWidgetHandler implements IRoomWidgetHandler
{
    private _isDisposed: boolean = false;
    private _container: IRoomWidgetHandlerContainer = null;

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

    public set container(k: IRoomWidgetHandlerContainer)
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
