import { Disposable } from '../../core/common/disposable/Disposable';
import { IConnection } from '../../core/communication/connections/IConnection';
import { IRoomInstance } from '../../room/IRoomInstance';
import { IRoomObjectController } from '../../room/object/IRoomObjectController';
import { Position } from '../../room/utils/Position';
import { FurnitureFloorAddEvent } from '../communication/messages/incoming/room/furniture/floor/FurnitureFloorAddEvent';
import { FurnitureFloorEvent } from '../communication/messages/incoming/room/furniture/floor/FurnitureFloorEvent';
import { FurnitureFloorRemoveEvent } from '../communication/messages/incoming/room/furniture/floor/FurnitureFloorRemoveEvent';
import { FurnitureFloorUpdateEvent } from '../communication/messages/incoming/room/furniture/floor/FurnitureFloorUpdateEvent';
import { FurnitureStateEvent } from '../communication/messages/incoming/room/furniture/FurnitureStateEvent';
import { RoomModelEvent } from '../communication/messages/incoming/room/mapping/RoomModelEvent';
import { RoomModelNameEvent } from '../communication/messages/incoming/room/mapping/RoomModelNameEvent';
import { UserInfoEvent } from '../communication/messages/incoming/user/data/UserInfoEvent';
import { RoomModel2Composer } from '../communication/messages/outgoing/room/mapping/RoomModel2Composer';
import { RoomModelComposer } from '../communication/messages/outgoing/room/mapping/RoomModelComposer';
import { FurnitureFloorDataParser } from '../communication/messages/parser/room/furniture/floor/FurnitureFloorDataParser';
import { IRoomCreator } from './IRoomCreator';
import { RoomObjectCategory } from './object/RoomObjectCategory';
import { RoomObjectModelKey } from './object/RoomObjectModelKey';

export class RoomMessageHandler extends Disposable
{
    private _connection: IConnection;
    private _roomCreator: IRoomCreator;

    private _currentRoomId: number;
    private _ownUserId: number;
    private _initialConnection: boolean;

    constructor(roomCreator: IRoomCreator)
    {
        super();

        this._connection        = null;
        this._roomCreator       = roomCreator;

        this._currentRoomId     = 0;
        this._ownUserId         = 0;
        this._initialConnection = true;
    }

    protected onDispose(): void
    {
        super.onDispose();
    }

    public setConnection(connection: IConnection)
    {
        if(this._connection || !connection) return;

        this._connection = connection;

        this._connection.addMessageEvent(new UserInfoEvent(this.onUserInfoEvent.bind(this)));
        this._connection.addMessageEvent(new RoomModelNameEvent(this.onRoomModelNameEvent.bind(this)));
        this._connection.addMessageEvent(new RoomModelEvent(this.onRoomModelEvent.bind(this)));
        this._connection.addMessageEvent(new FurnitureFloorAddEvent(this.onFurnitureFloorAddEvent.bind(this)));
        this._connection.addMessageEvent(new FurnitureFloorEvent(this.onFurnitureFloorEvent.bind(this)));
        this._connection.addMessageEvent(new FurnitureFloorRemoveEvent(this.onFurnitureFloorRemoveEvent.bind(this)));
        this._connection.addMessageEvent(new FurnitureFloorUpdateEvent(this.onFurnitureFloorUpdateEvent.bind(this)));
        this._connection.addMessageEvent(new FurnitureStateEvent(this.onFurnitureStateEvent.bind(this)));
    }

    public setRoomId(id: number): void
    {
        if(this._currentRoomId)
        {
            if(this._roomCreator) this._roomCreator.destroyRoom(this._currentRoomId);
        }

        this._currentRoomId = id;
    }

    public clearRoomId(): void
    {
        this._currentRoomId = 0;
    }

    private onUserInfoEvent(event: UserInfoEvent): void
    {
        if(!(event instanceof UserInfoEvent) || !event.connection) return;

        this._ownUserId = event.getParser().userInfo.userId;
    }

