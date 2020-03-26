import { NitroManager } from '../../core/common/NitroManager';
import { NitroConfiguration } from '../../NitroConfiguration';
import { INitroCommunicationManager } from '../communication/INitroCommunicationManager';
import { UserFigureEvent } from '../communication/messages/incoming/user/data/UserFigureEvent';
import { UserInfoEvent } from '../communication/messages/incoming/user/data/UserInfoEvent';
import { SessionDataEvent } from './events/SessionDataEvent';
import { FurnitureData } from './furniture/FurnitureData';
import { FurnitureDataParser } from './furniture/FurnitureDataParser';
import { IFurnitureDataListener } from './furniture/IFurnitureDataListener';
import { ISessionDataManager } from './ISessionDataManager';

export class SessionDataManager extends NitroManager implements ISessionDataManager
{
    private _communication: INitroCommunicationManager;

    private _userId: number;
    private _name: string;
    private _figure: string;
    private _gender: string;

    private _floorItems: Map<number, FurnitureData>;
    private _wallItems: Map<number, FurnitureData>;
    private _furnitureData: FurnitureDataParser;

    private _pendingFurniDataListeners: IFurnitureDataListener[];

    constructor(communication: INitroCommunicationManager)
    {
        super();
        
        this._communication             = communication;

        this.resetUserInfo();

        this._floorItems                = new Map();
        this._wallItems                 = new Map();
        this._furnitureData             = null;

        this._pendingFurniDataListeners = [];
    }

    protected onInit(): void
    {
        this.loadFurnitureData();

        this._communication.registerMessageEvent(new UserFigureEvent(this.onUserFigureEvent.bind(this)));
        this._communication.registerMessageEvent(new UserInfoEvent(this.onUserInfoEvent.bind(this)));
    }

    protected onDispose(): void
    {
        this.destroyFurnitureData();

        super.onDispose();
    }

    private resetUserInfo(): void
    {
        this._userId    = 0;
        this._name      = null;
        this._figure    = null;
        this._gender    = null;
    }

    private loadFurnitureData(): void
    {
        this.destroyFurnitureData();

        this._furnitureData = new FurnitureDataParser(this._floorItems, this._wallItems);

        this._furnitureData.events.addEventListener(FurnitureDataParser.FURNITURE_DATA_READY, this.onFurnitureDataReadyEvent.bind(this));

        this._furnitureData.loadFurnitureData(NitroConfiguration.FURNIDATA_URL);
    }

    public getAllFurnitureData(listener: IFurnitureDataListener): FurnitureData[]
    {
        if(!this._floorItems || !this._floorItems.size)
        {
            if(this._pendingFurniDataListeners.indexOf(listener) === -1) this._pendingFurniDataListeners.push(listener);

            return;
        }

        const furnitureData: FurnitureData[] = [];

        for(let data of this._floorItems.values())
        {
            if(!data) continue;

            furnitureData.push(data);
        }

        for(let data of this._wallItems.values())
        {
            if(!data) continue;

            furnitureData.push(data);
        }

        if(!furnitureData || !furnitureData.length) return null;

        return furnitureData;
    }

    public removePendingFurniDataListener(listener: IFurnitureDataListener): void
    {
        if(!this._pendingFurniDataListeners) return;

        const index = this._pendingFurniDataListeners.indexOf(listener);

        if(index === -1) return;

        this._pendingFurniDataListeners.splice(index, 1);
    }

    private dispatchSessionDataEvent(type: string): void
    {
        if(!this.events) return;

        this.events.dispatchEvent(new SessionDataEvent(type, this));
    }

    private onUserFigureEvent(event: UserFigureEvent): void
    {
        if(!(event instanceof UserFigureEvent) || !event.connection) return;

        this._figure    = event.getParser().figure;
        this._gender    = event.getParser().gender;

        this.dispatchSessionDataEvent(SessionDataEvent.FIGURE_UPDATED);
    }

    private onUserInfoEvent(event: UserInfoEvent): void
    {
        if(!(event instanceof UserInfoEvent) || !event.connection) return;

        this.resetUserInfo();

        const userInfo = event.getParser().userInfo;

        if(!userInfo) return;

        this._userId    = userInfo.userId;
        this._name      = userInfo.username;
        this._figure    = userInfo.figure;
        this._gender    = userInfo.gender;

        this.dispatchSessionDataEvent(SessionDataEvent.UPDATED);
        this.dispatchSessionDataEvent(SessionDataEvent.FIGURE_UPDATED);
    }

    private onFurnitureDataReadyEvent(event: Event): void
    {
        this._furnitureData.events.removeEventListener(FurnitureDataParser.FURNITURE_DATA_READY, this.onFurnitureDataReadyEvent.bind(this));

        if(this._pendingFurniDataListeners)
        {
            for(let listener of this._pendingFurniDataListeners)
            {
                if(!listener) continue;

                listener.loadFurnitureData();
            }
        }
    }

    private destroyFurnitureData(): void
    {
        if(!this._furnitureData) return;

        this._furnitureData.dispose();

        this._furnitureData = null;
    }

    public getFloorItemData(id: number): FurnitureData
    {
        const existing = this._floorItems.get(id);

        if(!existing) return null;

        return existing;
    }

    public getFloorItemDataByName(name: string): FurnitureData
    {
        if(!name || !this._floorItems || !this._floorItems.size) return null;

        for(let item of this._floorItems.values())
        {
            if(!item || (item.className !== name)) continue;

            return item;
        }
    }

    public getWallItemData(id: number): FurnitureData
    {
        const existing = this._wallItems.get(id);

        if(!existing) return null;

        return existing;
    }

    public getWallItemDataByName(name: string): FurnitureData
    {
        if(!name || !this._wallItems || !this._wallItems.size) return null;

        for(let item of this._wallItems.values())
        {
            if(!item || (item.className !== name)) continue;

            return item;
        }
    }

    public get communication(): INitroCommunicationManager
    {
        return this._communication;
    }

    public get userId(): number
    {
        return this._userId;
    }

    public get userName(): string
    {
        return this._name;
    }

    public get figure(): string
    {
        return this._figure;
    }

    public get gender(): string
    {
        return this._gender;
    }
}