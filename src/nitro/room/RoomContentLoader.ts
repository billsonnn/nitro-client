import { IAssetData } from '../../core/asset/interfaces';
import { IEventDispatcher } from '../../core/events/IEventDispatcher';
import { NitroConfiguration } from '../../NitroConfiguration';
import { RoomContentLoadedEvent } from '../../room/events/RoomContentLoadedEvent';
import { IRoomObject } from '../../room/object/IRoomObject';
import { GraphicAssetCollection } from '../../room/object/visualization/utils/GraphicAssetCollection';
import { IGraphicAssetCollection } from '../../room/object/visualization/utils/IGraphicAssetCollection';
import { NitroInstance } from '../NitroInstance';
import { FurnitureData } from '../session/furniture/FurnitureData';
import { FurnitureType } from '../session/furniture/FurnitureType';
import { IFurnitureDataListener } from '../session/furniture/IFurnitureDataListener';
import { ISessionDataManager } from '../session/ISessionDataManager';
import { RoomObjectCategory } from './object/RoomObjectCategory';
import { RoomObjectUserType } from './object/RoomObjectUserType';
import { RoomObjectVariable } from './object/RoomObjectVariable';
import { RoomObjectVisualizationType } from './object/RoomObjectVisualizationType';

export class RoomContentLoader implements IFurnitureDataListener
{
    private static PLACE_HOLDER: string         = 'place_holder';
    private static PLACE_HOLDER_WALL: string    = 'place_holder_wall';
    private static PLACE_HOLDER_PET: string     = 'place_holder_pet';
    private static PLACE_HOLDER_DEFAULT: string = RoomContentLoader.PLACE_HOLDER;
    private static ROOM: string                 = 'room';
    private static TILE_CURSOR: string          = 'tile_cursor';
    private static SELECTION_ARROW: string      = 'selection_arrow';

    private _stateEvents: IEventDispatcher;
    private _sessionDataManager: ISessionDataManager;
    private _waitingForSessionDataManager: boolean;
    private _collections: Map<string, IGraphicAssetCollection>;

    private _events: Map<string, IEventDispatcher>;
    private _activeObjects: { [index: string]: number };
    private _activeObjectTypes: Map<number, string>;
    private _activeObjectTypeIds: Map<string, number>;
    private _objectTypeAdUrls: Map<string, string>;
    private _wallItems: { [index: string]: number };
    private _wallItemTypes: Map<number, string>;
    private _wallItemTypeIds: Map<string, number>;
    private _pets: { [index: string]: number };

    private _pendingContentTypes: string[];

    constructor()
    {
        this._stateEvents                   = null;
        this._sessionDataManager            = null;
        this._waitingForSessionDataManager  = false;
        this._collections                   = new Map();

        this._events                        = new Map();
        this._activeObjects                 = {};
        this._activeObjectTypes             = new Map();
        this._activeObjectTypeIds           = new Map();
        this._objectTypeAdUrls              = new Map();
        this._wallItems                     = {};
        this._wallItemTypes                 = new Map();
        this._wallItemTypeIds               = new Map();
        this._pets                          = {};

        this._pendingContentTypes           = [];
    }

    public initialize(events: IEventDispatcher): void
    {
        this._stateEvents = events;

        this.setFurnitureData();

        for(let [ index, name ] of NitroConfiguration.PET_TYPES.entries()) this._pets[name] = index;
    }

    public dispose(): void
    {
        
    }

    public setSessionDataManager(sessionData: ISessionDataManager): void
    {
        this._sessionDataManager = sessionData;

        if(this._waitingForSessionDataManager)
        {
            this._waitingForSessionDataManager = false;

            this.setFurnitureData();
        }
    }

    public loadFurnitureData(): void
    {
        this.setFurnitureData();
    }

    private setFurnitureData(): void
    {
        if(!this._sessionDataManager)
        {
            this._waitingForSessionDataManager = true;

            return;
        }

        const furnitureData = this._sessionDataManager.getAllFurnitureData(this);

        if(!furnitureData) return;

        this._sessionDataManager.removePendingFurniDataListener(this);

        this.processFurnitureData(furnitureData);
    }