    private onRoomModelNameEvent(event: RoomModelNameEvent): void
    {
        if(!(event instanceof RoomModelNameEvent) || !event.connection) return;

        if(this._currentRoomId !== event.getParser().roomId)
        {
            this.setRoomId(event.getParser().roomId);
        }

        // set model name to instance data

        if(this._initialConnection)
        {
            event.connection.send(new RoomModelComposer());

            this._initialConnection = false;

            return;
        }

        event.connection.send(new RoomModel2Composer());
    }

    private onRoomModelEvent(event: RoomModelEvent): void
    {
        if(!(event instanceof RoomModelEvent) || !event.connection || !this._roomCreator) return;

        const instance = this._roomCreator.createRoomInstance(this._currentRoomId);

        if(!instance) return;

        this._roomCreator.initializeRoomInstance(instance.id, event.getParser());
    }

    private createFloorFurnitureFromParser(instance: IRoomInstance, parser: FurnitureFloorDataParser): IRoomObjectController
    {
        if(!instance || !parser || !this._roomCreator) return null;

        const data = this._roomCreator.roomSession.sessionData.getFloorItemData(parser.spriteId);

        if(!data) return null;

        const object = instance.createObject(parser.itemId, data.className, RoomObjectCategory.FURNITURE);

        if(!object) return null;

        object.setRoom(instance);

        object.setPosition(new Position(parser.x, parser.y, parser.z, parser.direction));

        object.model.setValue(RoomObjectModelKey.FURNITURE_COLOR, data.colorId);

        const objectData = parser.data;

        if(objectData)
        {
            object.setState(objectData.state);

            objectData.writeRoomObjectModel(object.model);
        }
        
        return object;
    }

    private onFurnitureFloorAddEvent(event: FurnitureFloorAddEvent): void
    {
        if(!(event instanceof FurnitureFloorAddEvent) || !event.connection || !this._roomCreator) return;

        const item = event.getParser().item;

        if(!item) return;

        const instance = this._roomCreator.getRoomInstance(this._currentRoomId);

        if(!instance) return;

        this._roomCreator.addObjects(this.createFloorFurnitureFromParser(instance, item));
    }

    private onFurnitureFloorEvent(event: FurnitureFloorEvent): void
    {
        if(!(event instanceof FurnitureFloorEvent) || !event.connection || !this._roomCreator) return;

        const items = event.getParser().items;

        if(!items || !items.length) return;

        const instance = this._roomCreator.getRoomInstance(this._currentRoomId);

        if(!instance) return;

        const objects: IRoomObjectController[] = [];

        for(let item of items)
        {
            if(!item) continue;

            const object = this.createFloorFurnitureFromParser(instance, item);

            if(!object) continue;

            objects.push(object);
        }

        if(!objects || !objects.length) return;

        this._roomCreator.addObjects(...objects);
    }

    private onFurnitureFloorRemoveEvent(event: FurnitureFloorRemoveEvent): void
    {
        if(!(event instanceof FurnitureFloorRemoveEvent) || !event.connection || !this._roomCreator) return;

        this._roomCreator.removeRoomFurnitureObject(this._currentRoomId, event.getParser().itemId);
    }

    private onFurnitureFloorUpdateEvent(event: FurnitureFloorUpdateEvent): void
    {
        if(!(event instanceof FurnitureFloorUpdateEvent) || !event.connection || !this._roomCreator) return;

        const item = event.getParser().item;

        if(!item) return;

        this._roomCreator.updateRoomFurnitureObject(this._currentRoomId, item.itemId, new Position(item.x, item.y, item.z, item.direction), item.data.state, item.data);
    }

    private onFurnitureStateEvent(event: FurnitureStateEvent): void
    {
        if(!(event instanceof FurnitureStateEvent) || !event.connection || !this._roomCreator) return;

        this._roomCreator.updateRoomFurnitureObject(this._currentRoomId, event.getParser().itemId, null, event.getParser().state);
    }

    public get currentRoomId(): number
    {
        return this._currentRoomId;
    }
}