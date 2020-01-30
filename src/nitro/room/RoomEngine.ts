import * as PIXI from 'pixi.js-legacy';
import { IConnection } from '../../core/communication/connections/IConnection';
import { EventDispatcher } from '../../core/events/EventDispatcher';
import { IEventDispatcher } from '../../core/events/IEventDispatcher';
import { NitroConfiguration } from '../../NitroConfiguration';
import { IRoomInstance } from '../../room/IRoomInstance';
import { IRoomManager } from '../../room/IRoomManager';
import { IRoomManagerListener } from '../../room/IRoomManagerListener';
import { RoomObjectUpdateMessage } from '../../room/messages/RoomObjectUpdateMessage';
import { IRoomObject } from '../../room/object/IRoomObject';
import { IRoomObjectController } from '../../room/object/IRoomObjectController';
import { IRoomObjectLogicFactory } from '../../room/object/logic/IRoomObjectLogicFactory';
import { IRoomObjectVisualizationFactory } from '../../room/object/visualization/IRoomObjectVisualizationFactory';
import { IRoomRenderer } from '../../room/renderer/IRoomRenderer';
import { IRoomRendererFactory } from '../../room/renderer/IRoomRendererFactory';
import { RoomRendererFactory } from '../../room/renderer/RoomRendererFactory';
import { IVector3D } from '../../room/utils/IVector3D';
import { Vector3d } from '../../room/utils/Vector3d';
import { INitroCommunicationManager } from '../communication/INitroCommunicationManager';
import { RoomModelParser } from '../communication/messages/parser/room/mapping/RoomModelParser';
import { NitroInstance } from '../NitroInstance';
import { RoomSessionEvent } from '../session/events/RoomSessionEvent';
import { IRoomSessionManager } from '../session/IRoomSessionManager';
import { ISessionDataManager } from '../session/ISessionDataManager';
import { RoomEngineEvent } from './events/RoomEngineEvent';
import { IRoomCreator } from './IRoomCreator';
import { IRoomEngine } from './IRoomEngine';
import { IRoomEngineServices } from './IRoomEngineServices';
import { ObjectAvatarCarryObjectUpdateMessage } from './messages/ObjectAvatarCarryObjectUpdateMessage';
import { ObjectAvatarChatUpdateMessage } from './messages/ObjectAvatarChatUpdateMessage';
import { ObjectAvatarDanceUpdateMessage } from './messages/ObjectAvatarDanceUpdateMessage';
import { ObjectAvatarEffectUpdateMessage } from './messages/ObjectAvatarEffectUpdateMessage';
import { ObjectAvatarExperienceUpdateMessage } from './messages/ObjectAvatarExperienceUpdateMessage';
import { ObjectAvatarExpressionUpdateMessage } from './messages/ObjectAvatarExpressionUpdateMessage';
import { ObjectAvatarFigureUpdateMessage } from './messages/ObjectAvatarFigureUpdateMessage';
import { ObjectAvatarFlatControlUpdateMessage } from './messages/ObjectAvatarFlatControlUpdateMessage';
import { ObjectAvatarGestureUpdateMessage } from './messages/ObjectAvatarGestureUpdateMessage';
import { ObjectAvatarGuideStatusUpdateMessage } from './messages/ObjectAvatarGuideStatusUpdateMessage';
import { ObjectAvatarMutedUpdateMessage } from './messages/ObjectAvatarMutedUpdateMessage';
import { ObjectAvatarOwnMessage } from './messages/ObjectAvatarOwnMessage';
import { ObjectAvatarPlayerValueUpdateMessage } from './messages/ObjectAvatarPlayerValueUpdateMessage';
import { ObjectAvatarPlayingGameUpdateMessage } from './messages/ObjectAvatarPlayingGameUpdateMessage';
import { ObjectAvatarPostureUpdateMessage } from './messages/ObjectAvatarPostureUpdateMessage';
import { ObjectAvatarSignUpdateMessage } from './messages/ObjectAvatarSignUpdateMessage';
import { ObjectAvatarSleepUpdateMessage } from './messages/ObjectAvatarSleepUpdateMessage';
import { ObjectAvatarTypingUpdateMessage } from './messages/ObjectAvatarTypingUpdateMessage';
import { ObjectAvatarUpdateMessage } from './messages/ObjectAvatarUpdateMessage';
import { ObjectAvatarUseObjectUpdateMessage } from './messages/ObjectAvatarUseObjectUpdateMessage';
import { ObjectDataUpdateMessage } from './messages/ObjectDataUpdateMessage';
import { ObjectHeightUpdateMessage } from './messages/ObjectHeightUpdateMessage';
import { ObjectMoveUpdateMessage } from './messages/ObjectMoveUpdateMessage';
import { ObjectStateUpdateMessage } from './messages/ObjectStateUpdateMessage';
import { IObjectData } from './object/data/IObjectData';
import { ObjectDataFactory } from './object/data/ObjectDataFactory';
import { ObjectLogicFactory } from './object/logic/ObjectLogicFactory';
import { RoomObjectCategory } from './object/RoomObjectCategory';
import { RoomObjectModelKey } from './object/RoomObjectModelKey';
import { ObjectVisualizationFactory } from './object/visualization/ObjectVisualizationFactory';
import { RoomContentLoader } from './RoomContentLoader';
import { RoomMessageHandler } from './RoomMessageHandler';
import { RoomObjectEventHandler } from './RoomObjectEventHandler';
import { FurnitureData } from './utils/FurnitureData';
import { FurnitureStackingHeightMap } from './utils/FurnitureStackingHeightMap';
import { LegacyWallGeometry } from './utils/LegacyWallGeometry';
import { RoomInstanceData } from './utils/RoomInstanceData';
import { SelectedRoomObjectData } from './utils/SelectedRoomObjectData';

