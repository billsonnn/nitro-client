import { Disposable } from '../../core/common/disposable/Disposable';
import { NitroConfiguration } from '../../NitroConfiguration';
import { RoomObjectEvent } from '../../room/events/RoomObjectEvent';
import { RoomObjectMouseEvent } from '../../room/events/RoomObjectMouseEvent';
import { IRoomObjectController } from '../../room/object/IRoomObjectController';
import { Direction } from '../../room/utils/Direction';
import { Position } from '../../room/utils/Position';
import { FurnitureFloorUpdateComposer } from '../communication/messages/outgoing/room/furniture/floor/FurnitureFloorUpdateComposer';
import { FurniturePickupComposer } from '../communication/messages/outgoing/room/furniture/FurniturePickupComposer';
import { FurnitureDiceActivateComposer } from '../communication/messages/outgoing/room/furniture/logic/FurnitureDiceActivateComposer';
import { FurnitureDiceDeactivateComposer } from '../communication/messages/outgoing/room/furniture/logic/FurnitureDiceDeactivateComposer';
import { FurnitureMultiStateComposer } from '../communication/messages/outgoing/room/furniture/logic/FurnitureMultiStateComposer';
import { RoomUnitLookComposer } from '../communication/messages/outgoing/room/unit/RoomUnitLookComposer';
import { RoomUnitWalkComposer } from '../communication/messages/outgoing/room/unit/RoomUnitWalkComposer';
import { NitroInstance } from '../NitroInstance';
import { RoomObjectFurnitureActionEvent } from './events/RoomObjectFurnitureActionEvent';
import { RoomObjectStateChangedEvent } from './events/RoomObjectStateChangedEvent';
import { IRoomEngineServices } from './IRoomEngineServices';
import { ObjectTileCursorUpdateMessage } from './messages/ObjectTileCursorUpdateMessage';
import { ObjectOperationType } from './object/logic/ObjectOperationType';
import { RoomObjectCategory } from './object/RoomObjectCategory';
import { RoomObjectModelKey } from './object/RoomObjectModelKey';
import { RoomObjectType } from './object/RoomObjectType';
import { FurnitureVisualization } from './object/visualization/furniture/FurnitureVisualization';
import { SelectedRoomObjectData } from './utils/SelectedRoomObjectData';

export class RoomObjectEventHandler extends Disposable
{
    private _roomEngine: IRoomEngineServices;

    constructor(roomEngine: IRoomEngineServices)
    {
        super();

        this._roomEngine = roomEngine;
    }

    public handleRoomObjectEvent(event: RoomObjectEvent): void
    {
        if(!event) return;

        let roomId: number = this._roomEngine.activeRoomId;

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
            case RoomObjectFurnitureActionEvent.DICE_ACTIVATE:
            case RoomObjectFurnitureActionEvent.DICE_OFF:
                this.onFurnitureActionEvent(event as RoomObjectFurnitureActionEvent, roomId);
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
            case RoomObjectMouseEvent.DOUBLE_CLICK:
                this.handleRoomObjectMouseDoubleClickEvent(event, roomId);
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

        //event.object.logic.mouseEvent(event);
    }

    private handleRoomObjectMouseClickEvent(event: RoomObjectMouseEvent, roomId: number): void
    {
        if(!event) return;

        let operation = ObjectOperationType.OBJECT_UNDEFINED;

        const selectedData: SelectedRoomObjectData = this._roomEngine.getSelectedRoomObjectData(roomId);

        if(selectedData) operation = selectedData.operation;

        if(NitroConfiguration.WALKING_ENABLED)
        {
            if(!operation || operation === ObjectOperationType.OBJECT_UNDEFINED) this.requestWalkUpdate(roomId, event);
        }

        const object = selectedData ? (selectedData.object || null) : ((event.collision && event.collision.object) || null);

        if(!object) return;

        switch(operation)
        {
            case ObjectOperationType.OBJECT_MOVE:
                this.handleRoomObjectOperation(roomId, object, ObjectOperationType.OBJECT_MOVE_TO);
                break;
            case ObjectOperationType.OBJECT_PLACE:
                this.handleRoomObjectOperation(roomId, object, ObjectOperationType.OBJECT_PLACE_TO);
                break;
            case ObjectOperationType.OBJECT_UNDEFINED:

                switch(object.category)
                {
                    case RoomObjectCategory.UNIT:
                        break;
                    case RoomObjectCategory.FURNITURE:
                        if(event.ctrlKey && !event.altKey && !event.shiftKey)
                        {
                            this.handleRoomObjectOperation(roomId, object, ObjectOperationType.OBJECT_PICKUP);
                        }
    
                        else if(event.shiftKey && !event.altKey && !event.ctrlKey)
                        {
                            this.handleRoomObjectOperation(roomId, object, ObjectOperationType.OBJECT_ROTATE_POSITIVE);
                        }

                        else object.logic && object.logic.mouseEvent(event);

                        break;
                }

                break;
        }
    }

