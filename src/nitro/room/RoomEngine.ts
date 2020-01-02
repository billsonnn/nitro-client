import { NitroManager } from '../../core/common/NitroManager';
import { IConnection } from '../../core/communication/connections/IConnection';
import { NitroConfiguration } from '../../NitroConfiguration';
import { IRoomInstance } from '../../room/IRoomInstance';
import { IRoomObject } from '../../room/object/IRoomObject';
import { IRoomObjectController } from '../../room/object/IRoomObjectController';
import { IRoomObjectLogicFactory } from '../../room/object/logic/IRoomObjectLogicFactory';
import { IRoomObjectVisualizationFactory } from '../../room/object/visualization/IRoomObjectVisualizationFactory';
import { IRoomRendererFactory } from '../../room/renderer/IRoomRendererFactory';
import { RoomRendererFactory } from '../../room/renderer/RoomRendererFactory';
import { Position } from '../../room/utils/Position';
import { INitroCommunicationManager } from '../communication/INitroCommunicationManager';
import { RoomModelParser } from '../communication/messages/parser/room/mapping/RoomModelParser';
import { NitroInstance } from '../NitroInstance';
import { RoomSessionEvent } from '../session/events/RoomSessionEvent';
import { IRoomSessionManager } from '../session/IRoomSessionManager';
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
import { ObjectAvatarGuideStatusUpdateMessage } from './messages/ObjectAvatarGuideStatusUpdateMessage';
import { ObjectAvatarMutedUpdateMessage } from './messages/ObjectAvatarMutedUpdateMessage';
import { ObjectAvatarPlayerValueUpdateMessage } from './messages/ObjectAvatarPlayerValueUpdateMessage';
import { ObjectAvatarPlayingGameUpdateMessage } from './messages/ObjectAvatarPlayingGameUpdateMessage';
import { ObjectAvatarPostureUpdateMessage } from './messages/ObjectAvatarPostureUpdateMessage';
import { ObjectAvatarSignUpdateMessage } from './messages/ObjectAvatarSignUpdateMessage';
import { ObjectAvatarSleepUpdateMessage } from './messages/ObjectAvatarSleepUpdateMessage';
import { ObjectAvatarTypingUpdateMessage } from './messages/ObjectAvatarTypingUpdateMessage';
import { ObjectAvatarUpdateMessage } from './messages/ObjectAvatarUpdateMessage';
import { ObjectAvatarUseObjectUpdateMessage } from './messages/ObjectAvatarUseObjectUpdateMessage';
import { ObjectDataUpdateMessage } from './messages/ObjectDataUpdateMessage';
import { ObjectMoveUpdateMessage } from './messages/ObjectMoveUpdateMessage';
import { ObjectTileCursorUpdateMessage } from './messages/ObjectTileCursorUpdateMessage';
import { ObjectUpdateStateMessage } from './messages/ObjectUpdateStateMessage';
import { IObjectData } from './object/data/IObjectData';
import { ObjectDataFactory } from './object/data/ObjectDataFactory';
import { ObjectLogicFactory } from './object/logic/ObjectLogicFactory';
import { RoomObjectCategory } from './object/RoomObjectCategory';
import { RoomObjectModelKey } from './object/RoomObjectModelKey';
import { RoomObjectType } from './object/RoomObjectType';
import { ObjectVisualizationFactory } from './object/visualization/ObjectVisualizationFactory';
import { RoomMessageHandler } from './RoomMessageHandler';
import { RoomObjectEventHandler } from './RoomObjectEventHandler';
import { RoomInstanceData } from './utils/RoomInstanceData';
import { SelectedRoomObjectData } from './utils/SelectedRoomObjectData';

export class RoomEngine extends NitroManager implements IRoomEngine, IRoomCreator, IRoomEngineServices
{
    public static ROOM_OBJECT_ID: number       = -1;
    public static ROOM_OBJECT_TYPE: string     = 'room';

    public static CURSOR_OBJECT_ID: number     = -2;
    public static CURSOR_OBJECT_TYPE: string   = 'tile_cursor';

    private _communication: INitroCommunicationManager;
    private _roomSession: IRoomSessionManager;
    private _roomObjectEventHandler: RoomObjectEventHandler;
    private _roomMessageHandler: RoomMessageHandler;

