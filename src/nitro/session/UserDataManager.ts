import { Disposable } from '../../core/common/disposable/Disposable';
import { IConnection } from '../../core/communication/connections/IConnection';
import { RoomUserData } from './RoomUserData';

export class UserDataManager extends Disposable
{
    private static USER_TYPE: number    = 1;

    private _connection: IConnection;

    private _userDataByType: Map<number, Map<number, RoomUserData>>;
    private _userDataByRoomIndex: Map<number, RoomUserData>;

    constructor()
    {
        super();

        this._connection            = null;

        this._userDataByType        = new Map();
        this._userDataByRoomIndex   = new Map();
    }

    protected onDispose(): void
    {
        this._connection = null;
    }

    public setConnection(connection: IConnection): void
    {
        this._connection = connection;
    }

    public getUserData(id: number): RoomUserData
    {
        return this.getDataByType(UserDataManager.USER_TYPE, id);
    }

    public getDataByType(type: number, id: number): RoomUserData
    {
        const existing = this._userDataByType.get(type);

        if(!existing) return null;

        const userData = existing.get(id);

        if(!userData) return null;

        return userData;
    }

    public getUserDataByIndex(unitId: number): RoomUserData
    {
        const existing = this._userDataByRoomIndex.get(unitId);

        if(!existing) return null;

        return existing;
    }

    public updateUserData(data: RoomUserData): void
    {
        if(!data) return;

        this.removeUserData(data.unitId);

        let existingType = this._userDataByType.get(data.type);

        if(!existingType)
        {
            existingType = new Map();

            this._userDataByType.set(data.type, existingType);
        }

        existingType.set(data.id, data);

        this._userDataByRoomIndex.set(data.unitId, data);
    }

    public removeUserData(unitId: number): void
    {
        const existing = this.getUserDataByIndex(unitId);

        if(!existing) return;

        this._userDataByRoomIndex.delete(unitId);

        const existingType = this._userDataByType.get(existing.type);

        if(existingType) existingType.delete(existing.id);
    }

    public updateFigure(unitId: number, figure: string, gender: string): void
    {
        const userData = this.getUserDataByIndex(unitId);

        if(!userData) return;

        userData.figure = figure;
        userData.gender = gender;
    }

    public updateMotto(unitId: number, motto: string): void
    {
        const userData = this.getUserDataByIndex(unitId);

        if(!userData) return;

        userData.motto = motto;
    }

    public get connection(): IConnection
    {
        return this._connection;
    }
}