export class RoomEngine implements IRoomEngine, IRoomCreator, IRoomEngineServices, IRoomManagerListener
{
    public static ROOM_OBJECT_ID: number       = -1;
    public static ROOM_OBJECT_TYPE: string     = 'room';

    public static CURSOR_OBJECT_ID: number     = -2;
    public static CURSOR_OBJECT_TYPE: string   = 'tile_cursor';

    private _events: IEventDispatcher;
    private _communication: INitroCommunicationManager;
    private _sessionData: ISessionDataManager;
    private _roomSession: IRoomSessionManager;
    private _roomManager: IRoomManager;
    private _roomObjectEventHandler: RoomObjectEventHandler;
    private _roomMessageHandler: RoomMessageHandler;
    private _roomContentLoader: RoomContentLoader;

    private _activeRoomId: number;
    private _roomInstanceData: Map<number, RoomInstanceData>;

    private _roomRendererFactory: IRoomRendererFactory;
    private _visualizationFactory: IRoomObjectVisualizationFactory;
    private _logicFactory: IRoomObjectLogicFactory;

    private _pendingObjects: IRoomObject[];
    private _processingObjects: boolean;

    private _isReady: boolean;
    private _isDisposed: boolean;

    constructor(communication: INitroCommunicationManager)
    {
        this._events                    = new EventDispatcher();
        this._communication             = communication;
        this._sessionData               = null;
        this._roomSession               = null;
        this._roomManager               = null;
        this._roomObjectEventHandler    = new RoomObjectEventHandler(this);
        this._roomMessageHandler        = new RoomMessageHandler(this);
        this._roomContentLoader         = new RoomContentLoader();

        this._activeRoomId              = -1;
        this._roomInstanceData          = new Map();

        this._roomRendererFactory       = new RoomRendererFactory();
        this._visualizationFactory      = new ObjectVisualizationFactory();
        this._logicFactory              = new ObjectLogicFactory();

        this._pendingObjects            = [];
        this._processingObjects         = false;

        this._isReady                   = false;
        this._isDisposed                = false;
    }

    public initialize(sessionData: ISessionDataManager, roomSession: IRoomSessionManager, roomManager: IRoomManager): void
    {
        if(this._isReady) return;

        this._sessionData   = sessionData;
        this._roomSession   = roomSession;
        this._roomManager   = roomManager;

        this._roomManager.setContentLoader(this._roomContentLoader);
        this._roomManager.addUpdateCategory(RoomObjectCategory.FLOOR);
        this._roomManager.addUpdateCategory(RoomObjectCategory.WALL);
        this._roomManager.addUpdateCategory(RoomObjectCategory.UNIT);
        this._roomManager.addUpdateCategory(RoomObjectCategory.ROOM);

        this._roomMessageHandler.setConnection(this._communication.connection);

        this._roomContentLoader.initialize(this._events);
        this._roomContentLoader.setSessionDataManager(this._sessionData);

        this._roomSession.events.addEventListener(RoomSessionEvent.STARTED, this.onRoomSessionEvent.bind(this));
        this._roomSession.events.addEventListener(RoomSessionEvent.ENDED, this.onRoomSessionEvent.bind(this));

        PIXI.Ticker.shared.add(this.update, this);

        this._isReady = true;
    }

