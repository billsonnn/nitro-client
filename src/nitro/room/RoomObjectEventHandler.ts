import { Disposable } from '../../core/common/disposable/Disposable';
import { NitroLogger } from '../../core/common/logger/NitroLogger';
import { RoomObjectEvent } from '../../room/events/RoomObjectEvent';
import { RoomObjectMouseEvent } from '../../room/events/RoomObjectMouseEvent';
import { RoomSpriteMouseEvent } from '../../room/events/RoomSpriteMouseEvent';
import { RoomObjectUpdateMessage } from '../../room/messages/RoomObjectUpdateMessage';
import { IRoomObject } from '../../room/object/IRoomObject';
import { IRoomObjectController } from '../../room/object/IRoomObjectController';
import { IRoomCanvasMouseListener } from '../../room/renderer/IRoomCanvasMouseListener';
import { IRoomGeometry } from '../../room/utils/IRoomGeometry';
import { IVector3D } from '../../room/utils/IVector3D';
import { RoomEnterEffect } from '../../room/utils/RoomEnterEffect';
import { Vector3d } from '../../room/utils/Vector3d';
import { FurnitureFloorUpdateComposer } from '../communication/messages/outgoing/room/furniture/floor/FurnitureFloorUpdateComposer';
import { FurniturePickupComposer } from '../communication/messages/outgoing/room/furniture/FurniturePickupComposer';
import { FurnitureColorWheelComposer } from '../communication/messages/outgoing/room/furniture/logic/FurnitureColorWheelComposer';
import { FurnitureDiceActivateComposer } from '../communication/messages/outgoing/room/furniture/logic/FurnitureDiceActivateComposer';
import { FurnitureDiceDeactivateComposer } from '../communication/messages/outgoing/room/furniture/logic/FurnitureDiceDeactivateComposer';
import { FurnitureMultiStateComposer } from '../communication/messages/outgoing/room/furniture/logic/FurnitureMultiStateComposer';
import { FurnitureRandomStateComposer } from '../communication/messages/outgoing/room/furniture/logic/FurnitureRandomStateComposer';
import { FurnitureWallMultiStateComposer } from '../communication/messages/outgoing/room/furniture/logic/FurnitureWallMultiStateComposer';
import { FurnitureWallUpdateComposer } from '../communication/messages/outgoing/room/furniture/wall/FurnitureWallUpdateComposer';
import { RoomUnitLookComposer } from '../communication/messages/outgoing/room/unit/RoomUnitLookComposer';
import { RoomUnitWalkComposer } from '../communication/messages/outgoing/room/unit/RoomUnitWalkComposer';
import { MouseEventType } from '../ui/MouseEventType';
import { RoomEngineDimmerStateEvent } from './events/RoomEngineDimmerStateEvent';
import { RoomEngineObjectEvent } from './events/RoomEngineObjectEvent';
import { RoomEngineObjectPlacedOnUserEvent } from './events/RoomEngineObjectPlacedOnUserEvent';
import { RoomObjectBadgeAssetEvent } from './events/RoomObjectBadgeAssetEvent';
import { RoomObjectDimmerStateUpdateEvent } from './events/RoomObjectDimmerStateUpdateEvent';
import { RoomObjectFloorHoleEvent } from './events/RoomObjectFloorHoleEvent';
import { RoomObjectFurnitureActionEvent } from './events/RoomObjectFurnitureActionEvent';
import { RoomObjectHSLColorEnabledEvent } from './events/RoomObjectHSLColorEnabledEvent';
import { RoomObjectHSLColorEnableEvent } from './events/RoomObjectHSLColorEnableEvent';
import { RoomObjectMoveEvent } from './events/RoomObjectMoveEvent';
import { RoomObjectStateChangedEvent } from './events/RoomObjectStateChangedEvent';
import { RoomObjectTileMouseEvent } from './events/RoomObjectTileMouseEvent';
import { RoomObjectWallMouseEvent } from './events/RoomObjectWallMouseEvent';
import { IRoomEngineServices } from './IRoomEngineServices';
import { ObjectAvatarSelectedMessage } from './messages/ObjectAvatarSelectedMessage';
import { ObjectDataUpdateMessage } from './messages/ObjectDataUpdateMessage';
import { ObjectSelectedMessage } from './messages/ObjectSelectedMessage';
import { ObjectTileCursorUpdateMessage } from './messages/ObjectTileCursorUpdateMessage';
import { ObjectVisibilityUpdateMessage } from './messages/ObjectVisibilityUpdateMessage';
import { IObjectData } from './object/data/IObjectData';
import { RoomObjectCategory } from './object/RoomObjectCategory';
import { RoomObjectOperationType } from './object/RoomObjectOperationType';
import { RoomObjectUserType } from './object/RoomObjectUserType';
import { RoomObjectVariable } from './object/RoomObjectVariable';
import { FurnitureStackingHeightMap } from './utils/FurnitureStackingHeightMap';
import { SelectedRoomObjectData } from './utils/SelectedRoomObjectData';

export class RoomObjectEventHandler extends Disposable implements IRoomCanvasMouseListener
{
    private _roomEngine: IRoomEngineServices;

    private _eventIds: Map<number, Map<string, string>>;

    private _selectedAvatarId: number;
    private _selectedObjectId: number;
    private _selectedObjectCategory: number;
    private _whereYouClickIsWhereYouGo: boolean;
    private _objectPlacementSource: string;

    constructor(roomEngine: IRoomEngineServices)
    {
        super();

        this._roomEngine                = roomEngine;

        this._eventIds                  = new Map();

        this._selectedAvatarId          = -1;
        this._selectedObjectId          = -1;
        this._selectedObjectCategory    = -1;
        this._whereYouClickIsWhereYouGo = true;
        this._objectPlacementSource     = null;
    }

