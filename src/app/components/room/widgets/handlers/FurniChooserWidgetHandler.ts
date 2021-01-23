import { NitroEvent } from '../../../../../client/core/events/NitroEvent';
import { RoomEngineDimmerStateEvent } from '../../../../../client/nitro/room/events/RoomEngineDimmerStateEvent';
import { RoomEngineTriggerWidgetEvent } from '../../../../../client/nitro/room/events/RoomEngineTriggerWidgetEvent';
import { RoomSessionDimmerPresetsEvent } from '../../../../../client/nitro/session/events/RoomSessionDimmerPresetsEvent';
import { IRoomWidgetHandler } from '../../../../../client/nitro/ui/IRoomWidgetHandler';
import { IRoomWidgetHandlerContainer } from '../../../../../client/nitro/ui/IRoomWidgetHandlerContainer';
import { RoomWidgetEnum } from '../../../../../client/nitro/ui/widget/enums/RoomWidgetEnum';
import { RoomWidgetUpdateEvent } from '../../../../../client/nitro/ui/widget/events/RoomWidgetUpdateEvent';
import { RoomWidgetMessage } from '../../../../../client/nitro/ui/widget/messages/RoomWidgetMessage';

export class FurniChooserWidgetHandler implements IRoomWidgetHandler
{
    private _isDisposed: boolean = false;
    private _container: IRoomWidgetHandlerContainer = null;

    public dispose():void
    {
        this._isDisposed    = true;
        this._container     = null;
    }

    public processWidgetMessage(k: RoomWidgetMessage): RoomWidgetUpdateEvent
    {
        return null;
    }

    public processEvent(event: NitroEvent): void
    {

    }

    public update():void
    {
    }



    public get disposed(): boolean
    {
        return this._isDisposed;
    }

    public get type(): string
    {
        return RoomWidgetEnum.ROOM_DIMMER;
    }

    public set container(k: IRoomWidgetHandlerContainer)
    {
        this._container = k;
    }

    public get messageTypes(): string[]
    {
        return null;
    }

    public get eventTypes(): string[]
    {
        return [
            RoomSessionDimmerPresetsEvent.RSDPE_PRESETS,
            RoomEngineDimmerStateEvent.ROOM_COLOR,
            RoomEngineTriggerWidgetEvent.REMOVE_DIMMER
        ];
    }
}