    public dispose(): void
    {
        if(!this._isReady || this._isDisposed) return;

        PIXI.Ticker.shared.remove(this.update, this);

        if(this._roomObjectEventHandler) this._roomObjectEventHandler.dispose();

        if(this._roomMessageHandler) this._roomMessageHandler.dispose();
        
        this._roomSession.events.removeEventListener(RoomSessionEvent.STARTED, this.onRoomSessionEvent.bind(this));
        this._roomSession.events.removeEventListener(RoomSessionEvent.ENDED, this.onRoomSessionEvent.bind(this));

        this._isDisposed = true;
    }

    private onRoomSessionEvent(event: RoomSessionEvent): void
    {
        if(!(event instanceof RoomSessionEvent)) return;

        switch(event.type)
        {
            case RoomSessionEvent.STARTED:
                if(this._roomMessageHandler) this._roomMessageHandler.setRoomId(event.session.roomId);

                this._activeRoomId = event.session.roomId;
                return;
            case RoomSessionEvent.ENDED:
                if(this._roomMessageHandler)
                {
                    this._roomMessageHandler.clearRoomId();
                    this.removeRoomInstance(event.session.roomId);
                }

                this._activeRoomId = -1;
                return;
        }
    }

    public destroyRoom(roomId: number): void
    {
        this.removeRoomInstance(roomId);
    }

    public getRoomInstance(roomId: number): IRoomInstance
    {
        return (this._roomManager && this._roomManager.getRoomInstance(roomId)) || null;
    }

    public removeRoomInstance(roomId: number): void
    {
        const instance = this.getRoomInstance(roomId);

        if(instance)
        {
            this._roomManager && this._roomManager.removeRoomInstance(roomId);
        }

        const existing = this._roomInstanceData.get(roomId);

        if(existing)
        {
            this._roomInstanceData.delete(existing.roomId);

            existing.dispose();
        }

        this._events.dispatchEvent(new RoomEngineEvent(RoomEngineEvent.DISPOSED, roomId));
    }

    public createRoomInstance(roomId: number): IRoomInstance
    {
        if(!this._isReady)
        {
            console.log('Room Engine not initilized yet, can not create room. Room data stored for later initialization.');

            return;
        }

        const instance = this.setupRoomInstance(roomId);

        if(!instance) return;

        this._events.dispatchEvent(new RoomEngineEvent(RoomEngineEvent.INITIALIZED, roomId));

        return instance;
    }

    private setupRoomInstance(roomId: number): IRoomInstance
    {
        if(!this._isReady) return;

        const instance = this._roomManager.createRoomInstance(roomId);

        if(!instance) return null;

        this._pendingObjects = [];

        return instance;
    }

    public initializeRoomInstance(roomId: number, model: RoomModelParser): void
    {
        const instance = this.getRoomInstance(roomId);

        if(!instance) return;

        if(model)
        {
            const object = instance.createRoomObject(RoomEngine.ROOM_OBJECT_ID, RoomEngine.ROOM_OBJECT_TYPE, RoomObjectCategory.ROOM);

            this._roomManager.createRoomObjectAndInitalize(roomId, RoomEngine.ROOM_OBJECT_ID, RoomEngine.ROOM_OBJECT_TYPE, RoomObjectCategory.ROOM);
        }

        if(NitroConfiguration.WALKING_ENABLED)
        {
            const tileCursor = instance.createRoomObject(RoomEngine.CURSOR_OBJECT_ID, RoomEngine.CURSOR_OBJECT_TYPE, RoomObjectCategory.ROOM);

            if(tileCursor)
            {
                //tileCursor.processUpdateMessage(new ObjectTileCursorUpdateMessage(null, null));

                //this.roomObjectReady(tileCursor);
            }
        }

        NitroInstance.instance.renderer.resizeRenderer();
    }

