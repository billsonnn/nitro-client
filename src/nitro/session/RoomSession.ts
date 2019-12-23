import { Disposable } from '../../core/common/disposable/Disposable';
import { IConnection } from '../../core/communication/connections/IConnection';
import { RoomEnterComposer } from '../communication/messages/outgoing/room/access/RoomEnterComposer';
import { RoomSessionEvent } from './events/RoomSessionEvent';
import { IRoomSession } from './IRoomSession';
import { UserDataManager } from './UserDataManager';

export class RoomSession extends Disposable implements IRoomSession
{
    private _connection: IConnection;

    private _roomId: number;
    private _password: string;

    private _userData: UserDataManager;
    private _state: string;

    constructor()
    {
        super();

        this._connection    = null;

        this._roomId        = 0;
        this._password      = null;

        this._userData      = new UserDataManager(this);
        this._state         = RoomSessionEvent.CREATED;
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

    public get userData(): UserDataManager
    {
        return this._userData;
    }

    public get state(): string
    {
        return this._state;
    }
}