    private processFurnitureData(furnitureData: FurnitureData[]): void
    {
        if(!furnitureData) return;

        for(let furniture of furnitureData)
        {
            if(!furniture) continue;

            const id = furniture.id;
            
            let name        = furniture.className;
            let className   = furniture.className;

            if(furniture.colorId) name = (name + '*' + furniture.colorId);

            const adUrl = furniture.data.adUrl;

            if(adUrl && adUrl.length > 0) this._objectTypeAdUrls.set(name, adUrl);

            if(furniture.type === FurnitureType.FLOOR)
            {
                this._activeObjectTypes.set(id, name);
                this._activeObjectTypeIds.set(name, id);

                if(!this._activeObjects[className]) this._activeObjects[className] = 1;
            }
            else
            {
                if(furniture.type === FurnitureType.WALL)
                {
                    if(name === 'post.it')
                    {
                        name        = 'post_it';
                        className   = 'post_it';
                    }

                    if(name === 'post.it.vd')
                    {
                        name        = 'post_it_vd';
                        className   = 'post_id_vd';
                    }

                    this._wallItemTypes.set(id, name);
                    this._wallItemTypeIds.set(name, id);

                    if(!this._wallItems[className]) this._wallItems[className] = 1;
                }
            }
        }
    }

    public getFurnitureFloorNameForTypeId(typeId: number): string
    {
        const type = this._activeObjectTypes.get(typeId);
        
        return this.removeColorIndex(type);
    }

    public getFurnitureWallNameForTypeId(typeId: number, extra: string = null): string
    {
        let type = this._wallItemTypes.get(typeId);

        if((type === 'poster') && (extra !== null)) type = (type + extra);

        return this.removeColorIndex(type);
    }

    public getFurnitureFloorColorIndex(typeId: number): number
    {
        const type = this._activeObjectTypes.get(typeId);

        if(!type) return -1;

        return this.getColorIndexFromName(type);
    }

    public getFurnitureWallColorIndex(typeId: number): number
    {
        const type = this._wallItemTypes.get(typeId);

        if(!type) return -1;

        return this.getColorIndexFromName(type);
    }

    private getColorIndexFromName(name: string): number
    {
        if(!name) return -1;

        const index = name.indexOf('*');

        if(index === -1) return 0;

        return parseInt(name.substr(index + 1));
    }

    private removeColorIndex(name: string): string
    {
        if(!name) return null;

        const index = name.indexOf('*');

        if(index === -1) return name;

        return name.substr(0, index);
    }

    public getCollection(name: string): IGraphicAssetCollection
    {
        if(!name) return null;

        const existing = this._collections.get(name);

        if(!existing)
        {
            const globalCollection = NitroInstance.instance.core.asset.getCollection(name);

            if(globalCollection)
            {
                this._collections.set(name, globalCollection);

                return globalCollection;
            }

            return null;
        }

        return existing;
    }

    public addAssetToCollection(collectionName: string, assetName: string, texture: PIXI.Texture): boolean
    {
        const collection = this.getCollection(collectionName);

        if(!collection) return false;

        return collection.addAsset(assetName, texture, true, 0, 0, false, false);
    }

    private createCollection(data: IAssetData, spritesheet: PIXI.Spritesheet): GraphicAssetCollection
    {
        if(!data || !spritesheet) return null;

        const collection = new GraphicAssetCollection(data, spritesheet);

        this._collections.set(collection.name, collection);
    }

    public getPlaceholderName(type: string): string
    {
        if(this._activeObjects[type] !== undefined) return RoomContentLoader.PLACE_HOLDER;

        if(this._wallItems[type] !== undefined) return RoomContentLoader.PLACE_HOLDER_WALL;

        if(this._pets[type] !== undefined) return RoomContentLoader.PLACE_HOLDER_PET;
        
        return RoomContentLoader.PLACE_HOLDER_DEFAULT;
    }

    public getCategoryForType(type: string): number
    {
        if(!type) return RoomObjectCategory.MINIMUM;

        if(this._activeObjects[type] !== undefined) return RoomObjectCategory.FLOOR;

        if(this._wallItems[type] !== undefined) return RoomObjectCategory.WALL;

        if(this._pets[type] !== undefined) return RoomObjectCategory.UNIT;

        if(type.indexOf('poster') === 0) return RoomObjectCategory.WALL;

        if(type === 'room') return RoomObjectCategory.ROOM;

        if(type === RoomObjectUserType.USER) return RoomObjectCategory.UNIT;

        if(type === RoomObjectUserType.PET) return RoomObjectCategory.UNIT;

        if(type === RoomObjectUserType.BOT) return RoomObjectCategory.UNIT;

        if(type === RoomObjectUserType.RENTABLE_BOT) return RoomObjectCategory.UNIT;

        if(type === 'tile_cursor' || type === 'selection_arrow') return RoomObjectCategory.CURSOR;

        return RoomObjectCategory.MINIMUM;
    }

    public getPetNameForType(type: number): string
    {
        return NitroConfiguration.PET_TYPES[type] || null;
    }

    public isLoaderType(type: string): boolean
    {
        type = RoomObjectUserType.getRealType(type);

        if(type === RoomObjectVisualizationType.USER) return false;

        return true;
    }