    public getRoomDisplay(roomId: number, id: number, width: number, height: number, scale: number): PIXI.DisplayObject
    {
        const instance = this.getRoomInstance(roomId);

        if(!instance) return null;

        let renderer = instance.renderer as IRoomRenderer;

        if(!renderer)
        {
            renderer = this._roomRendererFactory.createRenderer();

            if(!renderer) return null;
        }

        instance.setRenderer(renderer);

        const canvas = renderer.createCanvas(id, width, height, scale);

        if(!canvas) return null;

        canvas.setMouseListener(this._roomObjectEventHandler);

        if(canvas.geometry)
        {
            canvas.geometry._Str_17100 = 1; // z scale
        }

        return canvas.displayObject;
    }

    public update(time: number): void
    {
        if(!this._roomManager) return;

        time = PIXI.Ticker.shared.lastTime;

        this.processPendingFurniture();

        this._roomManager.update(time);
    }

    private processPendingFurniture(): void
    {
        const furniturePerTick: number = 5;

        const startTime = Date.now();

        for(let instanceData of this._roomInstanceData.values())
        {
            if(!instanceData) continue;

            let pendingData: FurnitureData = null;

            let totalFurnitureAdded: number = 0;
            let furnitureAdded: boolean     = false;

            while(pendingData = instanceData.getNextPendingFurniture())
            {
                furnitureAdded = this.processPendingFurnitureFloor(instanceData.roomId, pendingData.id, pendingData);

                if(!(++totalFurnitureAdded % furniturePerTick))
                {
                    if((Date.now() - startTime) >= 40) return;
                }
            }
        }
    }

    private processPendingFurnitureFloor(roomId: number, id: number, data: FurnitureData): boolean
    {
        if(!data)
        {
            const instanceData = this.getRoomInstanceData(roomId);

            if(instanceData) data = instanceData.getPendingFurniture(id);

            if(!data) return false;
        }

        let type    = data.type;
        let didLoad = false;

        if(!type)
        {
            type    = this.getFurnitureFloorNameForTypeId(data.typeId);
            didLoad = true;

        }

        const object = this.createRoomObjectFloor(roomId, id, type);

        if(!object) return false;

        const model = object.model;

        if(model)
        {
            model.setValue(RoomObjectModelKey.FURNITURE_COLOR, this.getFurnitureColorIndexForTypeId(data.typeId));
            model.setValue(RoomObjectModelKey.FURNITURE_TYPE_ID, data.typeId);
            model.setValue(RoomObjectModelKey.FURNITURE_REAL_ROOM_OBJECT, (data.realRoomObject ? 1 : 0));
            model.setValue(RoomObjectModelKey.FURNITURE_EXPIRY_TIME, data.expiryTime);
            model.setValue(RoomObjectModelKey.FURNITURE_EXPIRTY_TIMESTAMP, NitroInstance.instance.renderer.totalTimeRunning);
            model.setValue(RoomObjectModelKey.FURNITURE_USAGE_POLICY, data.usagePolicy);
            model.setValue(RoomObjectModelKey.FURNITURE_OWNER_ID, data.ownerId);
            model.setValue(RoomObjectModelKey.FURNITURE_OWNER_NAME, data.ownerName);
        }

        if(!this.updateRoomObjectFloor(roomId, id, data.location, data.direction, data.state, data.data, data.extra)) return false;

        if(data.sizeZ >= 0)
        {
            if(!this.updateRoomObjectFloorHeight(roomId, id, data.sizeZ)) return false;
        }

        if(object.isReady && data.synchronized)
        {
            
        }

        return true;
    }

    public getFurnitureFloorNameForTypeId(typeId: number): string
    {
        if(!this._roomContentLoader) return null;

        return this._roomContentLoader.getFurnitureFloorNameForTypeId(typeId);
    }

    public getFurnitureColorIndexForTypeId(typeId: number): number
    {
        if(!this._roomContentLoader) return null;

        return this._roomContentLoader.getColorIndex(typeId);
    }

    private getRoomInstanceData(roomId: number): RoomInstanceData
    {
        const existing = this._roomInstanceData.get(roomId);

        if(existing) return existing;

        const data = new RoomInstanceData(roomId);

        this._roomInstanceData.set(data.roomId, data);

        return data;
    }

    public setRoomInstanceModelName(roomId: number, name: string): void
    {
        const instanceData = this.getRoomInstanceData(roomId);

        if(!instanceData) return;

        instanceData.setModelName(name);
    }

