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
import { Vector3d } from '../../room/utils/Vector3d';
import { FurnitureDiceActivateComposer } from '../communication/messages/outgoing/room/furniture/logic/FurnitureDiceActivateComposer';
import { FurnitureDiceDeactivateComposer } from '../communication/messages/outgoing/room/furniture/logic/FurnitureDiceDeactivateComposer';
import { FurnitureMultiStateComposer } from '../communication/messages/outgoing/room/furniture/logic/FurnitureMultiStateComposer';
import { FurnitureRandomStateComposer } from '../communication/messages/outgoing/room/furniture/logic/FurnitureRandomStateComposer';
import { FurnitureWallMultiStateComposer } from '../communication/messages/outgoing/room/furniture/logic/FurnitureWallMultiStateComposer';
import { RoomUnitWalkComposer } from '../communication/messages/outgoing/room/unit/RoomUnitWalkComposer';
import { RoomEngineDimmerStateEvent } from './events/RoomEngineDimmerStateEvent';
import { RoomObjectDimmerStateUpdateEvent } from './events/RoomObjectDimmerStateUpdateEvent';
import { RoomObjectFloorHoleEvent } from './events/RoomObjectFloorHoleEvent';
import { RoomObjectFurnitureActionEvent } from './events/RoomObjectFurnitureActionEvent';
import { RoomObjectHSLColorEnabledEvent } from './events/RoomObjectHSLColorEnabledEvent';
import { RoomObjectHSLColorEnableEvent } from './events/RoomObjectHSLColorEnableEvent';
import { RoomObjectStateChangedEvent } from './events/RoomObjectStateChangedEvent';
import { RoomObjectTileMouseEvent } from './events/RoomObjectTileMouseEvent';
import { IRoomEngineServices } from './IRoomEngineServices';
import { ObjectTileCursorUpdateMessage } from './messages/ObjectTileCursorUpdateMessage';
import { RoomObjectCategory } from './object/RoomObjectCategory';
import { RoomObjectOperationType } from './object/RoomObjectOperationType';
import { RoomObjectUserType } from './object/RoomObjectUserType';
import { RoomObjectVariable } from './object/RoomObjectVariable';

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
            case RoomObjectFloorHoleEvent.ADD_HOLE:
            case RoomObjectFloorHoleEvent.REMOVE_HOLE:
                this.onRoomObjectFloorHoleEvent(event as RoomObjectFloorHoleEvent, roomId);
                return;
            case RoomObjectFurnitureActionEvent.MOUSE_ARROW:
            case RoomObjectFurnitureActionEvent.MOUSE_BUTTON:
                this.handleMousePointer(event as RoomObjectFurnitureActionEvent, roomId);
                return;
            case RoomObjectHSLColorEnableEvent.ROOM_BACKGROUND_COLOR:
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
            case RoomObjectMouseEvent.MOUSE_ENTER:
                this.handleRoomObjectMouseEnterEvent(event, roomId);
                return;
            case RoomObjectMouseEvent.MOUSE_LEAVE:
                this.handleRoomObjectMouseLeaveEvent(event, roomId);
                return;
        }
    }

    private handleRoomObjectMouseClickEvent(event: RoomObjectMouseEvent, roomId: number): void
    {
        if(!event) return;

        let operation = RoomObjectOperationType.OBJECT_UNDEFINED;

        const selectedData = this._roomEngine.getSelectedRoomObjectData(roomId);

        if(selectedData) operation = selectedData.operation;

        let didWalk = false;
        let didMove = false;

        if(NitroConfiguration.WALKING_ENABLED)
        {
            if(!operation || (operation === RoomObjectOperationType.OBJECT_UNDEFINED))
            {
                didWalk = this._Str_23423(roomId, event);
            }
        }

        const category = this._roomEngine.getRoomObjectCategoryForType(event.objectType);

        switch(operation)
        {
            case RoomObjectOperationType.OBJECT_MOVE:
                if(category === RoomObjectCategory.ROOM)
                {
                    if(selectedData)
                    {
                        //this._Str_3571(_arg_2, _local_5.id, _local_5.category, RoomObjectOperationEnum.OBJECT_MOVE_TO);
                    }
                }
                
                else if(category === RoomObjectCategory.UNIT)
                {
                    if(selectedData && (event.objectType === RoomObjectUserType.MONSTER_PLANT))
                    {
                        //this._Str_3571(_arg_2, _local_5.id, _local_5.category, RoomObjectOperationEnum.OBJECT_MOVE_TO);
                    }

                    if(event._Str_3463 !== null)
                    {
                        //this._Str_11142(RoomObjectCategoryEnum.CONST_0, MouseEvent.CLICK, _local_9);
                    }

                    //this._Str_19253(_arg_2, _local_6, _local_8);
                }

                didMove = true;

                //if(event.objectId === -1) this._Str_17481(_arg_2, _local_6, _local_8);

                break;
            case RoomObjectOperationType.OBJECT_UNDEFINED:
                if(category === RoomObjectCategory.ROOM)
                {
                    if(!didWalk && (event instanceof RoomObjectTileMouseEvent)) this.onRoomObjectTileMouseEvent(roomId, event);
                }
                break;
        }

        if(category === RoomObjectCategory.ROOM)
        {
            
        }
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

            if(roomCursor && roomCursor.logic)
            {
                let newEvent: ObjectTileCursorUpdateMessage = null;

                if(event instanceof RoomObjectTileMouseEvent)
                {
                    newEvent = this._Str_23824(event, roomId);
                }

                else if(event.object && (event.object.id !== -1))
                {
                    if(NitroConfiguration.WALKING_ENABLED)
                    {
                        newEvent = this._Str_25124(category, roomId, event);
                    }
                }

                else
                {
                    newEvent = new ObjectTileCursorUpdateMessage(null, 0, false, event._Str_3463)
                }

                roomCursor.processUpdateMessage(newEvent);
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
    
    private handleRoomObjectMouseEnterEvent(event: RoomObjectMouseEvent, roomId: number): void
    {
        return;
    }

    private handleRoomObjectMouseLeaveEvent(event: RoomObjectMouseEvent, roomId: number): void
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

    private onRoomObjectFloorHoleEvent(event: RoomObjectFloorHoleEvent, roomId: number): void
    {
        if(!event) return;

        switch(event.type)
        {
            case RoomObjectFloorHoleEvent.ADD_HOLE:
                this._roomEngine.addRoomInstanceFloorHole(roomId, event.objectId);
                return;
            case RoomObjectFloorHoleEvent.REMOVE_HOLE:
                this._roomEngine.removeRoomInstanceFloorHole(roomId, event.objectId);
                return;
        }

        this.useObject(roomId, event.object.id, event.object.type, event.type);
    }

    private handleMousePointer(event: RoomObjectFurnitureActionEvent, roomId: number): void
    {
        if(!event) return;

        this._roomEngine.updateMousePointer(event.type, event.objectId, event.objectType);
    }

    private onHSLColorEnableEvent(event: RoomObjectHSLColorEnableEvent, roomId: number): void
    {
        if(!event || !this._roomEngine) return;

        switch(event.type)
        {
            case RoomObjectHSLColorEnableEvent.ROOM_BACKGROUND_COLOR:
                this._roomEngine.events.dispatchEvent(new RoomObjectHSLColorEnabledEvent(RoomObjectHSLColorEnabledEvent.ROOM_BACKGROUND_COLOR, roomId, event.enable, event.hue, event.saturation, event.lightness));
                return;
        }
    }

    private onRoomObjectTileMouseEvent(roomId: number, event: RoomObjectTileMouseEvent): void
    {
        if(!this._roomEngine || this._roomEngine.isDecorating || !this._roomEngine.roomSession) return;

        const session = this._roomEngine.roomSession.getSession(roomId);

        if(!session || session.isSpectator) return;

        this.sendWalkUpdate(event.tileX, event.tileY);
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
            else
            {
                this._roomEngine.connection.send(new FurnitureRandomStateComposer(objectId, state));
            }
        }

        else if(category === RoomObjectCategory.WALL)
        {
            this._roomEngine.connection.send(new FurnitureWallMultiStateComposer(objectId, state));
        }

        return true;
    }

    private sendWalkUpdate(x: number, y: number): void
    {
        if(!this._roomEngine || !this._roomEngine.connection) return;

        this._roomEngine.connection.send(new RoomUnitWalkComposer(x, y));
    }

    private _Str_25124(k: number, _arg_2: number, _arg_3: RoomObjectMouseEvent): ObjectTileCursorUpdateMessage
    {        
        if(k !== RoomObjectCategory.FLOOR) return null;

        const roomObject = this._roomEngine.getRoomObject(_arg_2, _arg_3.objectId, RoomObjectCategory.FLOOR);

        if(!roomObject) return null;

        const location = this._Str_21925(roomObject, _arg_3);

        if(!location) return null;
        
        const _local_6 = this._roomEngine.getFurnitureStackingHeightMap(_arg_2);
            
        if(!_local_6) return null;
        
        const _local_7 = location.x;
        const _local_8 = location.y;
        const _local_9 = location.z;
            
        return new ObjectTileCursorUpdateMessage(new Vector3d(_local_7, _local_8, roomObject.getLocation().z), _local_9, true, _arg_3._Str_3463);
    }

    private _Str_23423(k: number, _arg_2: RoomObjectMouseEvent): boolean
    {
        const _local_3 = this._roomEngine.getRoomObject(k, _arg_2.objectId, RoomObjectCategory.FLOOR);
        const _local_4 = this._Str_21925(_local_3, _arg_2);

        if(_local_4)
        {
            this.sendWalkUpdate(_local_4.x, _local_4.y);

            return true;
        }

        return false;
    }

    private _Str_21925(k: IRoomObject, _arg_2: RoomObjectMouseEvent): Vector3d
    {
        if(!k || !_arg_2) return null;

        const furniData = this._roomEngine.sessionData.getFloorItemDataByName(k.type);

        if(!furniData) return null;

        if(!furniData.data.canStandOn && !furniData.data.canSitOn && !furniData.data.canLayOn) return null;

        const model = k.model;

        if(!model) return null;

        const location  = k.getLocation();
        const direction = k.getDirection();

        let sizeX = model.getValue(RoomObjectVariable.FURNITURE_SIZE_X);
        let sizeY = model.getValue(RoomObjectVariable.FURNITURE_SIZE_Y);
        let sizeZ = model.getValue(RoomObjectVariable.FURNITURE_SIZE_Z);

        if((direction.x === 90) || (direction.x === 270)) [ sizeX, sizeY ] = [ sizeY, sizeX ];

        if(sizeX < 1) sizeX = 1;
        if(sizeY < 1) sizeY = 1;

        const renderingCanvas = this._roomEngine.getActiveRoomInstanceRenderingCanvas();

        if(!renderingCanvas) return null;

        const scale     = renderingCanvas.geometry.scale;
        const _local_13 = furniData.data.canSitOn ? 0.5 : 0;
        const _local_14 = ((((scale / 2) + _arg_2._Str_4595) + _arg_2.localX) / (scale / 4));
        const _local_15 = (((_arg_2._Str_4534 + _arg_2.localY) + (((sizeZ - _local_13) * scale) / 2)) / (scale / 4));
        const _local_16 = ((_local_14 + (2 * _local_15)) / 4);
        const _local_17 = ((_local_14 - (2 * _local_15)) / 4);
        const _local_18 = Math.round((location.x + _local_16));
        const _local_19 = Math.round(((location.y - _local_17) + 1));

        let _local_20 = false;

        if((_local_18 < location.x) || (_local_18 >= (location.x + sizeX))) _local_20 = true;
        else if((_local_19 < location.y) || (_local_19 >= (location.y + sizeY))) _local_20 = true;
        
        const _local_21 = furniData.data.canSitOn ? (sizeZ - 0.5) : sizeZ;
        
        if(!_local_20) return new Vector3d(_local_18, _local_19, _local_21);

        return null;
    }

    private _Str_23824(k:RoomObjectTileMouseEvent, _arg_2: number): ObjectTileCursorUpdateMessage
    {
        if(NitroConfiguration.WALKING_ENABLED)
        {
            return new ObjectTileCursorUpdateMessage(new Vector3d(k._Str_16836, k._Str_17676, k._Str_21459), 0, true, k._Str_3463);
        }
        // var _local_4:int;
        // var _local_5:int;
        // var _local_6:int;
        // var _local_7:IRoomInstance;
        // var _local_8:TileObjectMap;
        // var _local_9:IRoomObject;
        // var _local_10:FurniStackingHeightMap;
        // var _local_11:Number;
        // var _local_12:Number;
        // if (this._whereYouClickIsWhereYouGo)
        // {
        //     return new RoomObjectTileCursorUpdateMessage(new Vector3d(k._Str_16836, k._Str_17676, k._Str_21459), 0, true, k._Str_3463);
        // }
        // var _local_3:IRoomObjectController = this._roomEngine._Str_9577(_arg_2);
        // if (((!(_local_3 == null)) && (!(_local_3._Str_2377() == null))))
        // {
        //     _local_4 = k._Str_16836;
        //     _local_5 = k._Str_17676;
        //     _local_6 = k._Str_21459;
        //     _local_7 = this._roomEngine._Str_2881(_arg_2);
        //     if (_local_7 != null)
        //     {
        //         _local_8 = this._roomEngine._Str_15934(_arg_2);
        //         if (_local_8)
        //         {
        //             _local_9 = _local_8._Str_19056(_local_4, _local_5);
        //             _local_10 = this._roomEngine.getFurniStackingHeightMap(_arg_2);
        //             if (_local_10)
        //             {
        //                 if ((((_local_9) && (_local_9.getModel())) && (_local_9.getModel().getNumber(RoomObjectVariableEnum.FURNITURE_IS_VARIABLE_HEIGHT) > 0)))
        //                 {
        //                     _local_11 = _local_10._Str_2754(_local_4, _local_5);
        //                     _local_12 = this._roomEngine._Str_5364(_arg_2)._Str_2754(_local_4, _local_5);
        //                     return new RoomObjectTileCursorUpdateMessage(new Vector3d(_local_4, _local_5, _local_6), (_local_11 - _local_12), true, k._Str_3463);
        //                 }
        //                 return new RoomObjectTileCursorUpdateMessage(new Vector3d(_local_4, _local_5, _local_6), 0, true, k._Str_3463);
        //             }
        //         }
        //     }
        // }
        return null;
    }

    public get engine(): IRoomEngineServices
    {
        return this._roomEngine;
    }
}