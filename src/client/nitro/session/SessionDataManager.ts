import { Texture } from 'pixi.js';
import { NitroManager } from '../../core/common/NitroManager';
import { IMessageComposer } from '../../core/communication/messages/IMessageComposer';
import { INitroCommunicationManager } from '../communication/INitroCommunicationManager';
import { AvailabilityStatusMessageEvent } from '../communication/messages/incoming/availability/AvailabilityStatusMessageEvent';
import { ChangeNameUpdateEvent } from '../communication/messages/incoming/avatar/ChangeNameUpdateEvent';
import { RoomModelNameEvent } from '../communication/messages/incoming/room/mapping/RoomModelNameEvent';
import { UserPermissionsEvent } from '../communication/messages/incoming/user/access/UserPermissionsEvent';
import { UserFigureEvent } from '../communication/messages/incoming/user/data/UserFigureEvent';
import { UserInfoEvent } from '../communication/messages/incoming/user/data/UserInfoEvent';
import { UserNameChangeMessageEvent } from '../communication/messages/incoming/user/data/UserNameChangeMessageEvent';
import { UserSettingsEvent } from '../communication/messages/incoming/user/data/UserSettingsEvent';
import { PetRespectComposer } from '../communication/messages/outgoing/pet/PetRespectComposer';
import { RoomUnitChatComposer } from '../communication/messages/outgoing/room/unit/chat/RoomUnitChatComposer';
import { UserRespectComposer } from '../communication/messages/outgoing/user/UserRespectComposer';
import { Nitro } from '../Nitro';
import { HabboWebTools } from '../utils/HabboWebTools';
import { BadgeImageManager } from './BadgeImageManager';
import { SecurityLevel } from './enum/SecurityLevel';
import { UserNameUpdateEvent } from './events/UserNameUpdateEvent';
import { FurnitureDataParser } from './furniture/FurnitureDataParser';
import { IFurnitureData } from './furniture/IFurnitureData';
import { IFurnitureDataListener } from './furniture/IFurnitureDataListener';
import { ISessionDataManager } from './ISessionDataManager';

export class SessionDataManager extends NitroManager implements ISessionDataManager
{
    private _communication: INitroCommunicationManager;

    private _userId: number;
    private _name: string;
    private _figure: string;
    private _gender: string;
    private _realName: string;
    private _respectsReceived: number;
    private _respectsLeft: number;
    private _respectsPetLeft: number;
    private _canChangeName: boolean;

    private _clubLevel: number;
    private _securityLevel: number;
    private _isAmbassador: boolean;

    private _systemOpen: boolean;
    private _systemShutdown: boolean;
    private _isAuthenticHabbo: boolean;
    private _isRoomCameraFollowDisabled: boolean;
    private _uiFlags: number;

    private _floorItems: Map<number, IFurnitureData>;
    private _wallItems: Map<number, IFurnitureData>;
    private _furnitureData: FurnitureDataParser;

    private _furnitureReady: boolean;
    private _furnitureListenersNotified: boolean;
    private _pendingFurnitureListeners: IFurnitureDataListener[];

    private _badgeImageManager: BadgeImageManager;

    constructor(communication: INitroCommunicationManager)
    {
        super();

        this._communication                 = communication;

        this.resetUserInfo();

        this._clubLevel                     = 0;
        this._securityLevel                 = 0;
        this._isAmbassador                  = false;

        this._systemOpen                    = false;
        this._systemShutdown                = false;
        this._isAuthenticHabbo              = false;
        this._isRoomCameraFollowDisabled    = false;
        this._uiFlags                       = 0;

        this._floorItems                    = new Map();
        this._wallItems                     = new Map();
        this._furnitureData                 = null;

        this._furnitureReady                = false;
        this._furnitureListenersNotified    = false;
        this._pendingFurnitureListeners     = [];

        this._badgeImageManager             = null;

        this.onFurnitureDataReadyEvent = this.onFurnitureDataReadyEvent.bind(this);
    }

    protected onInit(): void
    {
        this.loadFurnitureData();
        this.loadBadgeImageManager();

        this._communication.registerMessageEvent(new UserFigureEvent(this.onUserFigureEvent.bind(this)));
        this._communication.registerMessageEvent(new UserInfoEvent(this.onUserInfoEvent.bind(this)));
        this._communication.registerMessageEvent(new UserPermissionsEvent(this.onUserPermissionsEvent.bind(this)));
        this._communication.registerMessageEvent(new AvailabilityStatusMessageEvent(this.onAvailabilityStatusMessageEvent.bind(this)));
        this._communication.registerMessageEvent(new UserSettingsEvent(this.onUserSettingsEvent.bind(this)));
        this._communication.registerMessageEvent(new ChangeNameUpdateEvent(this.onChangeNameUpdateEvent.bind(this)));
        this._communication.registerMessageEvent(new UserNameChangeMessageEvent(this.onUserNameChangeMessageEvent.bind(this)));
        this._communication.registerMessageEvent(new RoomModelNameEvent(this.onRoomModelNameEvent.bind(this)));
    }