    public getSelectedRoomObjectData(roomId: number): SelectedRoomObjectData
    {
        const instanceData = this.getRoomInstanceData(roomId);

        if(!instanceData) return null;

        return instanceData.selectedObject;
    }

    public setSelectedRoomObjectData(roomId: number, data: SelectedRoomObjectData): void
    {
        const instanceData = this.getRoomInstanceData(roomId);

        if(!instanceData) return null;
        
        instanceData.setSelectedObject(data);
    }

    public getFurnitureStackingHeightMap(roomId: number): FurnitureStackingHeightMap
    {
        const instanceData = this.getRoomInstanceData(roomId);

        if(!instanceData) return null;

        return instanceData.furnitureStackingHeightMap;
    }

    public setFurnitureStackingHeightMap(roomId: number, heightMap: FurnitureStackingHeightMap): void
    {
        const instanceData = this.getRoomInstanceData(roomId);

        if(!instanceData) return null;

        instanceData.setFurnitureStackingHeightMap(heightMap);
    }

    public getLegacyWallGeometry(roomId: number): LegacyWallGeometry
    {
        const instanceData = this.getRoomInstanceData(roomId);

        if(!instanceData) return null;

        return instanceData.legacyGeometry;
    }

    private createRoomObject(roomId: number, objectId: number, type: string, category: number): IRoomObjectController
    {
        const instance = this.getRoomInstance(roomId);

        if(!instance) return null;

        return instance.createRoomObject(objectId, type, category)  as IRoomObjectController;
    }

    private createRoomObjectAndInitialize(roomId: number, objectId: number, type: string, category: number): IRoomObjectController
    {
        const instance = this.getRoomInstance(roomId);

        if(!instance) return null;

        return instance.createRoomObjectAndInitalize(objectId, type, category) as IRoomObjectController;
    }

    public addRoomObjects(...objects: IRoomObject[]): void
    {
        this._pendingObjects.push(...objects);
    }

    public getRoomObject(roomId: number, objectId: number, category: number): IRoomObjectController
    {
        const instance = this.getRoomInstance(roomId);

        if(!instance) return null;

        return instance.getRoomObject(objectId, category) as IRoomObjectController;
    }

    public getRoomObjectCursor(roomId: number): IRoomObjectController
    {
        return this.getRoomObject(roomId, RoomEngine.CURSOR_OBJECT_ID, RoomObjectCategory.ROOM);
    }

    public getRoomObjectUser(roomId: number, objectId: number): IRoomObjectController
    {
        return this.getRoomObject(roomId, objectId, RoomObjectCategory.UNIT);
    }

    public removeRoomObjectUser(roomId: number, objectId: number): void
    {
        return this.removeRoomObject(roomId, objectId, RoomObjectCategory.UNIT);
    }

    public getRoomObjectFloor(roomId: number, objectId: number): IRoomObjectController
    {
        return this.getRoomObject(roomId, objectId, RoomObjectCategory.FLOOR);
    }

    public removeRoomObjectFloor(roomId: number, objectId: number): void
    {
        return this.removeRoomObject(roomId, objectId, RoomObjectCategory.FLOOR);
    }

    public createRoomObjectFloor(roomId: number, id: number, type: string): IRoomObjectController
    {
        return this.createRoomObjectAndInitialize(roomId, id, type, RoomObjectCategory.FLOOR);
    }

    private removeRoomObject(roomId: number, objectId: number, category: number): void
    {
        const instance = this.getRoomInstance(roomId);

        if(!instance) return null;

        instance.removeRoomObject(objectId, category);
    }

    public addFurniture(roomId: number, id: number, typeId: number, location: IVector3D, direction: IVector3D, state: number, objectData: IObjectData, extra: number = NaN, expires: number = -1, usagePolicy: number = 0, ownerId: number = 0, ownerName: string = '', synchronized: boolean = true, realRoomObject: boolean = true, sizeZ: number = -1): void
    {
        const instanceData = this.getRoomInstanceData(roomId);

        if(!instanceData) return null;

        const furnitureData = new FurnitureData(id, typeId, null, location, direction, state, objectData, extra, expires, usagePolicy, ownerId, ownerName, synchronized, realRoomObject, sizeZ);

        instanceData.addPendingFurniture(furnitureData);
    }