    private _activeRoomId: number;
    private _roomInstanceData: Map<number, RoomInstanceData>;

    private _roomRendererFactory: IRoomRendererFactory;
    private _visualizationFactory: IRoomObjectVisualizationFactory;
    private _logicFactory: IRoomObjectLogicFactory;

    private _pendingObjects: IRoomObject[];
    private _processingObjects: boolean;

    constructor(communication: INitroCommunicationManager, roomSession: IRoomSessionManager)
    {
        super();

        this._communication             = communication;
        this._roomSession               = roomSession;
        this._roomObjectEventHandler    = new RoomObjectEventHandler(this);
        this._roomMessageHandler        = new RoomMessageHandler(this);

        this._activeRoomId              = -1;
        this._roomInstanceData          = new Map();

        this._roomRendererFactory       = new RoomRendererFactory();
        this._visualizationFactory      = new ObjectVisualizationFactory();
        this._logicFactory              = new ObjectLogicFactory();

        this._pendingObjects            = [];
        this._processingObjects         = false;
    }

    protected onInit(): void
    {
        this._roomMessageHandler.setConnection(this._communication.connection);

        this._roomSession.events.addEventListener(RoomSessionEvent.STARTED, this.onRoomSessionEvent.bind(this));
        this._roomSession.events.addEventListener(RoomSessionEvent.ENDED, this.onRoomSessionEvent.bind(this));
    }

    protected onDispose(): void
    {
        if(this._roomObjectEventHandler) this._roomObjectEventHandler.dispose();

        if(this._roomMessageHandler) this._roomMessageHandler.dispose();
        
        this._roomSession.events.removeEventListener(RoomSessionEvent.STARTED, this.onRoomSessionEvent.bind(this));
        this._roomSession.events.removeEventListener(RoomSessionEvent.ENDED, this.onRoomSessionEvent.bind(this));
        
        super.onDispose();
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
        if(!this._roomSession || !this._roomSession.roomManager) return;

        return this._roomSession.roomManager.getRoomInstance(roomId);
    }

    public removeRoomInstance(roomId: number): void
    {
        const instance = this.getRoomInstance(roomId);

        if(instance)
        {
            if(instance.renderer) NitroInstance.instance.renderer.camera.removeChild(instance.renderer);

            this._roomSession.roomManager.removeRoomInstance(roomId);
        }

        const existing = this._roomInstanceData.get(roomId);

        if(!existing) return;

        this._roomInstanceData.delete(existing.roomId);

        existing.dispose();

        this.events.dispatchEvent(new RoomEngineEvent(RoomEngineEvent.DISPOSED, roomId));
    }

    public createRoomInstance(roomId: number): IRoomInstance
    {
        if(!this.isLoaded)
        {
            console.log('Room Engine not initilized yet, can not create room. Room data stored for later initialization.');

            return;
        }

        const instance = this.setupRoomInstance(roomId);

        if(!instance) return;

        this.events.dispatchEvent(new RoomEngineEvent(RoomEngineEvent.INITIALIZED, roomId));

        return instance;
    }

    private setupRoomInstance(roomId: number): IRoomInstance
    {
        if(!this.isLoaded) return;

        const instance = this._roomSession.roomManager.createRoomInstance(roomId);

        if(!instance) return null;

        const renderer = this._roomRendererFactory.createRenderer(this._roomObjectEventHandler, instance);

        if(!renderer) return;

        instance.setRenderer(renderer);

        this._pendingObjects = [];

        if(instance.renderer) NitroInstance.instance.renderer.camera.addChild(instance.renderer);

        return instance;
    }

