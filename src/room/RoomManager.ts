import { GraphicAssetCollection } from '../core/asset/GraphicAssetCollection';
import { NitroManager } from '../core/common/NitroManager';
import { RoomContentLoadedEvent } from '../nitro/room/events/RoomContentLoadedEvent';
import { RoomContentLoader } from '../nitro/room/RoomContentLoader';
import { IRoomInstance } from './IRoomInstance';
import { IRoomInstanceContainer } from './IRoomInstanceContainer';
import { IRoomManager } from './IRoomManager';
import { IRoomManagerListener } from './IRoomManagerListener';
import { IRoomObjectManager } from './IRoomObjectManager';
import { IRoomObject } from './object/IRoomObject';
import { IRoomObjectController } from './object/IRoomObjectController';
import { IRoomObjectLogicFactory } from './object/logic/IRoomObjectLogicFactory';
import { IRoomObjectVisualizationFactory } from './object/visualization/IRoomObjectVisualizationFactory';
import { RoomInstance } from './RoomInstance';
import { RoomObjectManager } from './RoomObjectManager';

export class RoomManager extends NitroManager implements IRoomManager, IRoomInstanceContainer
{
    private _rooms: Map<number, IRoomInstance>;
    private _contentLoader: RoomContentLoader;
    private _updateCategories: number[];

    private _listener: IRoomManagerListener;
    private _visualizationFactory: IRoomObjectVisualizationFactory;
    private _logicFactory: IRoomObjectLogicFactory;

    private _pendingContentTypes: string[];
    private _skipContentProcessing: boolean;

    constructor(listener: IRoomManagerListener, visualizationFactory: IRoomObjectVisualizationFactory, logicFactory: IRoomObjectLogicFactory)
    {
        super();

        this._rooms                 = new Map();
        this._contentLoader         = null;
        this._updateCategories      = [];

        this._listener              = listener;
        this._visualizationFactory  = visualizationFactory;
        this._logicFactory          = logicFactory;

        this._pendingContentTypes   = [];
        this._skipContentProcessing = false;

        this.events.addEventListener(RoomContentLoadedEvent.RCLE_SUCCESS, this.onRoomContentLoadedEvent.bind(this));
    }

    protected onDispose(): void
    {
        super.onDispose();
        
        return;
    }

    public getRoomInstance(roomId: number): IRoomInstance
    {
        const existing = this._rooms.get(roomId);

        if(!existing) return null;

        return existing;
    }

    public createRoomInstance(roomId: number): IRoomInstance
    {
        if(this._rooms.get(roomId)) return null;

        const instance = new RoomInstance(roomId, this);

        this._rooms.set(instance.id, instance);

        if(this._updateCategories.length)
        {
            for(let category of this._updateCategories)
            {
                instance.addUpdateCategory(category);
            }
        }

        return instance;
    }

    public removeRoomInstance(roomId: number): boolean
    {
        const existing = this._rooms.get(roomId);

        if(!existing) return false;

        this._rooms.delete(roomId);

        existing.dispose();

        return true;
    }

    public createRoomObjectAndInitalize(roomId: number, objectId: number, type: string, category: number): IRoomObject
    {
        const instance = this.getRoomInstance(roomId);

        if(!instance) return null;

        let visualization                   = type;
        let logic                           = type;
        let assetName                       = type;
        let asset: GraphicAssetCollection   = null;
        let isLoading: boolean              = false;

        if(this._contentLoader.isLoaderType(type))
        {
            asset = this._contentLoader.getCollection(type);

            if(!asset)
            {
                isLoading = true;

                this._contentLoader.downloadAsset(type, this.events);

                assetName   = this._contentLoader.getPlaceholderName(type);
                asset       = this._contentLoader.getCollection(assetName);

                if(!asset) return null;
            }

            visualization   = asset.data.visualizationType;
            logic           = asset.data.logicType;

            const object = instance.createRoomObject(objectId, type, category) as IRoomObjectController;

            if(!object) return null;

            if(this._visualizationFactory)
            {
                const visualizationInstance = this._visualizationFactory.getVisualization(visualization);

                if(!visualizationInstance)
                {
                    instance.removeRoomObject(objectId, category);

                    return null;
                }

                visualizationInstance.asset = asset;

                const visualizationData = this._visualizationFactory.getVisualizationData(assetName, visualization, asset.data);

                if(!visualizationData || !visualizationInstance.initialize(visualizationData))
                {
                    instance.removeRoomObject(objectId, category);

                    return null;
                }

                object.setVisualization(visualizationInstance);
            }

            if(this._logicFactory)
            {
                const logicInstance = this._logicFactory.getLogic(logic);

                logicInstance.setObject(object);

                if(logicInstance)
                {
                    logicInstance.initialize(asset.data);
                }

                object.setLogic(logicInstance);
            }

            if(!isLoading) object.isReady = true;

            this._contentLoader.setRoomObjectRoomId(object, roomId);

            return object;
        }
    }

