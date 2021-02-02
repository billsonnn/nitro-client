import { NitroEvent } from '../../../../../client/core/events/NitroEvent';
import { RoomEngineTriggerWidgetEvent } from '../../../../../client/nitro/room/events/RoomEngineTriggerWidgetEvent';
import { RoomControllerLevel } from '../../../../../client/nitro/session/enum/RoomControllerLevel';
import { IRoomWidgetHandler } from '../../../../../client/nitro/ui/IRoomWidgetHandler';
import { IRoomWidgetHandlerContainer } from '../../../../../client/nitro/ui/IRoomWidgetHandlerContainer';
import { RoomWidgetEnum } from '../../../../../client/nitro/ui/widget/enums/RoomWidgetEnum';
import { RoomWidgetUpdateEvent } from '../../../../../client/nitro/ui/widget/events/RoomWidgetUpdateEvent';
import { RoomWidgetMessage } from '../../../../../client/nitro/ui/widget/messages/RoomWidgetMessage';
import { RoomEngineObjectEvent } from '../../../../../client/nitro/room/events/RoomEngineObjectEvent';
import { RoomObjectVariable } from '../../../../../client/nitro/room/object/RoomObjectVariable';
import { BackgroundColorFurniWidget } from '../furniture/backgroundcolor/backgroundcolor.component';

export class FurnitureBackgroundColorWidgetHandler implements IRoomWidgetHandler
{
    private _isDisposed: boolean = false;
    private _container: IRoomWidgetHandlerContainer = null;
    private _widget: BackgroundColorFurniWidget     = null;

    public dispose():void
    {
        this._isDisposed    = true;
        this._container     = null;
        this._widget        = null;
    }

    public processWidgetMessage(k: RoomWidgetMessage): RoomWidgetUpdateEvent
    {
        return null;
    }

    public processEvent(event: NitroEvent): void
    {
        switch(event.type)
        {
            case RoomEngineTriggerWidgetEvent.REQUEST_BACKGROUND_COLOR: {
                if(!this.canOpenBackgroundToner()) return;

                const roomEngineObjectEvent = <RoomEngineObjectEvent>event;

                const roomObject = this._container.roomEngine.getRoomObject(roomEngineObjectEvent.roomId, roomEngineObjectEvent.objectId, roomEngineObjectEvent.category);
                const model = roomObject.model;
                const hue = Number.parseInt(model.getValue(RoomObjectVariable.FURNITURE_ROOM_BACKGROUND_COLOR_HUE));
                const sat = Number.parseInt(model.getValue(RoomObjectVariable.FURNITURE_ROOM_BACKGROUND_COLOR_SATURATION));
                const light = Number.parseInt(model.getValue(RoomObjectVariable.FURNITURE_ROOM_BACKGROUND_COLOR_LIGHTNESS));


                this._widget.open(roomObject.id, hue, sat, light);
            }
                break;
        }
    }

    private canOpenBackgroundToner(): boolean
    {
        const isRoomOwner = this._container.roomSession.isRoomOwner;
        const hasLevel = this._container.roomSession.controllerLevel >= RoomControllerLevel.GUEST;
        const isGodMode = this._container.sessionDataManager.isGodMode;

        return isRoomOwner || hasLevel || isGodMode;
    }


    public set widget(widget: BackgroundColorFurniWidget)
    {
        this._widget = widget;
    }

    public get widget(): BackgroundColorFurniWidget
    {
        return this._widget;
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
        return RoomWidgetEnum.ROOM_BACKGROUND_COLOR;
    }

    public set container(k: IRoomWidgetHandlerContainer)
    {
        this._container = k;
    }

    public get container(): IRoomWidgetHandlerContainer
    {
        return this._container;
    }

    public get messageTypes(): string[]
    {
        return [];
    }

    public get eventTypes(): string[]
    {
        return [
            RoomEngineTriggerWidgetEvent.REQUEST_BACKGROUND_COLOR
        ];
    }
}