    private handleRoomObjectMouseDoubleClickEvent(event: RoomObjectMouseEvent, roomId: number): void
    {
        if(!event) return;

        let operation = ObjectOperationType.OBJECT_UNDEFINED;

        const selectedData: SelectedRoomObjectData = this._roomEngine.getSelectedRoomObjectData(roomId);

        if(selectedData) operation = selectedData.operation;

        const object = selectedData ? (selectedData.object || null) : ((event.collision && event.collision.object) || null);

        if(!object) return;

        switch(operation)
        {
            case ObjectOperationType.OBJECT_UNDEFINED:
                object.logic && object.logic.mouseEvent(event);
                break;
        }
    }

    private handleRoomObjectMouseMoveEvent(event: RoomObjectMouseEvent, roomId: number): void
    {
        if(!event) return;

        let operation = ObjectOperationType.OBJECT_UNDEFINED;

        const selectedData: SelectedRoomObjectData = this._roomEngine.getSelectedRoomObjectData(roomId);

        if(selectedData) operation = selectedData.operation;

        if(this._roomEngine && NitroConfiguration.WALKING_ENABLED)
        {
            const cursor = this._roomEngine.getTileCursorObject(roomId);

            if(cursor) cursor.processUpdateMessage(new ObjectTileCursorUpdateMessage(event.position));
        }

        const object = selectedData ? (selectedData.object || null) : ((event.collision && event.collision.object) || null);

        if(!object) return;

        switch(operation)
        {
            case ObjectOperationType.OBJECT_MOVE:
                this.moveObject(event, roomId);
                break;
            case ObjectOperationType.OBJECT_PLACE:
                break;
            case ObjectOperationType.OBJECT_UNDEFINED:
                object.logic && object.logic.mouseEvent(event);
                break;
        }
    }

    private handleRoomObjectMouseDownEvent(event: RoomObjectMouseEvent, roomId: number): void
    {
        if(!event) return;

        let operation = ObjectOperationType.OBJECT_UNDEFINED;

        const selectedData: SelectedRoomObjectData = this._roomEngine.getSelectedRoomObjectData(roomId);

        if(selectedData) operation = selectedData.operation;

        const object = selectedData ? (selectedData.object || null) : ((event.collision && event.collision.object) || null);

        if(!object) return;

        switch(operation)
        {
            case ObjectOperationType.OBJECT_UNDEFINED:

            switch(object.category)
            {
                case RoomObjectCategory.UNIT:
                    break;
                case RoomObjectCategory.FURNITURE:
                    if(event.altKey && !event.ctrlKey && !event.shiftKey)
                    {
                        this.handleRoomObjectOperation(roomId, object, ObjectOperationType.OBJECT_MOVE);
                    }

                    else object.logic && object.logic.mouseEvent(event);

                    break;
            }
            
            break;
        }
    }

    private handleRoomObjectMouseUpEvent(event: RoomObjectMouseEvent, roomId: number): void
    {
        if(!event) return;

        let operation = ObjectOperationType.OBJECT_UNDEFINED;

        const selectedData: SelectedRoomObjectData = this._roomEngine.getSelectedRoomObjectData(roomId);

        if(selectedData) operation = selectedData.operation;

        const object = selectedData ? (selectedData.object || null) : ((event.collision && event.collision.object) || null);

        if(!object) return;

        switch(operation)
        {
            case ObjectOperationType.OBJECT_MOVE:
                break;
            case ObjectOperationType.OBJECT_UNDEFINED:
                object.logic && object.logic.mouseEvent(event);
                break;
        }
    }

    private handleRoomObjectOperation(roomId: number, object: IRoomObjectController, operation: string): boolean
    {
        if(!object || !operation || !this._roomEngine || !this._roomEngine.connection) return;

        switch(operation)
        {
            case ObjectOperationType.OBJECT_ROTATE_NEGATIVE:
            case ObjectOperationType.OBJECT_ROTATE_POSITIVE:
                let direction = 0;

                if(operation === ObjectOperationType.OBJECT_ROTATE_NEGATIVE) direction = this.getNextObjectDirection(object, false);
                else direction = this.getNextObjectDirection(object, true);

                if(object.type === RoomObjectType.MONSTER_PLANT)
                {

                }

                else if(object.category === RoomObjectCategory.FURNITURE) this._roomEngine.connection.send(new FurnitureFloorUpdateComposer(object.id, object.position.x, object.position.y, direction));

                break;
            case ObjectOperationType.OBJECT_EJECT:
            case ObjectOperationType.OBJECT_PICKUP:
                if(this._roomEngine.connection) this._roomEngine.connection.send(new FurniturePickupComposer(object.category, object.id));
                break;
            case ObjectOperationType.OBJECT_MOVE:
                this.setObjectAlpha(object, 0.5);
                this.setSelectedRoomObjectData(roomId, object, operation);
                break;
            case ObjectOperationType.OBJECT_MOVE_TO:
                this.setObjectAlpha(object, 1);

                switch(object.category)
                {
                    case RoomObjectCategory.FURNITURE:
                        this._roomEngine.connection.send(new FurnitureFloorUpdateComposer(object.id, object.position.x, object.position.y, object.position.direction));
                        break;
                }

                this.clearSelectedRoomObjectData(roomId);

                break;
        }

    }

