import { Disposable } from '../../core/common/disposable/Disposable';
import { IConnection } from '../../core/communication/connections/IConnection';
import { RoomEnterComposer } from '../communication/messages/outgoing/room/access/RoomEnterComposer';
import { RoomControllerLevel } from './enum/RoomControllerLevel';
import { RoomSessionEvent } from './events/RoomSessionEvent';
import { IRoomSession } from './IRoomSession';
import { UserDataManager } from './UserDataManager';

export class RoomSession extends Disposable implements IRoomSession
{
    private _connection: IConnection;

    private _roomId: number;
    private _password: string;
    private _state: string;

    private _userData: UserDataManager;
    private _controllerLevel: number;
    private _ownUserRoomId: number;
    private _isRoomOwner: boolean;
    private _isDecorating: boolean;
    private _isSpectator: boolean;

    constructor()
    {
        super();

        this._connection        = null;

        this._roomId            = 0;
        this._password          = null;
        this._state             = RoomSessionEvent.CREATED;

        this._userData          = new UserDataManager();
        this._controllerLevel   = RoomControllerLevel.NONE;
        this._ownUserRoomId     = -1;
        this._isRoomOwner       = false;
        this._isDecorating      = false;
        this._isSpectator       = false;
    }

    protected onDispose(): void
    {
        if(this._userData)
        {
            this._userData.dispose();

            this._userData = null;
        }

        this._connection = null;
    }

    public setConnection(connection: IConnection): void
    {
        if(this._connection || !connection) return;

        this._connection = connection;

        if(this._userData) this._userData.setConnection(connection);
    }

    public setControllerLevel(level: number): void
    {
        if((level >= RoomControllerLevel.NONE) && (level <= RoomControllerLevel.MODERATOR))
        {
            this._controllerLevel = level;

            return;
        }

        this._controllerLevel = RoomControllerLevel.NONE;
    }

    public setOwnUserRoomId(userId: number): void
    {
        this._ownUserRoomId = userId;
    }

    public setRoomOwner(): void
    {
        this._isRoomOwner = true;
    }

    public start(): boolean
    {
        if(this._state !== RoomSessionEvent.CREATED || !this._connection) return false;

        this._state = RoomSessionEvent.STARTED;

        return this.enterRoom();
    }

    private enterRoom(): boolean
    {
        if(!this._connection) return false;

        this._connection.send(new RoomEnterComposer(this._roomId, this._password));

        return true;
    }

    public reset(roomId: number): void
    {
        if(roomId === this._roomId) return;

        this._roomId = roomId;
    }

    public pickupPet(id: number): void
    {
        if(!this._connection) return;

        //this._connection.send();
    }

    public pickupBot(id: number): void
    {
        if(!this._connection) return;

        //this._connection.send();
    }

    public get connection(): IConnection
    {
        return this._connection;
    }

    public get roomId(): number
    {
        return this._roomId;
    }

    public set roomId(roomId: number)
    {
        this._roomId = roomId;
    }

    public get password(): string
    {
        return this._password;
    }

    public set password(password: string)
    {
        this._password = password;
    }

    public get state(): string
    {
        return this._state;
    }

    public get userData(): UserDataManager
    {
        return this._userData;
    }

    public get controllerLevel(): number
    {
        return this._controllerLevel;
    }

    public get ownerUserRoomId(): number
    {
        return this._ownUserRoomId;
    }

    public get roomOwner(): boolean
    {
        return this._isRoomOwner;
    }

    public get isDecorating(): boolean
    {
        return this._isDecorating;
    }

    public set isDecorating(flag: boolean)
    {
        this._isDecorating = flag;
    }

    public get isSpectator(): boolean
    {
        return this._isSpectator;
    }

    public set isSpectator(flag: boolean)
    {
        this._isSpectator = flag;
    }
}