    public downloadAsset(type: string, events: IEventDispatcher): boolean
    {
        const assetUrls: string[] = this.getAssetUrls(type);

        if(!assetUrls || !assetUrls.length) return false;

        if((this._pendingContentTypes.indexOf(type) >= 0) || this.getOrRemoveEventDispatcher(type)) return false;

        const loader = new PIXI.Loader();

        if(!loader) return false;

        this._pendingContentTypes.push(type);
        this._events.set(type, events);

        loader
            .use((resource: PIXI.LoaderResource, next: Function) => this.assetLoader(loader, resource, next))
            .add(assetUrls)
            .on('complete', () => this.onAssetDownloaded(loader, type))
            .load();

        return true;
    }
    
    private assetLoader(loader: PIXI.Loader, resource: PIXI.LoaderResource, next: Function): void
    {
        if(!resource || !resource.data || resource.data.type === undefined) return next();

        if(resource.type === PIXI.LoaderResource.TYPE.JSON)
        {
            const assetData     = resource.data as IAssetData;
            const loadOptions   = this.assetLoaderOptions(resource);
            const spriteSheet   = this.assetLoaderSpritesheetUrl(resource.url, assetData.spritesheet);

            loader.add(spriteSheet, spriteSheet, loadOptions, (res: any) =>
            {
                if(res.spritesheet) this.createCollection(assetData, res.spritesheet);

                next();
            });
        }
    }
    
    private assetLoaderOptions(resource: PIXI.LoaderResource): PIXI.ILoaderOptions
    {
        return {
            crossOrigin: resource.crossOrigin,
            loadType: PIXI.LoaderResource.LOAD_TYPE.XHR,
            metadata: resource.metadata,
            //@ts-ignore
            parentResource: resource
        };
    }

    private onAssetDownloaded(loader: PIXI.Loader, type: string): void
    {
        if(loader) loader.destroy();

        if(!type) return;

        const events = this._events.get(type);

        if(!events) return;

        events.dispatchEvent(new RoomContentLoadedEvent(RoomContentLoadedEvent.RCLE_SUCCESS, type));
    }
    
    private assetLoaderSpritesheetUrl(resourceUrl: string, spritesheetFilename: string): string
    {
        const lastDashPosition  = resourceUrl.lastIndexOf('/');
        const spritesheetUrl    = resourceUrl.substring(0, lastDashPosition + 1) + spritesheetFilename;

        return spritesheetUrl;
    }

    private getAssetUrls(type: string): string[]
    {
        switch(type)
        {
            case RoomContentLoader.PLACE_HOLDER:
                return [ this.getAssetUrlWithRoomBase('place_holder') ];
            case RoomContentLoader.PLACE_HOLDER_WALL:
                return [ this.getAssetUrlWithRoomBase('place_holder_wall') ];
            case RoomContentLoader.PLACE_HOLDER_PET:
                return [ this.getAssetUrlWithRoomBase('place_holder_pet') ];
            case RoomContentLoader.ROOM:
                return [ this.getAssetUrlWithRoomBase('room') ]
            case RoomContentLoader.TILE_CURSOR:
                return [ this.getAssetUrlWithRoomBase('tile_cursor') ];
            case RoomContentLoader.SELECTION_ARROW:
                return [ this.getAssetUrlWithRoomBase('selection_arrow') ];
            default:
                const category = this.getCategoryForType(type);

                if((category === RoomObjectCategory.FLOOR) || (category === RoomObjectCategory.WALL))
                {
                    return [ this.getAssetUrlWithFurniBase(type) ];
                }

                if(category === RoomObjectCategory.UNIT)
                {
                    return [ this.getAssetUrlWithPetBase(type) ];
                }

                return null;
        }
    }

    private getAssetUrlWithRoomBase(assetName: string): string
    {
        return (NitroConfiguration.ROOM_ASSET_URL.replace(/%libname%/gi, assetName));
    }

    public getAssetUrlWithFurniBase(assetName: string): string
    {
        return (NitroConfiguration.FURNI_ASSET_URL.replace(/%libname%/gi, assetName));
    }

    public getAssetUrlWithPetBase(assetName: string): string
    {
        return (NitroConfiguration.PET_ASSET_URL.replace(/%libname%/gi, assetName));
    }

    public setRoomObjectRoomId(object: IRoomObject, roomId: string): void
    {
        const model = object && object.model;

        if(!model) return;

        model.setValue(RoomObjectVariable.OBJECT_ROOM_ID, roomId);
    }

    private getOrRemoveEventDispatcher(type: string, remove: boolean = false): IEventDispatcher
    {
        const existing = this._events.get(type);

        if(remove) this._events.delete(type);

        return existing;
    }
}