import { Disposable } from '../../core/common/disposable/Disposable';
import { NitroLogger } from '../../core/common/logger/NitroLogger';
import { NitroConfiguration } from '../../NitroConfiguration';
import { RoomObjectEvent } from '../../room/events/RoomObjectEvent';
import { RoomObjectMouseEvent } from '../../room/events/RoomObjectMouseEvent';
import { RoomSpriteMouseEvent } from '../../room/events/RoomSpriteMouseEvent';
import { IRoomObject } from '../../room/object/IRoomObject';
import { IRoomObjectController } from '../../room/object/IRoomObjectController';
import { IRoomCanvasMouseListener } from '../../room/renderer/IRoomCanvasMouseListener';
import { IRoomGeometry } from '../../room/utils/IRoomGeometry';
import { FurnitureDiceActivateComposer } from '../communication/messages/outgoing/room/furniture/logic/FurnitureDiceActivateComposer';
import { FurnitureDiceDeactivateComposer } from '../communication/messages/outgoing/room/furniture/logic/FurnitureDiceDeactivateComposer';
import { FurnitureMultiStateComposer } from '../communication/messages/outgoing/room/furniture/logic/FurnitureMultiStateComposer';
import { RoomEngineDimmerStateEvent } from './events/RoomEngineDimmerStateEvent';
import { RoomObjectDimmerStateUpdateEvent } from './events/RoomObjectDimmerStateUpdateEvent';
import { RoomObjectFurnitureActionEvent } from './events/RoomObjectFurnitureActionEvent';
import { RoomObjectHSLColorEnabledEvent } from './events/RoomObjectHSLColorEnabledEvent';
import { RoomObjectHSLColorEnableEvent } from './events/RoomObjectHSLColorEnableEvent';
import { RoomObjectStateChangedEvent } from './events/RoomObjectStateChangedEvent';
import { IRoomEngineServices } from './IRoomEngineServices';
import { ObjectTileCursorUpdateMessage } from './messages/ObjectTileCursorUpdateMessage';
import { RoomObjectCategory } from './object/RoomObjectCategory';
import { RoomObjectOperationType } from './object/RoomObjectOperationType';

export class RoomObjectEventHandler extends Disposable implements IRoomCanvasMouseListener
{
    private _roomEngine: IRoomEngineServices;

    private _eventIds: Map<number, string>;

    private _selectedObject: IRoomObjectController;

    constructor(roomEngine: IRoomEngineServices)
    {
        super();

        this._roomEngine        = roomEngine;

        this._eventIds          = new Map();
        this._selectedObject    = null;
    }

    public _Str_20330(event: RoomSpriteMouseEvent, object: IRoomObject, geometry: IRoomGeometry): void
    {
        if(!event || !object) return;

        // const type = object.type;

        // let category = this._roomEngine.getRoomObjectCategoryForType(type);
        // let _local_6 = category;

        // if(category !== RoomObjectCategory.ROOM) category = RoomObjectCategory.MINIMUM;

        // var _local_7:String = this._Str_18648(category, event.type);
        // if (_local_7 == event._Str_3463)
        // {
        //     if ((((((event.type == MouseEvent.CLICK) || (event.type == MouseEvent.DOUBLE_CLICK)) || (event.type == MouseEvent.MOUSE_DOWN)) || (event.type == MouseEvent.MOUSE_UP)) || (event.type == MouseEvent.MOUSE_MOVE)))
        //     {
        //         return;
        //     }
        // }
        // else
        // {
        //     if (event._Str_3463 != null)
        //     {
        //         this._Str_11142(category, event.type, event._Str_3463);
        //     }
        // }

        const mouseHandler = object.mouseHandler;

        if(mouseHandler)
        {
            mouseHandler.mouseEvent(event, geometry);
        }
    }

    private _Str_18648(k: number, _arg_2: string): string
    {
        return null;
        // var _local_3:Map = (this._eventIds.getValue(String(k)) as Map);
        // if (_local_3 == null)
        // {
        //     return null;
        // }
        // var _local_4:String = (_local_3.getValue(_arg_2) as String);
        // return _local_4;
    }

    public handleRoomObjectEvent(event: RoomObjectEvent, roomId: number): void
    {
        if(!event) return;

        if(event instanceof RoomObjectMouseEvent)
        {
            this.handleRoomObjectMouseEvent(event, roomId);

            return;
        }

        switch(event.type)
        {
            case RoomObjectStateChangedEvent.STATE_CHANGE:
                this.onStateChangeEvent(event as RoomObjectStateChangedEvent, roomId);
                return;
            case RoomObjectStateChangedEvent.STATE_RANDOM:
                this.onStateChangeRandomEvent(event as RoomObjectStateChangedEvent, roomId);
                return;
            case RoomObjectDimmerStateUpdateEvent.DIMMER_STATE:
                this.onRoomObjectDimmerStateUpdateEvent(event as RoomObjectDimmerStateUpdateEvent, roomId);
                return;
            case RoomObjectFurnitureActionEvent.DICE_ACTIVATE:
            case RoomObjectFurnitureActionEvent.DICE_OFF:
                this.onFurnitureActionEvent(event as RoomObjectFurnitureActionEvent, roomId);
                return;
            case RoomObjectFurnitureActionEvent.MOUSE_ARROW:
            case RoomObjectFurnitureActionEvent.MOUSE_BUTTON:
                //console.log(event);
                return;
            case RoomObjectHSLColorEnableEvent.ROHSLCEE_ROOM_BACKGROUND_COLOR:
                this.onHSLColorEnableEvent(event as RoomObjectHSLColorEnableEvent, roomId);
                return;
            default:
                NitroLogger.log(`Unhandled Event: ${ event.constructor.name }`, `Object ID: ${ event.object.id }`);
                return;
        }
    }

