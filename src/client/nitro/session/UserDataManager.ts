import { Disposable } from '../../core/common/disposable/Disposable';
import { IConnection } from '../../core/communication/connections/IConnection';
import { UserCurrentBadgesComposer } from '../communication/messages/outgoing/user/data/UserCurrentBadgesComposer';
import { RoomUserData } from './RoomUserData';

export class UserDataManager extends Disposable
{
    private static TYPE_USER: number            = 1;
    private static TYPE_PET: number             = 2;
    private static TYPE_BOT: number             = 3;
    private static TYPE_RENTABLE_BOT: number    = 4;

    private _connection: IConnection;

    private _userDataByType: Map<number, Map<number, RoomUserData>>;
    private _userDataByRoomIndex: Map<number, RoomUserData>;
    private _userBadges: Map<number, string[]>;

    constructor()
    {
        super();

        this._connection            = null;

        this._userDataByType        = new Map();
        this._userDataByRoomIndex   = new Map();
        this._userBadges            = new Map();
    }

    protected onDispose(): void
    {
        this._connection = null;
    }

    public setConnection(connection: IConnection): void
    {
        this._connection = connection;
    }

    public getUserData(webID: number): RoomUserData
    {
        return this.getDataByType(webID, UserDataManager.TYPE_USER);
    }

    public getPetData(webID: number): RoomUserData
    {
        return this.getDataByType(webID, UserDataManager.TYPE_PET);
    }

    public getBotData(webID: number): RoomUserData
    {
        return this.getDataByType(webID, UserDataManager.TYPE_BOT);
    }

    public getRentableBotData(webID: number): RoomUserData
    {
        return this.getDataByType(webID, UserDataManager.TYPE_RENTABLE_BOT);
    }

    public getDataByType(webID: number, type: number): RoomUserData
    {
        const existing = this._userDataByType.get(type);

        if(!existing) return null;

        const userData = existing.get(webID);

        if(!userData) return null;

        return userData;
    }

    public getUserDataByIndex(roomIndex: number): RoomUserData
    {
        const existing = this._userDataByRoomIndex.get(roomIndex);

        if(!existing) return null;

        return existing;
    }

    public updateUserData(data: RoomUserData): void
    {
        if(!data) return;

        this.removeUserData(data.roomIndex);

        let existingType = this._userDataByType.get(data.type);

        if(!existingType)
        {
            existingType = new Map();

            this._userDataByType.set(data.type, existingType);
        }

        existingType.set(data.webID, data);

        this._userDataByRoomIndex.set(data.roomIndex, data);
    }

    public removeUserData(roomIndex: number): void
    {
        const existing = this.getUserDataByIndex(roomIndex);

        if(!existing) return;

        this._userDataByRoomIndex.delete(roomIndex);

        const existingType = this._userDataByType.get(existing.type);

        if(existingType) existingType.delete(existing.webID);
    }

    public getUserBadges(userId: number): string[]
    {
        if(this._connection)
        {
            this._connection.send(new UserCurrentBadgesComposer(userId));
        }

        const badges = this._userBadges.get(userId);

        if(!badges) return [];

        return badges;
    }

    public setUserBadges(userId: number, badges: string[]): void
    {
        this._userBadges.set(userId, badges);
    }

    public updateFigure(roomIndex: number, figure: string, sex: string, hasSaddle: boolean, isRiding: boolean): void
    {
        const userData = this.getUserDataByIndex(roomIndex);

        if(!userData) return;

        userData.figure     = figure;
        userData.sex        = sex;
        userData.hasSaddle  = hasSaddle;
        userData.isRiding   = isRiding;
    }

    public updateMotto(roomIndex: number, custom: string): void
    {
        const userData = this.getUserDataByIndex(roomIndex);

        if(!userData) return;

        userData.custom = custom;
    }

    public get connection(): IConnection
    {
        return this._connection;
    }
}