    public dispose(): void
    {
        if(this._eventIds)
        {
            this._eventIds = null;
        }

        this._roomEngine = null;
    }

    public _Str_20330(event: RoomSpriteMouseEvent, object: IRoomObject, geometry: IRoomGeometry): void
    {
        if(!event || !object) return;

        if(RoomEnterEffect._Str_1349()) return;

        const type = object.type;

        let category = this._roomEngine.getRoomObjectCategoryForType(type);

        if(category !== RoomObjectCategory.ROOM) category = RoomObjectCategory.MINIMUM;

        const _local_7 = this._Str_18648(category, event.type);

        if(_local_7 === event._Str_3463)
        {
            if((event.type === MouseEventType.MOUSE_CLICK) || (event.type === MouseEventType.DOUBLE_CLICK) || (event.type === MouseEventType.MOUSE_DOWN) || (event.type === MouseEventType.MOUSE_UP) || (event.type === MouseEventType.MOUSE_MOVE)) return;
        }
        else
        {
            if(event._Str_3463) this._Str_11142(category, event.type, event._Str_3463);
        }

        if(object.mouseHandler) object.mouseHandler.mouseEvent(event, geometry);
    }

    private _Str_18648(k: number, _arg_2: string): string
    {
        const existing = this._eventIds.get(k);

        if(!existing) return null;

        return existing.get(_arg_2);
    }

