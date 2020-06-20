import { NitroManager } from '../../core/common/NitroManager';
import { NitroConfiguration } from '../../NitroConfiguration';
import { INitroCommunicationManager } from '../communication/INitroCommunicationManager';
import { UserPermissionsEvent } from '../communication/messages/incoming/user/access/UserPermissionsEvent';
import { UserRightsEvent } from '../communication/messages/incoming/user/access/UserRightsEvent';
import { UserFigureEvent } from '../communication/messages/incoming/user/data/UserFigureEvent';
import { UserInfoEvent } from '../communication/messages/incoming/user/data/UserInfoEvent';
import { NitroInstance } from '../NitroInstance';
import { BadgeImageManager } from './BadgeImageManager';
import { SecurityLevel } from './enum/SecurityLevel';
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

    private _clubLevel: number;
    private _rankId: number;
    private _isAmbassador: boolean;

    private _floorItems: Map<number, FurnitureData>;
    private _wallItems: Map<number, FurnitureData>;
    private _furnitureData: FurnitureDataParser;
    private _pendingFurniDataListeners: IFurnitureDataListener[];

    private _badgeImageManager: BadgeImageManager;

    constructor(communication: INitroCommunicationManager)
    {
        super();
        
        this._communication             = communication;

        this.resetUserInfo();

        this._clubLevel                 = 0;
        this._rankId                    = 0;
        this._isAmbassador              = false;

        this._floorItems                = new Map();
        this._wallItems                 = new Map();
        this._furnitureData             = null;
        this._pendingFurniDataListeners = [];

        this._badgeImageManager         = null;
    }

    protected onInit(): void
    {
        this.loadFurnitureData();
        this.loadBadgeImageManager();

        this._communication.registerMessageEvent(new UserFigureEvent(this.onUserFigureEvent.bind(this)));
        this._communication.registerMessageEvent(new UserInfoEvent(this.onUserInfoEvent.bind(this)));
        this._communication.registerMessageEvent(new UserPermissionsEvent(this.onUserPermissionsEvent.bind(this)));
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

        this._furnitureData.addEventListener(FurnitureDataParser.FURNITURE_DATA_READY, this.onFurnitureDataReadyEvent.bind(this));

        this._furnitureData.loadFurnitureData(NitroConfiguration.FURNIDATA_URL);
    }

    private loadBadgeImageManager(): void
    {
        if(this._badgeImageManager) return;

        this._badgeImageManager = new BadgeImageManager(NitroInstance.instance.core.asset, this.events);
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

    private onUserFigureEvent(event: UserFigureEvent): void
    {
        if(!(event instanceof UserFigureEvent) || !event.connection) return;

        this._figure    = event.getParser().figure;
        this._gender    = event.getParser().gender;
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
    }

    private onUserPermissionsEvent(event: UserPermissionsEvent): void
    {
        if(!(event instanceof UserRightsEvent) || !event.connection) return;

        this._clubLevel     = event.getParser().clubLevel;
        this._rankId        = event.getParser().rank;
        this._isAmbassador  = event.getParser().isAmbassador;
    }

    private onFurnitureDataReadyEvent(event: Event): void
    {
        this._furnitureData.removeEventListener(FurnitureDataParser.FURNITURE_DATA_READY, this.onFurnitureDataReadyEvent.bind(this));

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

    public getBadgeImage(name: string): PIXI.Texture
    {
        return this._badgeImageManager.getBadgeImage(name);
    }

    public getGroupBadgeImage(name: string): PIXI.Texture
    {
        return this._badgeImageManager.getBadgeImage(name, BadgeImageManager.GROUP_BADGE);
    }

    public loadBadgeImage(name: string): string
    {
        return this._badgeImageManager._Str_5831(name);
    }

    public loadGroupBadgeImage(name: string): string
    {
        return this._badgeImageManager._Str_5831(name, BadgeImageManager.GROUP_BADGE);
    }

    public hasSecurity(level: number): boolean
    {
        return this._rankId >= level;
    }

    public giveRespect(userId: number): void
    {
        // if (((k >= 0) && (this._Str_3437 > 0)))
        // {
        //     this.send(new _Str_10714(k));
        //     this._Str_3437 = (this._Str_3437 - 1);
        // }
    }

    public givePetRespect(petId: number): void
    {
        // if (((k >= 0) && (this._Str_3973 > 0)))
        // {
        //     this.send(new _Str_8184(k));
        //     this._Str_3973 = (this._Str_3973 - 1);
        // }
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

    public get clubLevel(): number
    {
        return this._clubLevel;
    }

    public get isAmbassador(): boolean
    {
        return this._isAmbassador;
    }

    public get isModerator(): boolean
    {
        return (this._rankId >= SecurityLevel._Str_3569);
    }
}