    public updateRoomObjectFloor(roomId: number, objectId: number, location: IVector3D, direction: IVector3D, state: number, data: IObjectData, extra: number = NaN): boolean
    {
        const object = this.getRoomObjectFloor(roomId, objectId);

        if(!object) return false;
        
        object.processUpdateMessage(new RoomObjectUpdateMessage(location, direction));
        object.processUpdateMessage(new ObjectDataUpdateMessage(state, data, extra));
        
        return true;
    }

    public updateRoomObjectFloorHeight(roomId: number, objectId: number, height: number): boolean
    {
        const object = this.getRoomObjectFloor(roomId, objectId);

        if(!object) return false;
        
        object.processUpdateMessage(new ObjectHeightUpdateMessage(null, null, height));

        return true;
    }

    public rollRoomObjectFloor(roomId: number, objectId: number, location: IVector3D, targetLocation: IVector3D): void
    {
        const object = this.getRoomObjectFloor(roomId, objectId);

        if(!object) return;

        object.processUpdateMessage(new ObjectMoveUpdateMessage(location, targetLocation, null, !!targetLocation));
    }

    public addRoomObjectUser(roomId: number, objectId: number, location: IVector3D, direction: IVector3D, type: string, figure: string, gender: string): boolean
    {
        const existing = this.getRoomObjectUser(roomId, objectId);

        if(existing) return false;

        const object = this.createRoomObject(roomId, objectId, type, RoomObjectCategory.UNIT);

        if(!object) return false;

        object.setLocation(location);
        object.setDirection(direction);

        object.processUpdateMessage(new ObjectAvatarFigureUpdateMessage(figure, gender));

        this.addRoomObjects(object);

        return true;
    }

    public updateRoomObjectUserLocation(roomId: number, objectId: number, location: IVector3D, targetLocation: IVector3D, canStandUp: boolean = false, baseY: number = 0, direction: IVector3D = null, headDirection: number = NaN): void
    {
        const object = this.getRoomObjectUser(roomId, objectId);

        if(!object) return;

        if(!location) location = object.getLocation();

        if(!direction) direction = object.getDirection();

        if(isNaN(headDirection)) headDirection = object.model.getValue(RoomObjectModelKey.HEAD_DIRECTION) as number;

        object.processUpdateMessage(new ObjectAvatarUpdateMessage(this.getLocationWithOffset(roomId, location), this.getLocationWithOffset(roomId, targetLocation), direction, headDirection, canStandUp, baseY));
    }

    private getLocationWithOffset(roomId: number, location: IVector3D): IVector3D
    {
        if(!location) return null;
        
        const heightMap     = this.getFurnitureStackingHeightMap(roomId);
        const wallGeometry  = this.getLegacyWallGeometry(roomId);

        if(!heightMap || !wallGeometry) return location;

        let height: number = location.z;

        const floorHeight: number = heightMap.getHeight(location.x, location.y);

        return new Vector3d(location.x, location.y, height);
    }

    public updateRoomObjectUserAction(roomId: number, objectId: number, action: string, value: number, parameter: string = null): void
    {
        const object = this.getRoomObjectUser(roomId, objectId);

        if(!object) return;

        let message: ObjectStateUpdateMessage = null;
        
        switch(action)
        {
            case RoomObjectModelKey.FIGURE_TALK:
                message = new ObjectAvatarChatUpdateMessage(value);
                break;
            case RoomObjectModelKey.FIGURE_SLEEP:
                message = new ObjectAvatarSleepUpdateMessage(value === 1);
                break;
            case RoomObjectModelKey.FIGURE_IS_TYPING:
                message = new ObjectAvatarTypingUpdateMessage(value === 1);
                break;
            case RoomObjectModelKey.FIGURE_IS_MUTED:
                message = new ObjectAvatarMutedUpdateMessage(value === 1);
                break;
            case RoomObjectModelKey.FIGURE_CARRY_OBJECT:
                message = new ObjectAvatarCarryObjectUpdateMessage(value, parameter);
                break;
            case RoomObjectModelKey.FIGURE_USE_OBJECT:
                message = new ObjectAvatarUseObjectUpdateMessage(value);
                break;
            case RoomObjectModelKey.FIGURE_DANCE:
                message = new ObjectAvatarDanceUpdateMessage(value);
                break;
            case RoomObjectModelKey.FIGURE_GAINED_EXPERIENCE:
                message = new ObjectAvatarExperienceUpdateMessage(value);
                break;
            case RoomObjectModelKey.FIGURE_NUMBER_VALUE:
                message = new ObjectAvatarPlayerValueUpdateMessage(value);
                break;
            case RoomObjectModelKey.FIGURE_SIGN:
                message = new ObjectAvatarSignUpdateMessage(value);
                break;
            case RoomObjectModelKey.FIGURE_EXPRESSION:
                message = new ObjectAvatarExpressionUpdateMessage(value);
                break;
            case RoomObjectModelKey.FIGURE_IS_PLAYING_GAME:
                message = new ObjectAvatarPlayingGameUpdateMessage(value === 1);
                break;
            case RoomObjectModelKey.FIGURE_GUIDE_STATUS:
                message = new ObjectAvatarGuideStatusUpdateMessage(value);
                break;
        }

        if(!message) return;

        object.processUpdateMessage(message);
    }

