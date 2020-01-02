import { Disposable } from '../../core/common/disposable/Disposable';
import { NitroConfiguration } from '../../NitroConfiguration';
import { RoomObjectEvent } from '../../room/events/RoomObjectEvent';
import { RoomObjectMouseEvent } from '../../room/events/RoomObjectMouseEvent';
import { FurnitureDiceActivateComposer } from '../communication/messages/outgoing/room/furniture/logic/FurnitureDiceActivateComposer';
import { FurnitureDiceDeactivateComposer } from '../communication/messages/outgoing/room/furniture/logic/FurnitureDiceDeactivateComposer';
import { FurnitureMultiStateComposer } from '../communication/messages/outgoing/room/furniture/logic/FurnitureMultiStateComposer';
import { RoomUnitLookComposer } from '../communication/messages/outgoing/room/unit/RoomUnitLookComposer';
import { RoomUnitWalkComposer } from '../communication/messages/outgoing/room/unit/RoomUnitWalkComposer';
import { RoomObjectFurnitureActionEvent } from './events/RoomObjectFurnitureActionEvent';
import { RoomObjectStateChangedEvent } from './events/RoomObjectStateChangedEvent';
import { IRoomEngineServices } from './IRoomEngineServices';
import { ObjectTileCursorUpdateMessage } from './messages/ObjectTileCursorUpdateMessage';
import { ObjectOperationType } from './object/logic/ObjectOperationType';
import { RoomObjectCategory } from './object/RoomObjectCategory';
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
                this.onFurnitureActionUseEvent(event as RoomObjectFurnitureActionEvent, roomId);
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
        }

        //event.object.logic.mouseEvent(event);
    }

    private handleRoomObjectMouseClickEvent(event: RoomObjectMouseEvent, roomId: number): void
    {
        if(!event) return;

        let operation = ObjectOperationType.OBJECT_UNDEFINED;

        const selectedData: SelectedRoomObjectData = this._roomEngine.getSelectedRoomObjectData(roomId);

        if(selectedData)
        {
            operation = selectedData.operation;
        }

        if(NitroConfiguration.WALKING_ENABLED)
        {
            if(!operation || operation === ObjectOperationType.OBJECT_UNDEFINED)
            {
                const position = event.position;

                if(position) this.sendWalkUpdate(position.x, position.y);
            }
        }

        // if(event.object)
        // {
        //     if(event.object.type === 'user')
        //     {
        //         const position = event.object.position;

        //         if(position) this.sendLookUpdate(position.x, position.y);

        //         return;
        //     }
        // }
    }

    private handleRoomObjectMouseDoubleClickEvent(event: RoomObjectMouseEvent, roomId: number): void
    {
        if(!event) return;

        const logic = (event && event.object && event.object.logic) || null;

        if(!logic) return;

        logic.mouseEvent(event);
    }

    private handleRoomObjectMouseMoveEvent(event: RoomObjectMouseEvent, roomId: number): void
    {
        if(!event) return;

        let operation = ObjectOperationType.OBJECT_UNDEFINED;

        if(NitroConfiguration.WALKING_ENABLED)
        {
            if(!operation || operation === ObjectOperationType.OBJECT_UNDEFINED)
            {
                const cursor = this._roomEngine.getTileCursorObject(roomId);

                if(cursor) cursor.logic.processUpdateMessage(new ObjectTileCursorUpdateMessage(event.position));
            }
        }

        const logic = (event && event.object && event.object.logic) || null;

        if(!logic) return;

        logic.mouseEvent(event);
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

    private onFurnitureActionUseEvent(event: RoomObjectFurnitureActionEvent, roomId: number): void
    {
        if(!event) return;

        this.useObject(roomId, event.object.id, event.object.type, event.type);
    }

    public get engine(): IRoomEngineServices
    {
        return this._roomEngine;
    }
}