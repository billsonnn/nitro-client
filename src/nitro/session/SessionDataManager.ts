import { NitroManager } from '../../core/common/NitroManager';
import { NitroConfiguration } from '../../NitroConfiguration';
import { INitroCommunicationManager } from '../communication/INitroCommunicationManager';
import { UserFigureEvent } from '../communication/messages/incoming/user/data/UserFigureEvent';
import { UserInfoEvent } from '../communication/messages/incoming/user/data/UserInfoEvent';
import { SessionDataEvent } from './events/SessionDataEvent';
import { FurnitureData } from './furniture/FurnitureData';
import { FurnitureDataParser } from './furniture/FurnitureDataParser';
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

    constructor(communication: INitroCommunicationManager)
    {
        super();
        
        this._communication = communication;

        this.resetUserInfo();

        this._floorItems    = new Map();
        this._wallItems     = new Map();
        this._furnitureData = null;
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

    public getWallItemData(id: number): FurnitureData
    {
        const existing = this._wallItems.get(id);

        if(!existing) return null;

        return existing;
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