    public updateRoomObjectUserFigure(roomId: number, objectId: number, figure: string, gender: string): void
    {
        const object = this.getRoomObjectUser(roomId, objectId);

        if(!object) return;

        object.processUpdateMessage(new ObjectAvatarFigureUpdateMessage(figure, gender));
    }

    public updateRoomObjectUserFlatControl(roomId: number, objectId: number, level: string): void
    {
        const object = this.getRoomObjectUser(roomId, objectId);

        if(!object) return;

        object.processUpdateMessage(new ObjectAvatarFlatControlUpdateMessage(parseInt(level)));
    }

    public updateRoomObjectUserEffect(roomId: number, objectId: number, effectId: number, delay: number = 0): void
    {
        const object = this.getRoomObjectUser(roomId, objectId);

        if(!object) return;

        object.processUpdateMessage(new ObjectAvatarEffectUpdateMessage(effectId, delay));
    }

    public updateRoomObjectUserGesture(roomId: number, objectId: number, gestureId: number): void
    {
        const object = this.getRoomObjectUser(roomId, objectId);

        if(!object) return;

        object.processUpdateMessage(new ObjectAvatarGestureUpdateMessage(gestureId));
    }

    public updateRoomObjectUserPosture(roomId: number, objectId: number, type: string, parameter: string = null): void
    {
        const object = this.getRoomObjectUser(roomId, objectId);

        if(!object) return;

        object.processUpdateMessage(new ObjectAvatarPostureUpdateMessage(type, parameter));
    }

    public updateRoomObjectUserOwn(roomId: number, objectId: number): void
    {
        const object = this.getRoomObjectUser(roomId, objectId);

        if(!object) return;

        object.processUpdateMessage(new ObjectAvatarOwnMessage());
    }

    public refreshRoomObjectWallData(roomId: number, objectId: number): void
    {

    }

    public refreshRoomObjectFurnitureData(roomId: number, objectId: number, category: number): void
    {
        if(category === RoomObjectCategory.WALL)
        {
            this.refreshRoomObjectWallData(roomId, objectId);
        }

        const object = this.getRoomObject(roomId, objectId, category);

        if(object)
        {
            const dataFormat = object.model.getValue(RoomObjectModelKey.FURNITURE_DATA_FORMAT);

            if(!isNaN(dataFormat))
            {
                const data = ObjectDataFactory.getData(dataFormat);

                data.initializeFromRoomObjectModel(object.model);

                object.processUpdateMessage(new ObjectDataUpdateMessage(object.state, data));
            }
        }
    }

    public get events(): IEventDispatcher
    {
        return this._events;
    }

    public get connection(): IConnection
    {
        return this._communication.connection;
    }

    public get objectEventHandler(): RoomObjectEventHandler
    {
        return this._roomObjectEventHandler;
    }

    public get roomRendererFactory(): IRoomRendererFactory
    {
        return this._roomRendererFactory;
    }

    public get visualizationFactory(): IRoomObjectVisualizationFactory
    {
        return this._visualizationFactory;
    }

    public get logicFactory(): IRoomObjectLogicFactory
    {
        return this._logicFactory;
    }

    public get activeRoomId(): number
    {
        return this._activeRoomId;
    }

    public get isReady(): boolean
    {
        return this._isReady;
    }

    public get isDisposed(): boolean
    {
        return this._isDisposed;
    }
}