    private reinitializeRoomObjectsByType(type: string): void
    {
        if(!type || !this._contentLoader || !this._visualizationFactory || !this._logicFactory) return;

        const asset = this._contentLoader.getCollection(type);

        if(!asset) return;

        const visualization     = asset.data.visualizationType;
        const logic             = asset.data.logicType;
        const visualizationData = this._visualizationFactory.getVisualizationData(type, visualization, asset.data);

        for(let room of this._rooms.values())
        {
            if(!room) continue;

            for(let manager of room.managers.values())
            {
                if(!manager) continue;

                for(let object of manager.objects.values())
                {
                    if(!object || object.type !== type) continue;

                    const visualizationInstance = this._visualizationFactory.getVisualization(visualization);

                    if(visualizationInstance)
                    {
                        visualizationInstance.asset = asset;

                        if(!visualizationData || !visualizationInstance.initialize(visualizationData))
                        {
                            manager.removeObject(object.id);
                        }
                        else
                        {
                            object.setVisualization(visualizationInstance);

                            const logicInstance = this._logicFactory.getLogic(logic);

                            logicInstance.setObject(object);

                            if(logicInstance)
                            {
                                logicInstance.initialize(asset.data);
                            }

                            object.setLogic(logicInstance);

                            object.isReady = true;

                            if(this._listener) this._listener.refreshRoomObjectFurnitureData(room.id, object.id, object.category);
                        }
                    }
                    else
                    {
                        manager.removeObject(object.id);
                    }
                }
            }
        }
    }

    public addUpdateCategory(category: number): void
    {
        const index = this._updateCategories.indexOf(category);

        if(index >= 0) return;

        this._updateCategories.push(category);

        if(!this._rooms.size) return;

        for(let room of this._rooms.values())
        {
            if(!room) continue;

            room.addUpdateCategory(category);
        }
    }

    public removeUpdateCategory(category: number): void
    {
        const index = this._updateCategories.indexOf(category);

        if(index === -1) return;

        this._updateCategories.splice(index, 1);

        if(!this._rooms.size) return;

        for(let room of this._rooms.values())
        {
            if(!room) continue;

            room.removeUpdateCategory(category);
        }
    }

    public setContentLoader(loader: RoomContentLoader): void
    {
        if(this._contentLoader) this._contentLoader.dispose();

        this._contentLoader = loader;
    }

    private processPendingContentTypes(time: number): void
    {
        if(this._skipContentProcessing)
        {
            this._skipContentProcessing = false;

            return;
        }

        while(this._pendingContentTypes.length)
        {
            const type = this._pendingContentTypes.shift();

            const collection = this._contentLoader.getCollection(type);

            if(!collection)
            {
                console.log('bad collection');

                return;
            }

            this.reinitializeRoomObjectsByType(type);
        }
    }

    private onRoomContentLoadedEvent(event: RoomContentLoadedEvent): void
    {
        if(!this._contentLoader) return;

        const contentType = event.contentType;

        if(this._pendingContentTypes.indexOf(contentType) >= 0) return;

        this._pendingContentTypes.push(contentType);
    }

    public update(time: number): void
    {
        this.processPendingContentTypes(time);

        if(!this._rooms.size) return;

        for(let room of this._rooms.values())
        {
            if(!room) continue;

            room.update(time);
        }
    }

    public createRoomObjectManager(category: number): IRoomObjectManager
    {
        return new RoomObjectManager(category);
    }

    public get rooms(): Map<number, IRoomInstance>
    {
        return this._rooms;
    }
}