    public initializeRoomInstance(roomId: number, model: RoomModelParser): void
    {
        const instance = this.getRoomInstance(roomId);

        if(!instance) return;

        if(model)
        {
            const object = instance.createObject(RoomEngine.ROOM_OBJECT_ID, RoomEngine.ROOM_OBJECT_TYPE, RoomObjectCategory.ROOM);

            this._roomSession.roomManager.initalizeObject(object, model);
        }

        if(NitroConfiguration.WALKING_ENABLED)
        {
            const tileCursor = instance.createObject(RoomEngine.CURSOR_OBJECT_ID, RoomEngine.CURSOR_OBJECT_TYPE, RoomObjectCategory.ROOM);

            if(tileCursor)
            {
                tileCursor.processUpdateMessage(new ObjectTileCursorUpdateMessage(null));

                this.roomObjectReady(tileCursor);
            }
        }

        let x = ~~(window.innerWidth - (model.width * NitroConfiguration.TILE_REAL_WIDTH));
        let y = ~~(window.innerHeight - ((model.height * NitroConfiguration.TILE_REAL_HEIGHT)));

        if(x < 0) x = 0;
        if(y < 0) y = 0;

        instance.renderer.position.x = x;
        instance.renderer.position.y = y;

        NitroInstance.instance.renderer.resizeRenderer();
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

    private createRoomObject(roomId: number, objectId: number, type: string, category: number): IRoomObjectController
    {
        const instance = this.getRoomInstance(roomId);

        if(!instance) return null;

        return instance.createObject(objectId, type, category);
    }

    public addRoomObjects(...objects: IRoomObject[]): void
    {
        this._pendingObjects.push(...objects);

        this.processObjects();
    }

    private roomObjectReady(object: IRoomObjectController): void
    {
        if(!object) return;

        if(RoomObjectType.AVATAR_TYPES.indexOf(object.type) >= 0)
        {
            object = this._roomSession.roomManager.initalizeObject(object, NitroInstance.instance.avatar);

            if(!object) return;
        }
        else
        {
            object = this._roomSession.roomManager.initalizeObject(object);

            if(!object) return;

            this.refreshObjectData(object);
        }

        if(this._roomObjectEventHandler) object.logic.setEventHandler(this._roomObjectEventHandler);

        object.visualization.start();
    }

    public getTileCursorObject(roomId: number): IRoomObjectController
    {
        return this.getRoomObject(roomId, RoomEngine.CURSOR_OBJECT_ID, RoomObjectCategory.ROOM);
    }

    public getRoomUnitObject(roomId: number, objectId: number): IRoomObjectController
    {
        return this.getRoomObject(roomId, objectId, RoomObjectCategory.UNIT);
    }

    public removeRoomUnitObject(roomId: number, objectId: number): void
    {
        return this.removeRoomObject(roomId, objectId, RoomObjectCategory.UNIT);
    }

    public getRoomFurnitureObject(roomId: number, objectId: number): IRoomObjectController
    {
        return this.getRoomObject(roomId, objectId, RoomObjectCategory.FURNITURE);
    }

    public removeRoomFurnitureObject(roomId: number, objectId: number): void
    {
        return this.removeRoomObject(roomId, objectId, RoomObjectCategory.FURNITURE);
    }

    private getRoomObject(roomId: number, objectId: number, category: number): IRoomObjectController
    {
        const instance = this.getRoomInstance(roomId);

        if(!instance) return null;

        return instance.getObject(objectId, category);
    }

    private removeRoomObject(roomId: number, objectId: number, category: number): void
    {
        const instance = this.getRoomInstance(roomId);

        if(!instance) return null;

        instance.removeObject(objectId, category);
    }

    public updateRoomFurnitureObject(roomId: number, objectId: number, fromPosition: Position, toPosition: Position, state: number, data: IObjectData = null): void
    {
        const object = this.getRoomFurnitureObject(roomId, objectId);

        if(!object) return;

        fromPosition    = fromPosition ? fromPosition : object.position;
        toPosition      = toPosition ? toPosition : object.position;
        
        object.processUpdateMessage(new ObjectMoveUpdateMessage(fromPosition, toPosition));
        object.processUpdateMessage(new ObjectDataUpdateMessage(state, data));
    }

    public rollRoomFurnitureObject(roomId: number, objectId: number, fromPosition: Position, toPosition: Position): void
    {
        const object = this.getRoomFurnitureObject(roomId, objectId);

        if(!object) return;

        fromPosition    = fromPosition ? fromPosition : object.position;
        toPosition      = toPosition ? toPosition : object.position;

        fromPosition.direction  = object.position.direction;
        toPosition.direction    = object.position.direction;
        
        object.processUpdateMessage(new ObjectMoveUpdateMessage(fromPosition, toPosition, true));
    }

    public addRoomUnit(roomId: number, objectId: number, position: Position, type: string, figure: string): boolean
    {
        const existing = this.getRoomUnitObject(roomId, objectId);

        if(existing) return false;

        const object = this.createRoomObject(roomId, objectId, type, RoomObjectCategory.UNIT);

        if(!object) return false;

        object.setPosition(position);

        object.model.setValue(RoomObjectModelKey.FIGURE, figure);
        object.model.setValue(RoomObjectModelKey.GENDER, 'M');

        object.processUpdateMessage(new ObjectAvatarFigureUpdateMessage(figure));

        this.roomObjectReady(object);
    }

    public updateRoomUnitLocation(roomId: number, objectId: number, fromPosition: Position, toPosition: Position, isSlide: boolean = false, headDirection: number = null): void
    {
        const object = this.getRoomUnitObject(roomId, objectId);

        if(!object) return;

        fromPosition    = fromPosition ? fromPosition : object.position;
        toPosition      = toPosition ? toPosition : object.position;

        object.processUpdateMessage(new ObjectAvatarUpdateMessage(fromPosition, toPosition, isSlide, headDirection));
    }

    public updateRoomUnitAction(roomId: number, objectId: number, action: string, value: number, parameter: string = null): void
    {
        const object = this.getRoomUnitObject(roomId, objectId);

        if(!object) return;

        let message: ObjectUpdateStateMessage = null;
        
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

    public updateRoomUnitFlatControl(roomId: number, objectId: number, level: string): void
    {
        const object = this.getRoomUnitObject(roomId, objectId);

        if(!object) return;

        object.processUpdateMessage(new ObjectAvatarFlatControlUpdateMessage(parseInt(level)));
    }

    public updateRoomUnitEffect(roomId: number, objectId: number, effectId: number, delay: number = 0): void
    {
        const object = this.getRoomUnitObject(roomId, objectId);

        if(!object) return;

        object.processUpdateMessage(new ObjectAvatarEffectUpdateMessage(effectId, delay));
    }

    public updateRoomUnitPosture(roomId: number, objectId: number, type: string, parameter: string = null): void
    {
        const object = this.getRoomUnitObject(roomId, objectId);

        if(!object) return;

        object.processUpdateMessage(new ObjectAvatarPostureUpdateMessage(type, parameter));
    }

    private refreshObjectData(object: IRoomObjectController)
    {
        if(!object || !object.model || !object.logic) return;

        const dataFormat = object.model.getValue(RoomObjectModelKey.FURNITURE_DATA_FORMAT);

        if(dataFormat === undefined) return;

        const objectData = ObjectDataFactory.getData(parseInt(dataFormat));

        if(!objectData) return;

        objectData.initializeFromRoomObjectModel(object.model);

        object.processUpdateMessage(new ObjectDataUpdateMessage(object.state, objectData));
    }

    private processObjects(fromSelf: boolean = false): void
    {
        if(this._processingObjects && !fromSelf) return;

        if(!this._pendingObjects.length)
        {
            this._processingObjects = false;

            return;
        }

        this._processingObjects = true;

        const downloadUrls: string[]                    = [];
        const downloadObjects: IRoomObjectController[]  = [];

        while(this._pendingObjects.length)
        {
            const object = this._pendingObjects.shift() as IRoomObjectController

            if(!object) continue;

            const asset = NitroInstance.instance.core.asset.getAsset(object.type);

            if(!asset)
            {
                const url = NitroConfiguration.ASSET_URL + `/furniture/${ object.type }/${ object.type }.json`;

                if(downloadUrls.indexOf(url) === -1) downloadUrls.push(url);

                downloadObjects.push(object);

                continue;
            }
            
            this.roomObjectReady(object);
        }

        if(!downloadUrls.length && !downloadObjects.length) return this.processObjects(true);

        this.downloadObjects(downloadUrls, downloadObjects);
    }

    private downloadObjects(urls: string[], objects: IRoomObjectController[]): void
    {
        NitroInstance.instance.core.asset.downloadAssets(urls, () =>
        {
            for(let object of objects)
            {
                if(!object) continue;

                this.roomObjectReady(object);
            }

            this.processObjects(true);
        });
    }

    public get connection(): IConnection
    {
        return this._communication.connection;
    }

    public get roomSession(): IRoomSessionManager
    {
        return this._roomSession;
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
}