    protected onDispose(): void
    {
        this.destroyFurnitureData();

        super.onDispose();
    }

    private resetUserInfo(): void
    {
        this._userId        = 0;
        this._name          = null;
        this._figure        = null;
        this._gender        = null;
        this._realName      = null;
        this._canChangeName = false;
    }

    private loadFurnitureData(): void
    {
        this.destroyFurnitureData();

        this._furnitureData = new FurnitureDataParser(this._floorItems, this._wallItems, Nitro.instance.localization);

        this._furnitureData.addEventListener(FurnitureDataParser.FURNITURE_DATA_READY, this.onFurnitureDataReadyEvent);

        this._furnitureData.loadFurnitureData(Nitro.instance.getConfiguration<string>('furnidata.url'));
    }

    private loadBadgeImageManager(): void
    {
        if(this._badgeImageManager) return;

        this._badgeImageManager = new BadgeImageManager(Nitro.instance.core.asset, this.events);
    }

    public getAllFurnitureData(listener: IFurnitureDataListener): IFurnitureData[]
    {
        if(!this._floorItems || !this._floorItems.size)
        {
            if(this._pendingFurnitureListeners.indexOf(listener) === -1) this._pendingFurnitureListeners.push(listener);

            return;
        }

        const furnitureData: IFurnitureData[] = [];

        for(const data of this._floorItems.values())
        {
            if(!data) continue;

            furnitureData.push(data);
        }

        for(const data of this._wallItems.values())
        {
            if(!data) continue;

            furnitureData.push(data);
        }

        if(!furnitureData || !furnitureData.length) return null;

        return furnitureData;
    }

    public removePendingFurniDataListener(listener: IFurnitureDataListener): void
    {
        if(!this._pendingFurnitureListeners) return;

        const index = this._pendingFurnitureListeners.indexOf(listener);

        if(index === -1) return;

        this._pendingFurnitureListeners.splice(index, 1);
    }

    private onUserFigureEvent(event: UserFigureEvent): void
    {
        if(!event || !event.connection) return;

        this._figure    = event.getParser().figure;
        this._gender    = event.getParser().gender;

        HabboWebTools.updateFigure(this._figure);
    }

    private onUserInfoEvent(event: UserInfoEvent): void
    {
        if(!event || !event.connection) return;

        this.resetUserInfo();

        const userInfo = event.getParser().userInfo;

        if(!userInfo) return;

        this._userId            = userInfo.userId;
        this._name              = userInfo.username;
        this._figure            = userInfo.figure;
        this._gender            = userInfo.gender;
        this._realName          = userInfo.realName;
        this._respectsReceived  = userInfo.respectsReceived;
        this._respectsLeft      = userInfo.respectsRemaining;
        this._respectsPetLeft   = userInfo.respectsPetRemaining;
        this._canChangeName     = userInfo.canChangeName;
    }

    private onUserPermissionsEvent(event: UserPermissionsEvent): void
    {
        if(!event || !event.connection) return;

        this._clubLevel     = event.getParser().clubLevel;
        this._securityLevel = event.getParser().securityLevel;
        this._isAmbassador  = event.getParser().isAmbassador;
    }

    private onAvailabilityStatusMessageEvent(event: AvailabilityStatusMessageEvent): void
    {
        if(!event || !event.connection) return;

        const parser = event.getParser();

        if(!parser) return;

        this._systemOpen        = parser.isOpen;
        this._systemShutdown    = parser.onShutdown;
        this._isAuthenticHabbo  = parser.isAuthenticUser;

        if(this._isAuthenticHabbo && this._furnitureReady && !this._furnitureListenersNotified)
        {
            this._furnitureListenersNotified = true;

            if(this._pendingFurnitureListeners && this._pendingFurnitureListeners.length)
            {
                for(const listener of this._pendingFurnitureListeners) listener && listener.loadFurnitureData();
            }
        }
    }

    private onUserSettingsEvent(event: UserSettingsEvent): void
    {
        if(!event || !event.connection) return;

        const parser = event.getParser();

        if(!parser) return;

        this._isRoomCameraFollowDisabled    = parser.cameraFollow;
        this._uiFlags                       = parser.flags;
    }

    private onChangeNameUpdateEvent(event: ChangeNameUpdateEvent): void
    {
        if(!event || !event.connection) return;

        const parser = event.getParser();

        if(!parser) return;

        if(parser.resultCode !== ChangeNameUpdateEvent._Str_5797) return;

        this._canChangeName = false;

        this.events.dispatchEvent(new UserNameUpdateEvent(parser.name));
    }

    private onUserNameChangeMessageEvent(event: UserNameChangeMessageEvent): void
    {
        if(!event || !event.connection) return;

        const parser = event.getParser();

        if(!parser) return;

        if(parser.webId !== this.userId) return;

        this._name          = parser.newName;
        this._canChangeName = false;

        this.events.dispatchEvent(new UserNameUpdateEvent(this._name));
    }