    private _Str_11142(k: number, _arg_2: string, _arg_3: string): void
    {
        let _local_4 = this._eventIds.get(k);

        if(!_local_4)
        {
            _local_4 = new Map();

            this._eventIds.set(k, _local_4);
        }

        _local_4.delete(_arg_2);
        _local_4.set(_arg_2, _arg_3);
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
            case RoomObjectStateChangedEvent.STATE_RANDOM:
                this.onRoomObjectStateChangedEvent(event as RoomObjectStateChangedEvent, roomId);
                return;
            case RoomObjectDimmerStateUpdateEvent.DIMMER_STATE:
                this.onRoomObjectDimmerStateUpdateEvent(event as RoomObjectDimmerStateUpdateEvent, roomId);
                return;
            case RoomObjectMoveEvent.POSITION_CHANGED:
            case RoomObjectMoveEvent.OBJECT_REMOVED:
                this.onRoomObjectMoveEvent(event as RoomObjectMoveEvent, roomId);
                return;
            case RoomObjectFurnitureActionEvent.DICE_ACTIVATE:
            case RoomObjectFurnitureActionEvent.DICE_OFF:
            case RoomObjectFurnitureActionEvent.USE_HABBOWHEEL:
            case RoomObjectFurnitureActionEvent.STICKIE:
            case RoomObjectFurnitureActionEvent.ENTER_ONEWAYDOOR:
                this.onFurnitureActionEvent(event as RoomObjectFurnitureActionEvent, roomId);
                return;
            case RoomObjectFloorHoleEvent.ADD_HOLE:
            case RoomObjectFloorHoleEvent.REMOVE_HOLE:
                this.onRoomObjectFloorHoleEvent(event as RoomObjectFloorHoleEvent, roomId);
                return;
            case RoomObjectBadgeAssetEvent.LOAD_BADGE:
                this.onRoomObjectBadgeAssetEvent(event as RoomObjectBadgeAssetEvent, roomId);
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

        const selectedData = this.getSelectedRoomObjectData(roomId);

        if(selectedData) operation = selectedData.operation;

        let didWalk = false;
        let didMove = false;

        if(this._whereYouClickIsWhereYouGo)
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
                        this._Str_3571(roomId, selectedData.id, selectedData.category, RoomObjectOperationType.OBJECT_MOVE_TO);
                    }
                }
                
                else if(category === RoomObjectCategory.UNIT)
                {
                    if(selectedData && (event.objectType === RoomObjectUserType.MONSTER_PLANT))
                    {
                        this._Str_3571(roomId, selectedData.id, selectedData.category, RoomObjectOperationType.OBJECT_MOVE_TO);
                    }

                    if(event._Str_3463 !== null)
                    {
                        this._Str_11142(RoomObjectCategory.ROOM, MouseEventType.MOUSE_CLICK, event._Str_3463);
                    }

                    this._Str_19253(roomId, event.objectId, category);
                }

                didMove = true;

                if(event.objectId === -1) this._Str_17481(roomId, event.objectId, category);

                break;
            case RoomObjectOperationType.OBJECT_PLACE:
                if(category === RoomObjectCategory.ROOM)
                {
                    this._Str_19271(roomId, (event instanceof RoomObjectTileMouseEvent), (event instanceof RoomObjectWallMouseEvent));
                }

                else if(category === RoomObjectCategory.UNIT)
                {
                    switch(event.objectType)
                    {
                        case RoomObjectUserType.MONSTER_PLANT:
                        case RoomObjectUserType.RENTABLE_BOT:
                            this._Str_19271(roomId, (event instanceof RoomObjectTileMouseEvent), (event instanceof RoomObjectWallMouseEvent));
                            break;
                        default:
                            if(event._Str_3463)
                            {
                                this._Str_11142(RoomObjectCategory.ROOM, MouseEventType.MOUSE_CLICK, event._Str_3463);
                            }

                            this._Str_19253(roomId, event.objectId, category);
                            break;
                    }
                }
                break;
            case RoomObjectOperationType.OBJECT_UNDEFINED:
                if(category === RoomObjectCategory.ROOM)
                {
                    if(!didWalk && (event instanceof RoomObjectTileMouseEvent)) this.onRoomObjectTileMouseEvent(roomId, event);
                }
                else
                {
                    this._Str_17481(roomId, event.objectId, category);

                    let _local_14 = false;

                    if(category === RoomObjectCategory.UNIT)
                    {
                        if(event.ctrlKey && !event.altKey && !event.shiftKey && (event.objectType === RoomObjectUserType.RENTABLE_BOT))
                        {
                            this._Str_3571(roomId, event.objectId, category, RoomObjectOperationType.OBJECT_PICKUP_BOT);
                        }

                        else if(event.ctrlKey && !event.altKey && !event.shiftKey && (event.objectType === RoomObjectUserType.MONSTER_PLANT))
                        {
                            this._Str_3571(roomId, event.objectId, category, RoomObjectOperationType.OBJECT_PICKUP_PET);
                        }

                        else if(!event.ctrlKey && !event.altKey && event.shiftKey && (event.objectType === RoomObjectUserType.MONSTER_PLANT))
                        {
                            this._Str_3571(roomId, event.objectId, category, RoomObjectOperationType.OBJECT_ROTATE_POSITIVE);
                        }

                        didWalk = true;
                    }

                    else if((category === RoomObjectCategory.FLOOR) || (category === RoomObjectCategory.WALL))
                    {
                        if((event.altKey || event.ctrlKey || event.shiftKey) && !this._roomEngine._Str_6374)
                        {
                            if(!event.ctrlKey && !event.altKey && event.shiftKey)
                            {
                                if(category === RoomObjectCategory.FLOOR)
                                {
                                    if(this._roomEngine.events)
                                    {
                                        this._roomEngine.events.dispatchEvent(new RoomEngineObjectEvent(RoomEngineObjectEvent.REQUEST_ROTATE, roomId, event.objectId, category));
                                    }
                                }
                            }

                            else if(event.ctrlKey && !event.altKey && !event.shiftKey)
                            {
                                this._Str_3571(roomId, event.objectId, category, RoomObjectOperationType.OBJECT_PICKUP);
                            }

                            didWalk = false;
                        }
                    }

                    if(event._Str_3463)
                    {
                        if(didWalk)
                        {
                            this._Str_11142(RoomObjectCategory.ROOM, MouseEventType.MOUSE_CLICK, event._Str_3463);
                        }
                        else
                        {
                            this._Str_11142(RoomObjectCategory.MINIMUM, MouseEventType.MOUSE_CLICK, event._Str_3463);
                        }
                    }
                }
                break;
        }

        if(category === RoomObjectCategory.ROOM)
        {
            const _local_15 = this._Str_18648(RoomObjectCategory.MINIMUM, MouseEventType.MOUSE_CLICK);
            const _local_16 = this._Str_18648(RoomObjectCategory.UNIT, MouseEventType.MOUSE_CLICK);

            if((_local_15 !== event._Str_3463) && (_local_16 !== event._Str_3463) && !didMove)
            {
                this._Str_16209(roomId);

                if(this._roomEngine.events)
                {
                    this._roomEngine.events.dispatchEvent(new RoomEngineObjectEvent(RoomEngineObjectEvent.DESELECTED, roomId, -1, RoomObjectCategory.MINIMUM));
                }

                this._Str_12227(roomId, 0, false);
            }
        }
    }

    private handleRoomObjectMouseMoveEvent(event: RoomObjectMouseEvent, roomId: number): void
    {
        if(!event) return;

        let operation = RoomObjectOperationType.OBJECT_UNDEFINED;

        const selectedData = this.getSelectedRoomObjectData(roomId);

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
                    if(this._whereYouClickIsWhereYouGo)
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
                if(category === RoomObjectCategory.ROOM) this._Str_24048(event, roomId);

                return;
            case RoomObjectOperationType.OBJECT_PLACE:
                return;
        }
    }

    private handleRoomObjectMouseDownEvent(event: RoomObjectMouseEvent, roomId: number): void
    {
        if(!event) return;

        let operation = RoomObjectOperationType.OBJECT_UNDEFINED;

        const selectedData = this.getSelectedRoomObjectData(roomId);

        if(selectedData) operation = selectedData.operation;

        const category = this._roomEngine.getRoomObjectCategoryForType(event.objectType);

        switch(operation)
        {
            case RoomObjectOperationType.OBJECT_UNDEFINED:
                if((category === RoomObjectCategory.FLOOR) || (category === RoomObjectCategory.WALL) || (event.objectType === RoomObjectUserType.MONSTER_PLANT))
                {
                    if(((event.altKey && !event.ctrlKey && !event.shiftKey) || (this._Str_25211(event))) && !this._roomEngine._Str_6374)
                    {
                        if(this._roomEngine.events) this._roomEngine.events.dispatchEvent(new RoomEngineObjectEvent(RoomEngineObjectEvent.REQUEST_MOVE, roomId, event.objectId, category));
                    }
                }
                return;
        }
    }
    
    private handleRoomObjectMouseEnterEvent(event: RoomObjectMouseEvent, roomId: number): void
    {
        const id        = event.objectId;
        const type      = event.objectType;
        const category  = this._roomEngine.getRoomObjectCategoryForType(type);

        if(this._roomEngine.events)
        {
            this._roomEngine.events.dispatchEvent(new RoomEngineObjectEvent(RoomEngineObjectEvent.MOUSE_ENTER, roomId, id, category));
        }
    }

    private handleRoomObjectMouseLeaveEvent(event: RoomObjectMouseEvent, roomId: number): void
    {
        const id        = event.objectId;
        const type      = event.objectType;
        const category  = this._roomEngine.getRoomObjectCategoryForType(type);

        if(category !== RoomObjectCategory.ROOM)
        {
            if(category === RoomObjectCategory.UNIT)
            {
                const cursor = this._roomEngine.getRoomObjectCursor(roomId);

                if(cursor) cursor.processUpdateMessage(new ObjectDataUpdateMessage(0, null));
            }
        }

        if(this._roomEngine.events)
        {
            this._roomEngine.events.dispatchEvent(new RoomEngineObjectEvent(RoomEngineObjectEvent.MOUSE_LEAVE, roomId, id, category));
        }

        return;
    }

    private onRoomObjectStateChangedEvent(event: RoomObjectStateChangedEvent, roomId: number): void
    {
        if(!event) return;

        switch(event.type)
        {
            case RoomObjectStateChangedEvent.STATE_CHANGE:
                this.updateRoomObjectState(roomId, event.object.id, event.object.type, event.state, false);
                return;
            case RoomObjectStateChangedEvent.STATE_RANDOM:
                this.updateRoomObjectState(roomId, event.object.id, event.object.type, event.state, true);
                return;
        }
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

    private onRoomObjectMoveEvent(event: RoomObjectMoveEvent, roomId: number): void
    {
        if(!event || !this._roomEngine) return;

        switch(event.type)
        {
            case RoomObjectMoveEvent.POSITION_CHANGED:
                const objectId          = event.objectId;
                const objectType        = event.objectType;
                const objectCategory    = this._roomEngine.getRoomObjectCategoryForType(objectType);
                const object            = this._roomEngine.getRoomObject(roomId, objectId, objectCategory);
                const selectionArrow    = this._roomEngine.getRoomObjectSelectionArrow(roomId);

                if(object && selectionArrow && selectionArrow.logic)
                {
                    const location = object.getLocation();

                    selectionArrow.logic.processUpdateMessage(new RoomObjectUpdateMessage(location, null));
                }
                return;
            case RoomObjectMoveEvent.OBJECT_REMOVED:
                this._Str_12227(roomId, 0, false);
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
    }

    private onRoomObjectBadgeAssetEvent(event: RoomObjectBadgeAssetEvent, roomId: number): void
    {
        if(!event || !this._roomEngine) return;

        switch(event.type)
        {
            case RoomObjectBadgeAssetEvent.LOAD_BADGE:
                const objectId          = event.objectId;
                const objectType        = event.objectType;
                const objectCategory    = this._roomEngine.getRoomObjectCategoryForType(objectType);

                this._roomEngine.loadRoomObjectBadgeImage(roomId, objectId, objectCategory, event.badgeId, event.groupBadge);
                return;
        }
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

    private _Str_24048(k: RoomObjectMouseEvent, _arg_2: number): void
    {
        if(!k || !this._roomEngine) return;

        const eventDispatcher = this._roomEngine.events;

        if(!eventDispatcher) return;

        const selectedData = this.getSelectedRoomObjectData(_arg_2);

        if(!selectedData) return;

        const roomObject = this._roomEngine.getRoomObject(_arg_2, selectedData.id, selectedData.category);

        if(!roomObject) return;

        let _local_6 = true;

        if((selectedData.category === RoomObjectCategory.FLOOR) || (selectedData.category === RoomObjectCategory.UNIT))
        {
            const stackingHeightMap = this._roomEngine.getFurnitureStackingHeightMap(_arg_2);

            if(!(((k instanceof RoomObjectTileMouseEvent)) && (this._Str_18155(roomObject, selectedData, (k.tileX), (k.tileY), stackingHeightMap))))
            {
                this._Str_18155(roomObject, selectedData, selectedData.loc.x, selectedData.loc.y, stackingHeightMap);

                _local_6 = false;
            }
        }

        else if((selectedData.category === RoomObjectCategory.WALL))
        {
            _local_6 = false;

            if(k instanceof RoomObjectWallMouseEvent)
            {
                const _local_10 = k.wallLocation;
                const _local_11 = k.wallWidth;
                const _local_12 = k.wallHeight;
                const _local_13 = k.x;
                const _local_14 = k.y;
                const _local_15 = k.direction;

                if(this._Str_22090(roomObject, selectedData, _local_10, _local_11, _local_12, _local_13, _local_14, _local_15))
                {
                    _local_6 = true;
                }
            }

            if(!_local_6)
            {
                roomObject.setLocation(selectedData.loc);
                roomObject.setDirection(selectedData.dir);
            }

            //this._roomEngine._Str_6650(_arg_2, selectedData.id, _local_6);
        }

        if (_local_6)
        {
            this.setFurnitureAlphaMultiplier(roomObject, 0.5);

            //this._roomEngine._Str_7972(false);
        }
        else
        {
            this.setFurnitureAlphaMultiplier(roomObject, 0);

            //this._roomEngine._Str_7972(true);
        }
    }

    private _Str_18155(k: IRoomObjectController, _arg_2: SelectedRoomObjectData, _arg_3: number, _arg_4: number, _arg_5: FurnitureStackingHeightMap): boolean
    {
        if(!k || !_arg_2) return false;

        const _local_6 = new Vector3d();
        _local_6.assign(k.getDirection());

        k.setDirection(_arg_2.dir);

        const _local_7 = new Vector3d(_arg_3, _arg_4, 0);
        const _local_8 = new Vector3d();

        _local_8.assign(k.getDirection());

        let _local_9 = this._Str_21004(k, _local_7, _arg_2.loc, _arg_2.dir, _arg_5);

        if(!_local_9)
        {
            _local_8.x = this._Str_17555(k, true);

            k.setDirection(_local_8);

            _local_9 = this._Str_21004(k, _local_7, _arg_2.loc, _arg_2.dir, _arg_5);
        }

        if(!_local_9)
        {
            k.setDirection(_local_6);

            return false;
        }

        k.setLocation(_local_9);

        if(_local_8) k.setDirection(_local_8);

        return true;
    }

    private _Str_22090(k: IRoomObjectController, _arg_2: SelectedRoomObjectData, _arg_3: IVector3D, _arg_4: IVector3D, _arg_5: IVector3D, _arg_6: number, _arg_7: number, _arg_8: number): boolean
    {
        if(!k || !_arg_2) return false;

        const _local_9  = new Vector3d(_arg_8);
        const _local_10 = this._Str_25568(k, _arg_3, _arg_4, _arg_5, _arg_6, _arg_7, _arg_2);

        if(!_local_10) return false;

        k.setLocation(_local_10);
        k.setDirection(_local_9);

        return true;
    }

    private _Str_21004(k: IRoomObject, _arg_2: IVector3D, _arg_3: IVector3D, _arg_4: IVector3D, _arg_5: FurnitureStackingHeightMap): Vector3d
    {
        if(!k || !k.model || !_arg_2) return null;

        let _local_15: Vector3d = null;

        const _local_6 = k.getDirection();

        if(!_local_6) return null;

        if(!_arg_3 || !_arg_4) return null;

        if((_arg_2.x === _arg_3.x) && (_arg_2.y === _arg_3.y))
        {
            if(_local_6.x === _arg_4.x)
            {
                _local_15 = new Vector3d();

                _local_15.assign(_arg_3);

                return _local_15;
            }
        }

        let sizeX = k.model.getValue(RoomObjectVariable.FURNITURE_SIZE_X) as number;
        let sizeY = k.model.getValue(RoomObjectVariable.FURNITURE_SIZE_Y) as number;

        if(sizeX < 1) sizeX = 1;

        if(sizeY < 1) sizeY = 1;

        let _local_9    = _arg_3.x;
        let _local_10   = _arg_3.y;
        let _local_11   = sizeX;
        let _local_12   = sizeY;
        let _local_13   = 0;
        let _local_14   = ((Math.trunc(_local_6.x + 45) % 360) / 90);

        if((_local_14 === 1) || (_local_14 === 3))
        {
            _local_13 = sizeX;

            sizeX = sizeY;
            sizeY = _local_13;
        }

        _local_14 = ((Math.trunc(_arg_4.x + 45) % 360) / 90);

        if((_local_14 === 1) || (_local_14 === 3))
        {
            _local_13 = _local_11;
            _local_11 = _local_12;
            _local_12 = _local_13;
        }

        if(_arg_5 && _arg_2)
        {
            const stackable = k.model.getValue(RoomObjectVariable.FURNITURE_ALWAYS_STACKABLE) === 1;

            if(_arg_5._Str_20406(_arg_2.x, _arg_2.y, sizeX, sizeY, _local_9, _local_10, _local_11, _local_12, stackable))
            {
                return new Vector3d(_arg_2.x, _arg_2.y, _arg_5.getHeight(_arg_2.x, _arg_2.y));
            }

            return null;
        }

        return null;
    }

    private _Str_25568(k: IRoomObject, _arg_2: IVector3D, _arg_3: IVector3D, _arg_4: IVector3D, _arg_5: number, _arg_6: number, _arg_7: SelectedRoomObjectData): Vector3d
    {
        if((((((k == null) || (k.model == null)) || (_arg_2 == null)) || (_arg_3 == null)) || (_arg_4 == null)) || (_arg_7 == null)) return null;

        const _local_8 = k.model.getValue(RoomObjectVariable.FURNITURE_SIZE_X) as number;
        const _local_9 = k.model.getValue(RoomObjectVariable.FURNITURE_SIZE_Z) as number;
        const _local_10 = k.model.getValue(RoomObjectVariable.FURNITURE_CENTER_Z) as number;

        if((((_arg_5 < (_local_8 / 2)) || (_arg_5 > (_arg_3.length - (_local_8 / 2)))) || (_arg_6 < _local_10)) || (_arg_6 > (_arg_4.length - (_local_9 - _local_10))))
        {
            if((_arg_5 < (_local_8 / 2)) && (_arg_5 <= (_arg_3.length - (_local_8 / 2))))
            {
                _arg_5 = (_local_8 / 2);
            }
            else
            {
                if((_arg_5 >= (_local_8 / 2)) && (_arg_5 > (_arg_3.length - (_local_8 / 2))))
                {
                    _arg_5 = (_arg_3.length - (_local_8 / 2));
                }
            }

            if((_arg_6 < _local_10) && (_arg_6 <= (_arg_4.length - (_local_9 - _local_10))))
            {
                _arg_6 = _local_10;
            }
            else
            {
                if((_arg_6 >= _local_10) && (_arg_6 > (_arg_4.length - (_local_9 - _local_10))))
                {
                    _arg_6 = (_arg_4.length - (_local_9 - _local_10));
                }
            }
        }

        if((((_arg_5 < (_local_8 / 2)) || (_arg_5 > (_arg_3.length - (_local_8 / 2)))) || (_arg_6 < _local_10)) || (_arg_6 > (_arg_4.length - (_local_9 - _local_10))))
        {
            return null;
        }

        let _local_11 = Vector3d.sum(Vector3d.product(_arg_3, (_arg_5 / _arg_3.length)), Vector3d.product(_arg_4, (_arg_6 / _arg_4.length)));

        _local_11 = Vector3d.sum(_arg_2, _local_11);

        return _local_11;
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
                this._roomEngine.connection.send(new FurnitureColorWheelComposer(objectId));
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
        const _local_18 = Math.floor((location.x + _local_16));
        const _local_19 = Math.floor(((location.y - _local_17) + 1));

        let _local_20 = false;

        if((_local_18 < location.x) || (_local_18 >= (location.x + sizeX))) _local_20 = true;
        else if((_local_19 < location.y) || (_local_19 >= (location.y + sizeY))) _local_20 = true;
        
        const _local_21 = furniData.data.canSitOn ? (sizeZ - 0.5) : sizeZ;
        
        if(!_local_20) return new Vector3d(_local_18, _local_19, _local_21);

        return null;
    }

    private _Str_23824(k:RoomObjectTileMouseEvent, _arg_2: number): ObjectTileCursorUpdateMessage
    {
        if(this._whereYouClickIsWhereYouGo)
        {
            return new ObjectTileCursorUpdateMessage(new Vector3d(k.tileX, k.tileY, k.tileZ), 0, true, k._Str_3463);
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
        //                 if ((((_local_9) && (_local_9.model)) && (_local_9.model.getNumber(RoomObjectVariableEnum.FURNITURE_IS_VARIABLE_HEIGHT) > 0)))
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

    private _Str_19271(k: number, _arg_2: boolean, _arg_3: boolean): void
    {
        const selectedData = this.getSelectedRoomObjectData(k);

        if(!selectedData) return;

        let roomObject: IRoomObjectController   = null;
        let objectId                            = selectedData.id;
        let category                            = selectedData.category;

        let x               = 0;
        let y               = 0;
        let z               = 0;
        let direction       = 0;
        let wallLocation    = '';

        if(this._roomEngine && this._roomEngine.connection)
        {
            roomObject = this._roomEngine.getRoomObject(k, objectId, category);

            if(roomObject)
            {
                const location = roomObject.getLocation();

                direction = roomObject.getDirection().x;

                if((category === RoomObjectCategory.FLOOR) || (category === RoomObjectCategory.UNIT))
                {
                    x   = location.x;
                    y   = location.y;
                    z   = location.z;
                }

                else if(category === RoomObjectCategory.WALL)
                {
                    x   = location.x;
                    y   = location.y;
                    z   = location.z;

                    const wallGeometry = this._roomEngine.getLegacyWallGeometry(k);

                    if(wallGeometry) wallLocation = wallGeometry._Str_21860(location, direction);
                }

                direction = ((((direction / 45) % 8) + 8) % 8);

                if((objectId < 0) && (category === RoomObjectCategory.UNIT)) objectId = (objectId * -1);
            }
        }

        const newSelectedData = new SelectedRoomObjectData(selectedData.id, selectedData.category, null, null, null);

        this._roomEngine.setSelectedRoomObjectData(k, newSelectedData);

        if(this._roomEngine && this._roomEngine.events)
        {
            const _local_16 = (roomObject && (roomObject.id === selectedData.id));

            //this._roomEngine.events.dispatchEvent(new RoomEngineObjectPlacedEvent(RoomEngineObjectEvent.PLACED, k, _local_5, _local_6, _local_8, _local_9, _local_10, _local_11, _local_12, _local_16, _arg_2, _arg_3, _local_4._Str_4766));
        }
    }

    public _Str_3571(roomId: number, objectId: number, category: number, operation: string): boolean
    {
        if(!this._roomEngine) return false;

        const roomObject = this._roomEngine.getRoomObject(roomId, objectId, category);

        if(!roomObject) return false;

        let _local_9 = true;

        switch(operation)
        {
            case RoomObjectOperationType.OBJECT_ROTATE_POSITIVE:
            case RoomObjectOperationType.OBJECT_ROTATE_NEGATIVE:
                if(this._roomEngine.connection)
                {
                    let direction = 0;

                    if(operation == RoomObjectOperationType.OBJECT_ROTATE_NEGATIVE)
                    {
                        direction = this._Str_17555(roomObject, false);
                    }
                    else
                    {
                        direction = this._Str_17555(roomObject, true);
                    }

                    const x = roomObject.getLocation().x;
                    const y = roomObject.getLocation().y;
                    
                    if (this._Str_22517(roomObject, new Vector3d(direction), this._roomEngine.getFurnitureStackingHeightMap(roomId)))
                    {
                        direction = Math.trunc((direction / 45));

                        if(roomObject.type === RoomObjectUserType.MONSTER_PLANT)
                        {
                            const _local_10 = this._roomEngine.roomSession.getSession(roomId);

                            if(_local_10)
                            {
                                const _local_11 = _local_10.userData.getUserDataByIndex(objectId);

                                if(_local_11)
                                {
                                    //this._roomEngine.connection.send(new _Str_8026(_local_11._Str_2394, _local_6, _local_7, _local_8));
                                }
                            }
                        }
                        else
                        {
                            this._roomEngine.connection.send(new FurnitureFloorUpdateComposer(objectId, x, y, direction));
                        }
                    }
                }
                break;
            case RoomObjectOperationType.OBJECT_EJECT:
            case RoomObjectOperationType.OBJECT_PICKUP:
                if(this._roomEngine.connection) this._roomEngine.connection.send(new FurniturePickupComposer(category, objectId));
                break;
            case RoomObjectOperationType.OBJECT_PICKUP_PET:
                if(this._roomEngine.connection)
                {
                    const session = this._roomEngine.roomSession.getSession(roomId);

                    if(session)
                    {
                        const userData = session.userData.getUserDataByIndex(objectId);

                        session.pickupPet(userData.id);
                    }
                }
                break;
            case RoomObjectOperationType.OBJECT_PICKUP_BOT:
                if(this._roomEngine.connection)
                {
                    const session = this._roomEngine.roomSession.getSession(roomId);

                    if(session)
                    {
                        const userData = session.userData.getUserDataByIndex(objectId);

                        session.pickupBot(userData.id);
                    }
                }
                break;
            case RoomObjectOperationType.OBJECT_MOVE:
                _local_9 = false;
                this.setFurnitureAlphaMultiplier(roomObject, 0.5);
                this._Str_7975(roomId, roomObject.id, category, roomObject.getLocation(), roomObject.getDirection(), operation);
                break;
            case RoomObjectOperationType.OBJECT_MOVE_TO:
                const selectedData = this.getSelectedRoomObjectData(roomId);

                this._Str_16022(roomId, selectedData.id, selectedData.category, selectedData.loc, selectedData.dir, RoomObjectOperationType.OBJECT_MOVE_TO, selectedData.typeId, selectedData._Str_4766, selectedData.stuffData, selectedData.state, selectedData._Str_15896, selectedData.posture);

                this.setFurnitureAlphaMultiplier(roomObject, 1);

                if(this._roomEngine.connection)
                {
                    if(category === RoomObjectCategory.FLOOR)
                    {
                        const angle     = ((roomObject.getDirection().x) % 360);
                        const location  = roomObject.getLocation();
                        const direction = (angle / 45);

                        this._roomEngine.connection.send(new FurnitureFloorUpdateComposer(objectId, location.x, location.y, direction))
                    }

                    else if(category === RoomObjectCategory.WALL)
                    {
                        const angle         = ((roomObject.getDirection().x) % 360);
                        const wallGeometry  = this._roomEngine.getLegacyWallGeometry(roomId);

                        if(wallGeometry)
                        {
                            const location = wallGeometry._Str_21860(roomObject.getLocation(), angle);

                            if(location) this._roomEngine.connection.send(new FurnitureWallUpdateComposer(objectId, location));
                        }
                    }

                    else if(category === RoomObjectCategory.UNIT)
                    {

                    }
                }
                break;
        }

        if(_local_9) this._Str_13199(roomId);

        return true;
    }

    private _Str_17555(k: IRoomObjectController, _arg_2: boolean): number
    {
        if(!k || !k.model) return 0;

        let _local_6                    = 0;
        let _local_7                    = 0;
        let allowedDirections: number[] = [];

        if(k.type === RoomObjectUserType.MONSTER_PLANT)
        {
            allowedDirections = k.model.getValue(RoomObjectVariable.PET_ALLOWED_DIRECTIONS);
        }
        else
        {
            allowedDirections = k.model.getValue(RoomObjectVariable.FURNITURE_ALLOWED_DIRECTIONS);
        }

        let direction = k.getDirection().x;

        if(allowedDirections && allowedDirections.length)
        {
            _local_6 = allowedDirections.indexOf(direction);

            if(_local_6 < 0)
            {
                _local_6    = 0;
                _local_7    = 0;

                while(_local_7 < allowedDirections.length)
                {
                    if (direction <= allowedDirections[_local_7]) break;

                    _local_6++;
                    _local_7++;
                }

                _local_6 = (_local_6 % allowedDirections.length);
            }

            if(_arg_2) _local_6 = ((_local_6 + 1) % allowedDirections.length);
            else _local_6 = (((_local_6 - 1) + allowedDirections.length) % allowedDirections.length);

            direction = allowedDirections[_local_6];
        }

        return direction;
    }

    private _Str_22517(object: IRoomObject, _arg_2: IVector3D, _arg_3: FurnitureStackingHeightMap): boolean
    {
        if(!object || !object.model || !_arg_2) return false;

        const direction = object.getDirection();
        const location  = object.getLocation();

        if(!direction || !location) return false;

        if((direction.x % 180) === (_arg_2.x % 180)) return true;

        let sizeX = object.model.getValue(RoomObjectVariable.FURNITURE_SIZE_X) as number;
        let sizeY = object.model.getValue(RoomObjectVariable.FURNITURE_SIZE_Y) as number;

        let _local_8    = sizeX;
        let _local_9    = sizeY;

        if(sizeX < 1) sizeX = 1;

        if(sizeY < 1) sizeY = 1;

        let _local_11 = ((Math.trunc((_arg_2.x + 45)) % 360) / 90);

        if((_local_11 === 1) || (_local_11 === 3)) [ sizeX, sizeY ] = [ sizeY, sizeX ];

        _local_11 = ((Math.trunc((direction.x + 45)) % 360) / 90);

        if(((_local_11 === 1) || (_local_11 === 3))) [ _local_8, _local_9 ] = [ _local_9, _local_8 ];

        if(_arg_3 && location)
        {
            const alwaysStackable = object.model.getValue(RoomObjectVariable.FURNITURE_ALWAYS_STACKABLE) === 1;

            if(_arg_3._Str_20406(location.x, location.y, sizeX, sizeY, location.x, location.y, _local_8, _local_9, alwaysStackable, location.z)) return true;

            return false;
        }

        return false;
    }

    private _Str_19253(roomId: number, objectId: number, category: number): void
    {
        const _local_4 = this.getSelectedRoomObjectData(roomId);

        if(!_local_4) return;

        const _local_5 = (this._roomEngine.getRoomObject(roomId, objectId, category) as IRoomObjectController);

        if(!_local_5) return;

        if(!this._roomEngine || !this._roomEngine.events) return;

        this._roomEngine.events.dispatchEvent(new RoomEngineObjectPlacedOnUserEvent(RoomEngineObjectEvent.PLACED_ON_USER, roomId, objectId, category, _local_4.id, _local_4.category));
    }

    public _Str_17481(roomId: number, objectId: number, category: number): void
    {
        if(!this._roomEngine) return;

        const eventDispatcher = this._roomEngine.events;

        if(!eventDispatcher) return;

        switch(category)
        {
            case RoomObjectCategory.UNIT:
            case RoomObjectCategory.FLOOR:
            case RoomObjectCategory.WALL:
                if(category === RoomObjectCategory.UNIT)
                {
                    this._Str_16209(roomId);
                    this._Str_12227(roomId, objectId, true);
                }
                else
                {
                    this._Str_12227(roomId, 0, false);

                    if (objectId != this._selectedObjectId)
                    {
                        this._Str_16209(roomId);

                        const _local_5 = this._roomEngine.getRoomObject(roomId, objectId, category);

                        if(_local_5 && _local_5.logic)
                        {
                            _local_5.logic.processUpdateMessage(new ObjectSelectedMessage(true));

                            this._selectedObjectId          = objectId;
                            this._selectedObjectCategory    = category;
                        }
                    }
                }

                eventDispatcher.dispatchEvent(new RoomEngineObjectEvent(RoomEngineObjectEvent.SELECTED, roomId, objectId, category));

                return;
        }
    }

    private _Str_16209(k: number):void
    {
        if(this._selectedObjectId === -1) return;

        const object = this._roomEngine.getRoomObject(k, this._selectedObjectId, this._selectedObjectCategory);

        if(object && object.logic)
        {
            object.logic.processUpdateMessage(new ObjectSelectedMessage(false));

            this._selectedObjectId          = -1;
            this._selectedObjectCategory    = RoomObjectCategory.MINIMUM;
        }
    }

    public _Str_12227(k: number, _arg_2: number, _arg_3: boolean): void
    {
        if(!this._roomEngine) return;

        const _local_4 = RoomObjectCategory.UNIT;
        const _local_5 = this._roomEngine.getRoomObject(k, this._selectedAvatarId, _local_4);

        if(_local_5 && _local_5.logic)
        {
            _local_5.logic.processUpdateMessage(new ObjectAvatarSelectedMessage(false));

            this._selectedAvatarId = -1;
        }

        let _local_6 = false;

        if(_arg_3)
        {
           const _local_5 = this._roomEngine.getRoomObject(k, _arg_2, _local_4);

           if(_local_5 && _local_5.logic)
           {
               _local_5.logic.processUpdateMessage(new ObjectAvatarSelectedMessage(true));

               _local_6 = true;

               this._selectedAvatarId = _arg_2;

               const location = _local_5.getLocation();

               if(location) this._roomEngine.connection.send(new RoomUnitLookComposer(~~(location.x), ~~(location.y)));
            }
        }

        const _local_7 = this._roomEngine.getRoomObjectSelectionArrow(k);

        if(_local_7 && _local_7.logic)
        {
            if(_local_6) _local_7.logic.processUpdateMessage(new ObjectVisibilityUpdateMessage(ObjectVisibilityUpdateMessage.ENABLED));
            else _local_7.logic.processUpdateMessage(new ObjectVisibilityUpdateMessage(ObjectVisibilityUpdateMessage.DISABLED));
        }
    }

    private _Str_13199(k: number):void
    {
        if(!this._roomEngine) return;

        this._roomEngine._Str_17948();

        const selectedData = this.getSelectedRoomObjectData(k);

        if(selectedData)
        {
            if((selectedData.operation === RoomObjectOperationType.OBJECT_MOVE) || (selectedData.operation === RoomObjectOperationType.OBJECT_MOVE_TO))
            {
                const roomObject = this._roomEngine.getRoomObject(k, selectedData.id, selectedData.category);

                if(roomObject && (selectedData.operation !== RoomObjectOperationType.OBJECT_MOVE_TO))
                {
                    roomObject.setLocation(selectedData.loc);
                    roomObject.setDirection(selectedData.dir);
                }

                this.setFurnitureAlphaMultiplier(roomObject, 1);

                if(selectedData.category === RoomObjectCategory.WALL)
                {
                    //this._roomEngine._Str_6650(k, selectedData.id, true);
                }

                this._Str_16022(k, selectedData.id, selectedData.category, selectedData.loc, selectedData.dir, RoomObjectOperationType.OBJECT_MOVE, selectedData.typeId, selectedData._Str_4766, selectedData.stuffData, selectedData.state, selectedData._Str_15896, selectedData.posture);
            }

            if((selectedData.operation === RoomObjectOperationType.OBJECT_PLACE))
            {
                const objectId  = selectedData.id;
                const category  = selectedData.category;

                switch(category)
                {
                    case RoomObjectCategory.FLOOR:
                        //this._roomEngine._Str_6737(k, objectId);
                        break;
                    case RoomObjectCategory.WALL:
                        //this._roomEngine._Str_7974(k, objectId);
                        break;
                    case RoomObjectCategory.UNIT:
                        //this._roomEngine._Str_9451(k, objectId);
                        break;
                }
            }

            this._roomEngine.setSelectedRoomObjectData(k, null);
        }
    }

    private getSelectedRoomObjectData(roomId: number): SelectedRoomObjectData
    {
        if(!this._roomEngine) return null;

        return this._roomEngine.getSelectedRoomObjectData(roomId);
    }

    private setFurnitureAlphaMultiplier(object: IRoomObjectController, multiplier: number): void
    {
        if(!object || !object.model) return;

        object.model.setValue(RoomObjectVariable.FURNITURE_ALPHA_MULTIPLIER, multiplier);
    }

    private _Str_25211(event: RoomObjectMouseEvent): boolean
    {
        return (this._roomEngine.isDecorating) && (!(event.ctrlKey || event.shiftKey));
    }

    private _Str_7975(k: number, _arg_2: number, _arg_3: number, _arg_4: IVector3D, _arg_5: IVector3D, _arg_6: string, _arg_7: number = 0, _arg_8: string = null, _arg_9: IObjectData  =null, _arg_10: number = -1, _arg_11: number = -1, _arg_12: string = null): void
    {
        this._Str_13199(k);

        if(!this._roomEngine) return;

        const selectedData = new SelectedRoomObjectData(_arg_2, _arg_3, _arg_6, _arg_4, _arg_5, _arg_7, _arg_8, _arg_9, _arg_10, _arg_11, _arg_12);

        this._roomEngine.setSelectedRoomObjectData(k, selectedData);
    }

    private _Str_16022(k: number, _arg_2: number, _arg_3: number, _arg_4: IVector3D, _arg_5: IVector3D, _arg_6: string, _arg_7: number = 0, _arg_8: string = null, _arg_9: IObjectData = null, _arg_10: number = -1, _arg_11: number = -1, _arg_12: string = null): void
    {
        if(!this._roomEngine) return null;

        const selectedData = new SelectedRoomObjectData(_arg_2, _arg_3, _arg_6, _arg_4, _arg_5, _arg_7, _arg_8, _arg_9, _arg_10, _arg_11, _arg_12);

        this._roomEngine.setSelectedRoomObjectData(k, selectedData);
    }

    public get engine(): IRoomEngineServices
    {
        return this._roomEngine;
    }
}