    private handleRoomObjectMouseEvent(event: RoomObjectMouseEvent, roomId: number): void
    {
        if(!event || !event.type) return;

        switch(event.type)
        {
            case RoomObjectMouseEvent.CLICK:
                this.handleRoomObjectMouseClickEvent(event, roomId);
                return;
            case RoomObjectMouseEvent.MOUSE_MOVE:
                this.handleRoomObjectMouseMoveEvent(event, roomId);
                return;
            case RoomObjectMouseEvent.MOUSE_DOWN:
                this.handleRoomObjectMouseDownEvent(event, roomId);
                return;
            case RoomObjectMouseEvent.MOUSE_UP:
                this.handleRoomObjectMouseUpEvent(event, roomId);
                return;
        }
    }

    private handleRoomObjectMouseClickEvent(event: RoomObjectMouseEvent, roomId: number): void
    {
        return;
    }

    private handleRoomObjectMouseMoveEvent(event: RoomObjectMouseEvent, roomId: number): void
    {
        if(!event) return;

        let operation = RoomObjectOperationType.OBJECT_UNDEFINED;

        const selectedData = this._roomEngine.getSelectedRoomObjectData(roomId);

        if(selectedData) operation = selectedData.operation;

        const category = this._roomEngine.getRoomObjectCategoryForType(event.objectType);

        if(this._roomEngine)
        {
            const roomCursor = this._roomEngine.getRoomObjectCursor(roomId);

            if(roomCursor)
            {
                if(event.object && (event.object.id !== -1))
                {
                    if(NitroConfiguration.WALKING_ENABLED)
                    {
                        console.log('do dis')
                    }
                }
                else
                {
                    roomCursor.processUpdateMessage(new ObjectTileCursorUpdateMessage(null, 0, false, event._Str_3463));
                }
            }
        }

        switch(operation)
        {
            case RoomObjectOperationType.OBJECT_MOVE:
                //if(category === RoomObjectCategory.ROOM) this.moveObject(event, roomId);
                return;
            case RoomObjectOperationType.OBJECT_PLACE:
                return;
        }
    }

    private handleRoomObjectMouseDownEvent(event: RoomObjectMouseEvent, roomId: number): void
    {
        return;
    }

    private handleRoomObjectMouseUpEvent(event: RoomObjectMouseEvent, roomId: number): void
    {
        return;
    }

    private onStateChangeEvent(event: RoomObjectStateChangedEvent, roomId: number): void
    {
        if(!event) return;

        this.updateRoomObjectState(roomId, event.object.id, event.object.type, event.state, false);
    }

    private onStateChangeRandomEvent(event: RoomObjectStateChangedEvent, roomId: number): void
    {
        if(!event) return;

        this.updateRoomObjectState(roomId, event.object.id, event.object.type, event.state, true);
    }

    private onRoomObjectDimmerStateUpdateEvent(event: RoomObjectDimmerStateUpdateEvent, roomId: number): void
    {
        if(!event) return;

        switch(event.type)
        {
            case RoomObjectDimmerStateUpdateEvent.DIMMER_STATE:
                this._roomEngine.events.dispatchEvent(new RoomEngineDimmerStateEvent(roomId, event.state, event._Str_14686, event._Str_6815, event.color, event._Str_5123));
                return;
        }
    }

    private onFurnitureActionEvent(event: RoomObjectFurnitureActionEvent, roomId: number): void
    {
        if(!event) return;

        this.useObject(roomId, event.object.id, event.object.type, event.type);
    }

    private onHSLColorEnableEvent(event: RoomObjectHSLColorEnableEvent, roomId: number): void
    {
        if(!event || !this._roomEngine) return;

        switch(event.type)
        {
            case RoomObjectHSLColorEnableEvent.ROHSLCEE_ROOM_BACKGROUND_COLOR:
                this._roomEngine.events.dispatchEvent(new RoomObjectHSLColorEnabledEvent(RoomObjectHSLColorEnabledEvent.ROOM_BACKGROUND_COLOR, roomId, event.enable, event.hue, event.saturation, event.lightness));
                return;
        }
    }

    private updateRoomObjectState(roomId: number, objectId: number, type: string, state: number, isRandom: boolean): void
    {
        const category = this._roomEngine.getRoomObjectCategoryForType(type);

        this.sendStateUpdate(roomId, objectId, category, state, isRandom);
    }

    private useObject(roomId: number, objectId: number, type: string, action: string): void
    {
        if(!this._roomEngine || !this._roomEngine.connection) return;

        switch(action)
        {
            case RoomObjectFurnitureActionEvent.DICE_ACTIVATE:
                this._roomEngine.connection.send(new FurnitureDiceActivateComposer(objectId));
                return;
            case RoomObjectFurnitureActionEvent.DICE_OFF:
                this._roomEngine.connection.send(new FurnitureDiceDeactivateComposer(objectId));
                return;
            case RoomObjectFurnitureActionEvent.USE_HABBOWHEEL:
                return;
            case RoomObjectFurnitureActionEvent.STICKIE:
                return;
            case RoomObjectFurnitureActionEvent.ENTER_ONEWAYDOOR:
                return;
        }
    }

    private sendStateUpdate(roomId: number, objectId: number, category: number, state: number, isRandom: boolean): boolean
    {
        if(!this._roomEngine || !this._roomEngine.connection) return true;

        if(category === RoomObjectCategory.FLOOR)
        {
            if(!isRandom)
            {
                this._roomEngine.connection.send(new FurnitureMultiStateComposer(objectId, state));
            }
        }
        else
        {
            if(category === RoomObjectCategory.WALL)
            {

            }
        }

        return true;
    }

    public get engine(): IRoomEngineServices
    {
        return this._roomEngine;
    }
}