    private onRoomModelNameEvent(event: RoomModelNameEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        HabboWebTools.roomVisited(parser.roomId);
    }

    private onFurnitureDataReadyEvent(event: Event): void
    {
        this._furnitureData.removeEventListener(FurnitureDataParser.FURNITURE_DATA_READY, this.onFurnitureDataReadyEvent);

        this._furnitureReady = true;

        if(this._isAuthenticHabbo && !this._furnitureListenersNotified)
        {
            this._furnitureListenersNotified = true;

            if(this._pendingFurnitureListeners && this._pendingFurnitureListeners.length)
            {
                for(const listener of this._pendingFurnitureListeners) listener && listener.loadFurnitureData();
            }
        }
    }

    private destroyFurnitureData(): void
    {
        if(!this._furnitureData) return;

        this._furnitureData.dispose();

        this._furnitureData = null;
    }

    public getFloorItemData(id: number): IFurnitureData
    {
        const existing = this._floorItems.get(id);

        if(!existing) return null;

        return existing;
    }

    public getFloorItemDataByName(name: string): IFurnitureData
    {
        if(!name || !this._floorItems || !this._floorItems.size) return null;

        for(const item of this._floorItems.values())
        {
            if(!item || (item.className !== name)) continue;

            return item;
        }
    }

    public getWallItemData(id: number): IFurnitureData
    {
        const existing = this._wallItems.get(id);

        if(!existing) return null;

        return existing;
    }

    public getWallItemDataByName(name: string): IFurnitureData
    {
        if(!name || !this._wallItems || !this._wallItems.size) return null;

        for(const item of this._wallItems.values())
        {
            if(!item || (item.className !== name)) continue;

            return item;
        }
    }

    public getBadgeUrl(name: string): string
    {
        return this._badgeImageManager.getBadgeUrl(name);
    }

    public getGroupBadgeUrl(name: string): string
    {
        return this._badgeImageManager.getBadgeUrl(name, BadgeImageManager.GROUP_BADGE);
    }

    public getBadgeImage(name: string): Texture
    {
        return this._badgeImageManager.getBadgeImage(name);
    }

    public getGroupBadgeImage(name: string): Texture
    {
        return this._badgeImageManager.getBadgeImage(name, BadgeImageManager.GROUP_BADGE);
    }

    public loadBadgeImage(name: string): string
    {
        return this._badgeImageManager.loadBadgeImage(name);
    }

    public loadGroupBadgeImage(name: string): string
    {
        return this._badgeImageManager.loadBadgeImage(name, BadgeImageManager.GROUP_BADGE);
    }

    public isUserIgnored(userName: string): boolean
    {
        return false;
    }

    public hasSecurity(level: number): boolean
    {
        return this._securityLevel >= level;
    }

    public giveRespect(userId: number): void
    {
        if((userId < 0) || (this._respectsLeft <= 0)) return;

        this.send(new UserRespectComposer(userId));

        this._respectsLeft--;
    }

    public givePetRespect(petId: number): void
    {
        if((petId < 0) || (this._respectsPetLeft <= 0)) return;

        this.send(new PetRespectComposer(petId));

        this._respectsPetLeft--;
    }

    public sendSpecialCommandMessage(text: string, styleId: number = 0): void
    {
        this.send(new RoomUnitChatComposer(text));
    }

    private send(composer: IMessageComposer<unknown[]>): void
    {
        this._communication.connection.send(composer);
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

    public get realName(): string
    {
        return this._realName;
    }

    public get respectsReceived(): number
    {
        return this._respectsReceived;
    }

    public get respectsLeft(): number
    {
        return this._respectsLeft;
    }

    public get respectsPetLeft(): number
    {
        return this._respectsPetLeft;
    }

    public get canChangeName(): boolean
    {
        return this._canChangeName;
    }

    public get clubLevel(): number
    {
        return this._clubLevel;
    }

    public get securityLevel(): number
    {
        return this._securityLevel;
    }

    public get isAmbassador(): boolean
    {
        return this._isAmbassador;
    }

    public get isSystemOpen(): boolean
    {
        return this._systemOpen;
    }

    public get isSystemShutdown(): boolean
    {
        return this._systemShutdown;
    }

    public get isAuthenticHabbo(): boolean
    {
        return this._isAuthenticHabbo;
    }

    public get isModerator(): boolean
    {
        return (this._securityLevel >= SecurityLevel.MODERATOR);
    }

    public get isGodMode(): boolean
    {
        return this.securityLevel >= SecurityLevel.MODERATOR;
    }


    public get isCameraFollowDisabled(): boolean
    {
        return this._isRoomCameraFollowDisabled;
    }

    public get uiFlags(): number
    {
        return this._uiFlags;
    }
}
