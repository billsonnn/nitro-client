import { Disposable } from '../../core/common/disposable/Disposable';
import { IConnection } from '../../core/communication/connections/IConnection';
import { FurnitureFloorEvent } from '../communication/messages/incoming/room/furniture/floor/FurnitureFloorEvent';
import { RoomModelEvent } from '../communication/messages/incoming/room/mapping/RoomModelEvent';
import { RoomModelNameEvent } from '../communication/messages/incoming/room/mapping/RoomModelNameEvent';
import { UserInfoEvent } from '../communication/messages/incoming/user/data/UserInfoEvent';
import { RoomModel2Composer } from '../communication/messages/outgoing/room/mapping/RoomModel2Composer';
import { RoomModelComposer } from '../communication/messages/outgoing/room/mapping/RoomModelComposer';
import { IRoomCreator } from './IRoomCreator';
import { RoomObjectCategory } from './object/RoomObjectCategory';

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
        this._connection.addMessageEvent(new FurnitureFloorEvent(this.onFurnitureFloorEvent.bind(this)));
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

        const object = instance.createObject(0, 'room', RoomObjectCategory.ROOM);

        this._roomCreator.roomSession.roomManager.initalizeObject(object);
    }

    private onFurnitureFloorEvent(event: FurnitureFloorEvent): void
    {
        if(!(event instanceof FurnitureFloorEvent) || !event.connection) return;
    }

    public get currentRoomId(): number
    {
        return this._currentRoomId;
    }
}