    private setSelectedRoomObjectData(roomId: number, object: IRoomObjectController, operation: string): void
    {
        if(!this._roomEngine) return;

        // clear previous
        this._roomEngine.setSelectedRoomObjectData(roomId, new SelectedRoomObjectData(object, operation));
    }

    private clearSelectedRoomObjectData(roomId: number): void
    {
        if(!this._roomEngine) return;

        this._roomEngine.setSelectedRoomObjectData(roomId, null);
    }

    private setObjectAlpha(object: IRoomObjectController, alpha: number): void
    {
        if(!object || !object.model) return;

        object.model.setValue(RoomObjectModelKey.FURNITURE_ALPHA_MULTIPLIER, alpha);
    }

    private updateObjectState(roomId: number, objectId: number, type: string, state: number, isRandom: boolean): void
    {
        const category = RoomObjectCategory.getCategory(type);

        this.sendStateUpdate(roomId, objectId, category, state, isRandom);
    }

    private sendStateUpdate(roomId: number, objectId: number, category: number, state: number, isRandom: boolean): void
    {
        if(!this._roomEngine || !this._roomEngine.connection) return;

        if(category === RoomObjectCategory.FURNITURE)
        {
            if(!isRandom)
            {
                this._roomEngine.connection.send(new FurnitureMultiStateComposer(objectId, state));
            }
        }
    }

    private requestWalkUpdate(roomId: number, event: RoomObjectMouseEvent): boolean
    {
        if(event.position) this.sendWalkUpdate(event.position.x, event.position.y);

        return true;
    }

    private sendWalkUpdate(x: number, y: number): void
    {
        if(!this._roomEngine || !this._roomEngine.connection) return;

        this._roomEngine.connection.send(new RoomUnitWalkComposer(x, y));
    }

    private sendLookUpdate(x: number, y: number): void
    {
        if(!this._roomEngine || !this._roomEngine.connection) return;

        this._roomEngine.connection.send(new RoomUnitLookComposer(x, y));
    }

    private moveObject(event: RoomObjectMouseEvent, roomId: number): void
    {
        if(!event || !this._roomEngine) return;

        const selectedData: SelectedRoomObjectData = this._roomEngine.getSelectedRoomObjectData(roomId);

        if(!selectedData || !selectedData.object) return;

        let position: Position = null;

        if(event.position)
        {
            if(selectedData.object.category === RoomObjectCategory.FURNITURE)
            {
                const visualization = selectedData.object.visualization as FurnitureVisualization;

                if(visualization) visualization.disableIcon();
            }

            position = selectedData.object.position.copy();

            position.x      = event.position.x;
            position.y      = event.position.y;
            position.depth  = position.calculatedDepth;

            selectedData.object.setPosition(position, false);
        }
        else
        {
            selectedData.object.setPosition(selectedData.object.realPosition, false);

            if(selectedData.object.category === RoomObjectCategory.FURNITURE)
            {
                const visualization = selectedData.object.visualization as FurnitureVisualization;

                if(visualization)
                {
                    visualization.enableIcon();

                    NitroInstance.instance.renderer.stage.worldTransform.apply(event.point, event.point);

                    const tempPosition = new Position(event.point.x, event.point.y);

                    tempPosition.isScreen = true;

                    selectedData.object.setTempPosition(tempPosition, false);
                }
            }
        }
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

    private onStateChangeEvent(event: RoomObjectStateChangedEvent, roomId: number): void
    {
        if(!event) return;

        this.updateObjectState(roomId, event.object.id, event.object.type, event.state, false);
    }

    private onStateChangeRandomEvent(event: RoomObjectStateChangedEvent, roomId: number): void
    {
        if(!event) return;

        this.updateObjectState(roomId, event.object.id, event.object.type, event.state, true);
    }

    private onFurnitureActionEvent(event: RoomObjectFurnitureActionEvent, roomId: number): void
    {
        if(!event) return;

        this.useObject(roomId, event.object.id, event.object.type, event.type);
    }

    private getNextObjectDirection(object: IRoomObjectController, positive: boolean = true): number
    {
        if(!object) return null;

        let direction: number       = Direction.directionToAngle(object.position.direction);
        let directions: number[]    = [];

        if(object.model)
        {
            if(object.type === RoomObjectType.MONSTER_PLANT)
            {
                directions = object.model.getValue(RoomObjectModelKey.PET_ALLOWED_DIRECTIONS);
            }
            else
            {
                directions = object.model.getValue(RoomObjectModelKey.FURNITURE_ALLOWED_DIRECTIONS);
            }
        }

        if(directions && directions.length)
        {
            let index   = directions.indexOf(direction);
            let offset  = 0;

            if(index < 0)
            {
                index = 0;
                
                while(offset < directions.length)
                {
                    if(direction <= directions[offset]) break;

                    index++;
                    offset++;
                }

                index = (index % directions.length);
            }

            if(positive) index = ((index + 1) % directions.length);
            else index = (((index - 1) + directions.length) % directions.length);

            direction = directions[index];
        }

        return Direction.angleToDirection(direction);
    }

    public get engine(): IRoomEngineServices
    {
        return this._roomEngine;
    }
}