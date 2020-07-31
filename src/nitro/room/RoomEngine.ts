import { IDisposable } from '../../core/common/disposable/IDisposable';
import { IUpdateReceiver } from '../../core/common/IUpdateReceiver';
import { NitroLogger } from '../../core/common/logger/NitroLogger';
import { NitroManager } from '../../core/common/NitroManager';
import { IConnection } from '../../core/communication/connections/IConnection';
import { RoomObjectEvent } from '../../room/events/RoomObjectEvent';
import { RoomObjectMouseEvent } from '../../room/events/RoomObjectMouseEvent';
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
import { IRoomRenderingCanvas } from '../../room/renderer/IRoomRenderingCanvas';
import { RoomRendererFactory } from '../../room/renderer/RoomRendererFactory';
import { RoomInstance } from '../../room/RoomInstance';
import { IRoomGeometry } from '../../room/utils/IRoomGeometry';
import { IVector3D } from '../../room/utils/IVector3D';
import { NumberBank } from '../../room/utils/NumberBank';
import { RoomEnterEffect } from '../../room/utils/RoomEnterEffect';
import { RoomGeometry } from '../../room/utils/RoomGeometry';
import { Vector3d } from '../../room/utils/Vector3d';
import { PetCustomPart } from '../avatar/pets/PetCustomPart';
import { PetFigureData } from '../avatar/pets/PetFigureData';
import { INitroCommunicationManager } from '../communication/INitroCommunicationManager';
import { Nitro } from '../Nitro';
import { RoomControllerLevel } from '../session/enum/RoomControllerLevel';
import { BadgeImageReadyEvent } from '../session/events/BadgeImageReadyEvent';
import { RoomSessionEvent } from '../session/events/RoomSessionEvent';
import { IRoomSessionManager } from '../session/IRoomSessionManager';
import { ISessionDataManager } from '../session/ISessionDataManager';
import { MouseEventType } from '../ui/MouseEventType';
import { RoomEngineEvent } from './events/RoomEngineEvent';
import { RoomEngineObjectEvent } from './events/RoomEngineObjectEvent';
import { RoomObjectFurnitureActionEvent } from './events/RoomObjectFurnitureActionEvent';
import { IGetImageListener } from './IGetImageListener';
import { ImageResult } from './ImageResult';
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
import { ObjectAvatarPetGestureUpdateMessage } from './messages/ObjectAvatarPetGestureUpdateMessage';
import { ObjectAvatarPlayerValueUpdateMessage } from './messages/ObjectAvatarPlayerValueUpdateMessage';
import { ObjectAvatarPlayingGameUpdateMessage } from './messages/ObjectAvatarPlayingGameUpdateMessage';
import { ObjectAvatarPostureUpdateMessage } from './messages/ObjectAvatarPostureUpdateMessage';
import { ObjectAvatarSignUpdateMessage } from './messages/ObjectAvatarSignUpdateMessage';
import { ObjectAvatarSleepUpdateMessage } from './messages/ObjectAvatarSleepUpdateMessage';
import { ObjectAvatarTypingUpdateMessage } from './messages/ObjectAvatarTypingUpdateMessage';
import { ObjectAvatarUpdateMessage } from './messages/ObjectAvatarUpdateMessage';
import { ObjectAvatarUseObjectUpdateMessage } from './messages/ObjectAvatarUseObjectUpdateMessage';
import { ObjectDataUpdateMessage } from './messages/ObjectDataUpdateMessage';
import { ObjectGroupBadgeUpdateMessage } from './messages/ObjectGroupBadgeUpdateMessage';
import { ObjectHeightUpdateMessage } from './messages/ObjectHeightUpdateMessage';
import { ObjectItemDataUpdateMessage } from './messages/ObjectItemDataUpdateMessage';
import { ObjectMoveUpdateMessage } from './messages/ObjectMoveUpdateMessage';
import { ObjectRoomFloorHoleUpdateMessage } from './messages/ObjectRoomFloorHoleUpdateMessage';
import { ObjectRoomMaskUpdateMessage } from './messages/ObjectRoomMaskUpdateMessage';
import { ObjectRoomPlanePropertyUpdateMessage } from './messages/ObjectRoomPlanePropertyUpdateMessage';
import { ObjectRoomPlaneVisibilityUpdateMessage } from './messages/ObjectRoomPlaneVisibilityUpdateMessage';
import { ObjectRoomUpdateMessage } from './messages/ObjectRoomUpdateMessage';
import { ObjectStateUpdateMessage } from './messages/ObjectStateUpdateMessage';
import { IObjectData } from './object/data/IObjectData';
import { ObjectDataFactory } from './object/data/ObjectDataFactory';
import { LegacyDataType } from './object/data/type/LegacyDataType';
import { RoomLogic } from './object/logic/room/RoomLogic';
import { RoomMapData } from './object/RoomMapData';
import { RoomObjectCategory } from './object/RoomObjectCategory';
import { RoomObjectUserType } from './object/RoomObjectUserType';
import { RoomObjectVariable } from './object/RoomObjectVariable';
import { RoomObjectVisualizationFactory } from './object/RoomObjectVisualizationFactory';
import { RoomContentLoader } from './RoomContentLoader';
import { RoomMessageHandler } from './RoomMessageHandler';
import { RoomObjectEventHandler } from './RoomObjectEventHandler';
import { RoomObjectLogicFactory } from './RoomObjectLogicFactory';
import { RoomVariableEnum } from './RoomVariableEnum';
import { FurnitureData } from './utils/FurnitureData';
import { FurnitureStackingHeightMap } from './utils/FurnitureStackingHeightMap';
import { LegacyWallGeometry } from './utils/LegacyWallGeometry';
import { RoomCamera } from './utils/RoomCamera';
import { RoomData } from './utils/RoomData';
import { RoomInstanceData } from './utils/RoomInstanceData';
import { RoomObjectBadgeImageAssetListener } from './utils/RoomObjectBadgeImageAssetListener';
import { SelectedRoomObjectData } from './utils/SelectedRoomObjectData';

export class RoomEngine extends NitroManager implements IRoomEngine, IRoomCreator, IRoomEngineServices, IRoomManagerListener, IUpdateReceiver, IDisposable
{
    public static ROOM_OBJECT_ID: number        = -1;
    public static ROOM_OBJECT_TYPE: string      = 'room';

    public static CURSOR_OBJECT_ID: number      = -2;
    public static CURSOR_OBJECT_TYPE: string    = 'tile_cursor';

    public static ARROW_OBJECT_ID: number       = -3;
    public static ARROW_OBJECT_TYPE: string     = 'selection_arrow';

    public static OVERLAY: string               = 'overlay';
    public static OBJECT_ICON_SPRITE: string    = 'object_icon_sprite';

    private static DRAG_THRESHOLD: number       = 15;
    private static TEMPORARY_ROOM: string       = 'temporary_room';

    private _communication: INitroCommunicationManager;
    private _sessionDataManager: ISessionDataManager;
    private _roomSessionManager: IRoomSessionManager;
    private _roomManager: IRoomManager;
    private _roomObjectEventHandler: RoomObjectEventHandler;
    private _roomMessageHandler: RoomMessageHandler;
    private _roomContentLoader: RoomContentLoader;
    private _ready: boolean;

    private _activeRoomId: number;
    private _lastCanvasId: number;
    private _roomInstanceData: Map<number, RoomInstanceData>;
    private _pendingRoomData: Map<number, RoomData>;

    private _roomRendererFactory: IRoomRendererFactory;
    private _visualizationFactory: IRoomObjectVisualizationFactory;
    private _logicFactory: IRoomObjectLogicFactory;

    private _mouseX: number;
    private _mouseY: number;
    private _Str_7695: boolean;
    private _Str_6482: boolean;
    private _Str_21787: number;
    private _Str_19133: number;
    private _Str_13608: number;
    private _Str_14213: number;
    private _Str_3688: boolean;
    private _Str_8325: boolean;
    private _Str_13525: boolean;
    private _numberBank: NumberBank;
    private _imageListeners: Map<string, IGetImageListener>;
    private _cameraCentered: boolean;
    private _badgeListeners: Map<string, RoomObjectBadgeImageAssetListener[]>;

    constructor(communication: INitroCommunicationManager)
    {
        super();

        this._communication             = communication;
        this._sessionDataManager        = null;
        this._roomSessionManager        = null;
        this._roomManager               = null;
        this._roomObjectEventHandler    = new RoomObjectEventHandler(this);
        this._roomMessageHandler        = new RoomMessageHandler(this);
        this._roomContentLoader         = new RoomContentLoader();
        this._ready                     = false;

        this._activeRoomId              = -1;
        this._lastCanvasId              = -1;
        this._roomInstanceData          = new Map();
        this._pendingRoomData           = new Map();

        this._roomRendererFactory       = new RoomRendererFactory();
        this._visualizationFactory      = new RoomObjectVisualizationFactory();
        this._logicFactory              = new RoomObjectLogicFactory();

        this._mouseX                    = 0;
        this._mouseY                    = 0;
        this._Str_7695                  = false;
        this._Str_6482                  = false;
        this._Str_21787                 = 0;
        this._Str_19133                 = 0;
        this._Str_13608                 = 0;
        this._Str_14213                 = 0;
        this._Str_3688                  = false;
        this._Str_8325                  = false;
        this._Str_13525                 = false;
        this._numberBank                = null;
        this._imageListeners            = new Map();
        this._cameraCentered            = false;
        this._badgeListeners            = new Map();
    }

    public onInit(): void
    {
        if(this._ready) return;

        this._numberBank = new NumberBank(1000);

        this._logicFactory.registerEventFunction(this.processRoomObjectEvent.bind(this));

        if(this._roomManager)
        {
            this._roomManager.setContentLoader(this._roomContentLoader);
            this._roomManager.addUpdateCategory(RoomObjectCategory.FLOOR);
            this._roomManager.addUpdateCategory(RoomObjectCategory.WALL);
            this._roomManager.addUpdateCategory(RoomObjectCategory.UNIT);
            this._roomManager.addUpdateCategory(RoomObjectCategory.CURSOR);
            this._roomManager.addUpdateCategory(RoomObjectCategory.ROOM);
        }

        this._roomMessageHandler.setConnection(this._communication.connection);

        this._roomContentLoader.initialize(this.events);
        this._roomContentLoader.setSessionDataManager(this._sessionDataManager);

        if(this._roomSessionManager)
        {
            this._roomSessionManager.events.addEventListener(RoomSessionEvent.STARTED, this.onRoomSessionEvent.bind(this));
            this._roomSessionManager.events.addEventListener(RoomSessionEvent.ENDED, this.onRoomSessionEvent.bind(this));
        }

        Nitro.instance.ticker.add(this.update, this);
    }

    public onDispose(): void
    {
        if(!this._ready) return;

        Nitro.instance.ticker.remove(this.update, this);

        if(this._roomObjectEventHandler) this._roomObjectEventHandler.dispose();

        if(this._roomMessageHandler) this._roomMessageHandler.dispose();
        
        if(this._roomSessionManager)
        {
            this._roomSessionManager.events.removeEventListener(RoomSessionEvent.STARTED, this.onRoomSessionEvent.bind(this));
            this._roomSessionManager.events.removeEventListener(RoomSessionEvent.ENDED, this.onRoomSessionEvent.bind(this));
        }
    }

    private onRoomSessionEvent(event: RoomSessionEvent): void
    {
        if(!(event instanceof RoomSessionEvent)) return;

        switch(event.type)
        {
            case RoomSessionEvent.STARTED:
                if(this._roomMessageHandler) this._roomMessageHandler.setRoomId(event.session.roomId);
                return;
            case RoomSessionEvent.ENDED:
                if(this._roomMessageHandler)
                {
                    this._roomMessageHandler.clearRoomId();
                    this.removeRoomInstance(event.session.roomId);
                }
                return;
        }
    }

    public setActiveRoomId(roomId: number): void
    {
        this._activeRoomId = roomId;
    }

    public destroyRoom(roomId: number): void
    {
        this.removeRoomInstance(roomId);
    }

    public getRoomInstance(roomId: number): IRoomInstance
    {
        return (this._roomManager && this._roomManager.getRoomInstance(this.getRoomId(roomId))) || null;
    }

    public removeRoomInstance(roomId: number): void
    {
        const instance = this.getRoomInstance(roomId);

        if(instance)
        {
            this._roomManager && this._roomManager.removeRoomInstance(this.getRoomId(roomId));
        }

        const existing = this._roomInstanceData.get(roomId);

        if(existing)
        {
            this._roomInstanceData.delete(existing.roomId);

            existing.dispose();
        }

        this.events.dispatchEvent(new RoomEngineEvent(RoomEngineEvent.DISPOSED, roomId));
    }

    public createRoomInstance(roomId: number, roomMap: RoomMapData): IRoomInstance
    {
        let floorType       = '111';
        let wallType        = '201';
        let landscapeType   = '1';

        if(!this._ready)
        {
            let data = this._pendingRoomData.get(roomId);

            if(data)
            {
                this._pendingRoomData.delete(roomId);

                floorType       = data.floorType;
                wallType        = data.wallType;
                landscapeType   = data.landscapeType;
            }

            data = new RoomData(roomId, roomMap);

            data.floorType  = floorType;
            data.wallType  = wallType;
            data.landscapeType  = landscapeType;

            this._pendingRoomData.set(roomId, data);

            NitroLogger.log(`Room Engine not initilized yet, can not create room. Room data stored for later initialization.`);

            return;
        }

        if(!roomMap)
        {
            NitroLogger.log(`Room property messages received before floor height map, will initialize when floor height map received.`);

            return;
        }

        const data = this._pendingRoomData.get(roomId);

        if(data)
        {
            this._pendingRoomData.delete(roomId);

            if(data.floorType) floorType = data.floorType;

            if(data.wallType) wallType = data.wallType;

            if(data.landscapeType) landscapeType = data.landscapeType;
        }

        const instance = this.setupRoomInstance(roomId, roomMap, floorType, wallType, landscapeType, this.getRoomInstanceModelName(roomId));

        if(!instance) return;

        this.events.dispatchEvent(new RoomEngineEvent(RoomEngineEvent.INITIALIZED, roomId));

        return instance;
    }

    private setupRoomInstance(roomId: number, roomMap: RoomMapData, floorType: string, wallType: string, landscapeType: string, worldType: string): IRoomInstance
    {
        if(!this._ready || !this._roomManager) return;

        const instance = this._roomManager.createRoomInstance(this.getRoomId(roomId));

        if(!instance) return null;

        const category  = RoomObjectCategory.ROOM;

        const roomObject = instance.createRoomObjectAndInitalize(RoomEngine.ROOM_OBJECT_ID, RoomEngine.ROOM_OBJECT_TYPE, category) as IRoomObjectController;

        instance.model.setValue(RoomVariableEnum.ROOM_IS_PUBLIC, 0);
        instance.model.setValue(RoomVariableEnum.ROOM_Z_SCALE, 1);

        if(roomMap)
        {
            const dimensions = roomMap.dimensions;

            if(dimensions)
            {
                const minX  = roomMap.dimensions.minX;
                const maxX  = roomMap.dimensions.maxX;
                const minY  = roomMap.dimensions.minY;
                const maxY  = roomMap.dimensions.maxY;

                instance.model.setValue(RoomVariableEnum.ROOM_MIN_X, minX);
                instance.model.setValue(RoomVariableEnum.ROOM_MAX_X, maxX);
                instance.model.setValue(RoomVariableEnum.ROOM_MIN_Y, minY);
                instance.model.setValue(RoomVariableEnum.ROOM_MAX_Y, maxY);

                const seed = ((((minX * 423) + (maxX * 671)) + (minY * 913)) + (maxY * 7509));

                if(roomObject && roomObject.model) roomObject.model.setValue(RoomObjectVariable.ROOM_RANDOM_SEED, seed);
            }
        }

        const logic = (roomObject && roomObject.logic as RoomLogic) || null;

        if(logic)
        {
            logic.initialize(roomMap);

            if(floorType)
            {
                logic.processUpdateMessage(new ObjectRoomUpdateMessage(ObjectRoomUpdateMessage.ROOM_FLOOR_UPDATE, floorType));
                instance.model.setValue(RoomObjectVariable.ROOM_FLOOR_TYPE, floorType);
            }

            if(wallType)
            {
                logic.processUpdateMessage(new ObjectRoomUpdateMessage(ObjectRoomUpdateMessage.ROOM_WALL_UPDATE, wallType));
                instance.model.setValue(RoomObjectVariable.ROOM_WALL_TYPE, wallType);
            }

            if(landscapeType)
            {
                logic.processUpdateMessage(new ObjectRoomUpdateMessage(ObjectRoomUpdateMessage.ROOM_LANDSCAPE_UPDATE, landscapeType));
                instance.model.setValue(RoomObjectVariable.ROOM_LANDSCAPE_TYPE, landscapeType);
            }
        }

        if(roomMap && roomMap.doors.length)
        {
            let doorIndex = 0;

            while(doorIndex < roomMap.doors.length)
            {
                const door = roomMap.doors[doorIndex];

                if(door)
                {
                    const doorX     = door.x;
                    const doorY     = door.y;
                    const doorZ     = door.z;
                    const doorDir   = door.dir;
                    const maskType  = ObjectRoomMaskUpdateMessage.DOOR;
                    const maskId    = 'door_' + doorIndex;
                    const maskLocation  = new Vector3d(doorX, doorY, doorZ);

                    logic.processUpdateMessage(new ObjectRoomMaskUpdateMessage(ObjectRoomMaskUpdateMessage.ADD_MASK, maskId, maskType, maskLocation, ObjectRoomMaskUpdateMessage.HOLE));

                    if((doorDir === 90) || (doorDir === 180))
                    {
                        if(doorDir === 90)
                        {
                            instance.model.setValue(RoomObjectVariable.ROOM_DOOR_X, (doorX - 0.5));
                            instance.model.setValue(RoomObjectVariable.ROOM_DOOR_Y, doorY);
                        }

                        if(doorDir === 180)
                        {
                            instance.model.setValue(RoomObjectVariable.ROOM_DOOR_X, doorX);
                            instance.model.setValue(RoomObjectVariable.ROOM_DOOR_Y, (doorY - 0.5));
                        }

                        instance.model.setValue(RoomObjectVariable.ROOM_DOOR_Z, doorZ);
                        instance.model.setValue(RoomObjectVariable.ROOM_DOOR_DIR, doorDir);
                    }
                }

                doorIndex++;
            }
        }

        instance.createRoomObjectAndInitalize(RoomEngine.CURSOR_OBJECT_ID, RoomEngine.CURSOR_OBJECT_TYPE, RoomObjectCategory.CURSOR);
        //instance.createRoomObjectAndInitalize(RoomEngine.ARROW_OBJECT_ID, RoomEngine.ARROW_OBJECT_TYPE, RoomObjectCategory.CURSOR);

        return instance;
    }

    public getRoomInstanceDisplay(roomId: number, id: number, width: number, height: number, scale: number): PIXI.DisplayObject
    {
        const instance = this.getRoomInstance(roomId);

        if(!instance) return null;

        let renderer = instance.renderer as IRoomRenderer;

        if(!renderer)
        {
            renderer = this._roomRendererFactory.createRenderer();

            if(!renderer) return null;
        }

        renderer.roomObjectVariableAccurateZ = RoomObjectVariable.OBJECT_ACCURATE_Z_VALUE;

        instance.setRenderer(renderer);

        const canvas = renderer.createCanvas(id, width, height, scale);

        if(!canvas) return null;

        canvas.setMouseListener(this._roomObjectEventHandler);

        if(canvas.geometry)
        {
            canvas.geometry.z_scale = instance.model.getValue(RoomVariableEnum.ROOM_Z_SCALE);

            const doorX         = instance.model.getValue(RoomObjectVariable.ROOM_DOOR_X);
            const doorY         = instance.model.getValue(RoomObjectVariable.ROOM_DOOR_Y);
            const doorZ         = instance.model.getValue(RoomObjectVariable.ROOM_DOOR_Z);
            const doorDirection = instance.model.getValue(RoomObjectVariable.ROOM_DOOR_DIR);
            const vector        = new Vector3d(doorX, doorY, doorZ);
            
            let direction: IVector3D = null;

            if(doorDirection === 90) direction = new Vector3d(-2000, 0, 0);

            if(doorDirection === 180) direction = new Vector3d(0, -2000, 0);

            canvas.geometry.setDisplacement(vector, direction);

            const displayObject = canvas.displayObject as PIXI.Container;

            if(displayObject)
            {
                const overlay = PIXI.Sprite.from(PIXI.Texture.EMPTY)

                overlay.name        = RoomEngine.OVERLAY;
                overlay.interactive = false;

                displayObject.addChild(overlay);
            }
        }

        return canvas.displayObject;
    }

    public setRoomRenderingCanvasScale(roomId: number, canvasId: number, scale: number): void
    {
        const roomCanvas = this.getRoomInstanceRenderingCanvas(roomId, canvasId);

        if(roomCanvas)
        {
            roomCanvas.setScale(scale);

            this.events.dispatchEvent(new RoomEngineEvent(RoomEngineEvent.ROOM_ZOOMED, roomId));
        }
    }

    public getRoomInstanceRenderingCanvas(roomId: number, canvasId: number = -1): IRoomRenderingCanvas
    {
        const instance = this.getRoomInstance(roomId);

        if(!instance) return null;

        const renderer = instance.renderer as IRoomRenderer;

        if(!renderer) return null;

        if(canvasId === -1) canvasId = this._lastCanvasId;

        const canvas = renderer.getCanvas(canvasId);

        if(!canvas) return null;

        return canvas;
    }

    public getActiveRoomInstanceRenderingCanvas(): IRoomRenderingCanvas
    {
        return this.getRoomInstanceRenderingCanvas(this._activeRoomId, this._lastCanvasId);
    }

    public getRoomInstanceRenderingCanvasOffset(roomId: number, canvasId: number = -1): PIXI.Point
    {
        if(canvasId === -1) canvasId = this._lastCanvasId;

        const renderingCanvas = this.getRoomInstanceRenderingCanvas(roomId, canvasId);

        if(!renderingCanvas) return null;

        return new PIXI.Point(renderingCanvas.screenOffsetX, renderingCanvas.screenOffsetY);
    }

    public initializeRoomInstanceRenderingCanvas(roomId: number, canvasId: number, width: number, height: number): void
    {
        const canvas = this.getRoomInstanceRenderingCanvas(roomId, canvasId);

        if(!canvas) return;

        canvas.initialize(width, height);
    }

    public getRoomInstanceGeometry(roomId: number, canvasId: number = -1): IRoomGeometry
    {
        const instance = this.getRoomInstance(roomId);

        if(!instance) return null;

        const renderer = instance.renderer as IRoomRenderer;

        if(!renderer) return null;

        if(canvasId === -1) canvasId = this._lastCanvasId;

        const canvas = renderer.getCanvas(canvasId);

        if(!canvas) return null;

        return canvas.geometry;
    }

    public getRoomInstanceNumber(roomId: number, key: string): number
    {
        const instance = this.getRoomInstance(roomId);

        if(!instance) return null;

        return (instance.model && instance.model.getValue(key)) || NaN;
    }

    public updateRoomInstancePlaneVisibility(roomId: number, wallVisible: boolean, floorVisible: boolean = true): boolean
    {
        const object = this.getRoomOwnObject(roomId);

        if(!object) return false;

        object.processUpdateMessage(new ObjectRoomPlaneVisibilityUpdateMessage(ObjectRoomPlaneVisibilityUpdateMessage.WALL_VISIBILITY, wallVisible));
        object.processUpdateMessage(new ObjectRoomPlaneVisibilityUpdateMessage(ObjectRoomPlaneVisibilityUpdateMessage.FLOOR_VISIBILITY, floorVisible));

        return true;
    }

    public updateRoomInstancePlaneThickness(roomId: number, wallThickness: number, floorThickness: number): boolean
    {
        const object = this.getRoomOwnObject(roomId);

        if(!object) return false;

        object.processUpdateMessage(new ObjectRoomPlanePropertyUpdateMessage(ObjectRoomPlanePropertyUpdateMessage.WALL_THICKNESS, wallThickness));
        object.processUpdateMessage(new ObjectRoomPlanePropertyUpdateMessage(ObjectRoomPlanePropertyUpdateMessage.FLOOR_THICKNESS, floorThickness));

        return true;
    }

    public updateRoomInstancePlaneType(roomId: number, floorType: string = null, wallType: string = null, landscapeType: string = null, _arg_5: boolean = false): boolean
    {
        const roomObject    = this.getRoomOwnObject(roomId);
        const roomInstance  = this.getRoomInstance(roomId);

        if(!roomObject)
        {
            let roomData = this._pendingRoomData.get(roomId);

            if(!roomData)
            {
                roomData = new RoomData(roomId, null);

                this._pendingRoomData.set(roomId, roomData);
            }

            if(floorType) roomData.floorType = floorType;

            if(wallType) roomData.wallType = wallType;

            if(landscapeType) roomData.landscapeType = landscapeType;

            return true;
        }

        if(floorType)
        {
            if(roomInstance && !_arg_5) roomInstance.model.setValue(RoomObjectVariable.ROOM_FLOOR_TYPE, floorType);

            roomObject.processUpdateMessage(new ObjectRoomUpdateMessage(ObjectRoomUpdateMessage.ROOM_FLOOR_UPDATE, floorType));
        }

        if(wallType)
        {
            if(roomInstance && !_arg_5) roomInstance.model.setValue(RoomObjectVariable.ROOM_WALL_TYPE, wallType);

            roomObject.processUpdateMessage(new ObjectRoomUpdateMessage(ObjectRoomUpdateMessage.ROOM_WALL_UPDATE, wallType));
        }

        if(landscapeType)
        {
            if(roomInstance && !_arg_5) roomInstance.model.setValue(RoomObjectVariable.ROOM_LANDSCAPE_TYPE, landscapeType);

            roomObject.processUpdateMessage(new ObjectRoomUpdateMessage(ObjectRoomUpdateMessage.ROOM_LANDSCAPE_UPDATE, landscapeType));
        }

        return true;
    }

    public addRoomInstanceFloorHole(roomId: number, objectId: number): void
    {
        if(objectId < 0) return;

        const roomOwnObject = this.getRoomOwnObject(roomId);
        const roomObject    = this.getRoomObjectFloor(roomId, objectId);

        if(roomOwnObject && roomOwnObject.logic && roomObject && roomObject.model)
        {
            const location  = roomObject.getLocation();
            const sizeX     = roomObject.model.getValue(RoomObjectVariable.FURNITURE_SIZE_X) as number;
            const sizeY     = roomObject.model.getValue(RoomObjectVariable.FURNITURE_SIZE_Y) as number;

            roomOwnObject.processUpdateMessage(new ObjectRoomFloorHoleUpdateMessage(ObjectRoomFloorHoleUpdateMessage.ADD, objectId, location.x, location.y, sizeX, sizeY));
        }
    }

    public removeRoomInstanceFloorHole(roomId: number, objectId: number): void
    {
        if(objectId < 0) return;

        const roomOwnObject = this.getRoomOwnObject(roomId);

        if(roomOwnObject)
        {
            roomOwnObject.processUpdateMessage(new ObjectRoomFloorHoleUpdateMessage(ObjectRoomFloorHoleUpdateMessage.REMOVE, objectId));
        }
    }

    public update(time: number): void
    {
        if(!this._roomManager) return;

        RoomEnterEffect._Str_23419();

        time = Nitro.instance.time;

        this.processPendingFurniture();

        this._roomManager.update(time);

        this._Str_22919(time);

        if(this._Str_13525) this.setPointer();

        RoomEnterEffect._Str_22392();
    }

    private setPointer(): void
    {
        this._Str_13525 = false;

        const instanceData = this.getRoomInstanceData(this._activeRoomId);

        if(instanceData && instanceData._Str_22598())
        {
            document.body.style.cursor = 'pointer';
        }
        else
        {
            document.body.style.cursor = 'auto';
        }
    }

    private processPendingFurniture(): void
    {
        if(this._Str_8325)
        {
            this._Str_8325 = false;

            return;
        }

        const startTime         = Nitro.instance.time;
        const furniturePerTick  = 5;
        const hasTickLimit      = false;

        for(let instanceData of this._roomInstanceData.values())
        {
            if(!instanceData) continue;

            let pendingData: FurnitureData = null;

            let totalFurnitureAdded: number = 0;
            let furnitureAdded: boolean     = false;

            while(pendingData = instanceData.getNextPendingFurnitureFloor())
            {
                furnitureAdded = this.processPendingFurnitureFloor(instanceData.roomId, pendingData.id, pendingData);

                if(hasTickLimit)
                {
                    if(!(++totalFurnitureAdded % furniturePerTick))
                    {
                        const time = Nitro.instance.time;

                        if(((time - startTime) >= 40) && !this._Str_3688)
                        {
                            this._Str_8325 = true;

                            break;
                        }
                    }
                }
            }

            while(!this._Str_8325 && (pendingData = instanceData.getNextPendingFurnitureWall()))
            {
                furnitureAdded = this.processPendingFurnitureWall(instanceData.roomId, pendingData.id, pendingData);

                if(hasTickLimit)
                {
                    if(!(++totalFurnitureAdded % furniturePerTick))
                    {
                        const time = Nitro.instance.time;

                        if(((time - startTime) >= 40) && !this._Str_3688)
                        {
                            this._Str_8325 = true;

                            break;
                        }
                    }
                }
            }

            if(furnitureAdded && this._Str_3688 && this._roomManager)
            {
                const roomInstance = this._roomManager.getRoomInstance(this.getRoomId(instanceData.roomId)) as RoomInstance;

                if(!roomInstance.hasUninitializedObjects()) this._Str_17652(instanceData.roomId.toString());
            }

            if(this._Str_8325) return;
        }
    }

    public onRoomEngineInitalized(flag: boolean): void
    {
        if(!flag) return;

        this._ready = true;

        this.events.dispatchEvent(new RoomEngineEvent(RoomEngineEvent.ENGINE_INITIALIZED, 0));

        for(let roomData of this._pendingRoomData.values())
        {
            if(!roomData) continue;

            this.createRoomInstance(roomData.roomId, roomData.data)
        }
    }

    private processPendingFurnitureFloor(roomId: number, id: number, data: FurnitureData): boolean
    {
        if(!data)
        {
            const instanceData = this.getRoomInstanceData(roomId);

            if(instanceData) data = instanceData.getPendingFurnitureFloor(id);

            if(!data) return false;
        }

        let type    = data.type;
        let didLoad = false;

        if(!type)
        {
            type    = this.getFurnitureFloorName(data.typeId);
            didLoad = true;

        }

        const object = this.createRoomObjectFloor(roomId, id, type);

        if(!object) return false;

        const model = object.model;

        if(model)
        {
            model.setValue(RoomObjectVariable.FURNITURE_COLOR, this.getFurnitureFloorColorIndex(data.typeId));
            model.setValue(RoomObjectVariable.FURNITURE_TYPE_ID, data.typeId);
            model.setValue(RoomObjectVariable.FURNITURE_REAL_ROOM_OBJECT, (data.realRoomObject ? 1 : 0));
            model.setValue(RoomObjectVariable.FURNITURE_EXPIRY_TIME, data.expiryTime);
            model.setValue(RoomObjectVariable.FURNITURE_EXPIRTY_TIMESTAMP, Nitro.instance.time);
            model.setValue(RoomObjectVariable.FURNITURE_USAGE_POLICY, data.usagePolicy);
            model.setValue(RoomObjectVariable.FURNITURE_OWNER_ID, data.ownerId);
            model.setValue(RoomObjectVariable.FURNITURE_OWNER_NAME, data.ownerName);
        }

        if(!this.updateRoomObjectFloor(roomId, id, data.location, data.direction, data.state, data.data, data.extra)) return false;

        if(data.sizeZ >= 0)
        {
            if(!this.updateRoomObjectFloorHeight(roomId, id, data.sizeZ)) return false;
        }

        if(this.events) this.events.dispatchEvent(new RoomEngineObjectEvent(RoomEngineObjectEvent.ADDED, roomId, id, RoomObjectCategory.FLOOR));

        const selectedRoomObjectData = this.getSelectedRoomObjectData(roomId);

        if(selectedRoomObjectData && (Math.abs(selectedRoomObjectData.id) === id) && (selectedRoomObjectData.category === RoomObjectCategory.FLOOR))
        {

        }

        if(object.isReady && data.synchronized) this._Str_21543(roomId, object);

        return true;
    }

    private processPendingFurnitureWall(roomId: number, id: number, data: FurnitureData): boolean
    {
        if(!data)
        {
            const instanceData = this.getRoomInstanceData(roomId);

            if(instanceData) data = instanceData.getPendingFurnitureWall(id);

            if(!data) return false;
        }

        let extra = '';

        if(data.data) extra = data.data.getLegacyString();

        let type = this.getFurnitureWallName(data.typeId, extra);

        if(!type) type = '';
        
        const object = this.createRoomObjectWall(roomId, id, type);

        if(!object) return false;

        const model = object.model;

        if(model)
        {
            model.setValue(RoomObjectVariable.FURNITURE_COLOR, this.getFurnitureWallColorIndex(data.typeId));
            model.setValue(RoomObjectVariable.FURNITURE_TYPE_ID, data.typeId);
            model.setValue(RoomObjectVariable.FURNITURE_REAL_ROOM_OBJECT, (data.realRoomObject ? 1 : 0));
            model.setValue(RoomObjectVariable.OBJECT_ACCURATE_Z_VALUE, 1);
            model.setValue(RoomObjectVariable.FURNITURE_EXPIRY_TIME, data.expiryTime);
            model.setValue(RoomObjectVariable.FURNITURE_EXPIRTY_TIMESTAMP, Nitro.instance.time);
            model.setValue(RoomObjectVariable.FURNITURE_USAGE_POLICY, data.usagePolicy);
            model.setValue(RoomObjectVariable.FURNITURE_OWNER_ID, data.ownerId);
            model.setValue(RoomObjectVariable.FURNITURE_OWNER_NAME, data.ownerName);
        }

        if(!this.updateRoomObjectWall(roomId, id, data.location, data.direction, data.state, extra)) return false;

        if(this.events) this.events.dispatchEvent(new RoomEngineObjectEvent(RoomEngineObjectEvent.ADDED, roomId, id, RoomObjectCategory.WALL));

        if(object.isReady && data.synchronized)
        {
            
        }

        return true;
    }

    public setRoomSessionOwnUser(roomId: number, objectId: number): void
    {
        if(!this._roomSessionManager) return;

        const session = this._roomSessionManager.getSession(roomId);

        if(session)
        {
            session.setOwnRoomIndex(objectId);
        }

        const camera = this.getRoomCamera(roomId);

        if(camera)
        {
            camera._Str_10760   = objectId;
            camera._Str_16562   = RoomObjectCategory.UNIT;

            camera._Str_19465(this._Str_19549)
        }
    }

    private get _Str_19549(): number
    {
        return 1000;
        //return (getBoolean("room.camera.follow_user")) ? 1000 : 0;
    }

    private _Str_22919(time: number): void
    {
        for(let instanceData of this._roomInstanceData.values())
        {
            if(!instanceData) continue;

            const camera = instanceData.roomCamera;

            if(!camera) continue;

            const object = this.getRoomObject(instanceData.roomId, camera._Str_10760, camera._Str_16562);

            if(!object) continue;

            if((instanceData.roomId !== this._activeRoomId) || !this._Str_7695)
            {
                //this._Str_25242(instanceData.roomId, 1, object.getLocation(), time);
            }
        }

        const canvas = this.getRoomInstanceRenderingCanvas(this._activeRoomId, 1);

        if(canvas)
        {
            if(this._Str_7695)
            {
                canvas.screenOffsetX = (canvas.screenOffsetX + this._Str_13608);
                canvas.screenOffsetY = (canvas.screenOffsetY + this._Str_14213);

                this._Str_13608 = 0;
                this._Str_14213 = 0;
            }
        }
    }

    private _Str_25242(k: number, _arg_2: number, _arg_3:IVector3D, _arg_4: number): void
    {
        const renderingCanvas   = this.getRoomInstanceRenderingCanvas(k, _arg_2);
        const instanceData      = this.getRoomInstanceData(k);

        if(!renderingCanvas || !instanceData || (renderingCanvas.scale !== 1)) return;

        const roomGeometry  = (renderingCanvas.geometry as RoomGeometry);
        const roomCamera    = instanceData.roomCamera;
        const roomInstance  = this.getRoomInstance(k);

        if(!roomGeometry || !roomCamera || !roomInstance) return;
        
        let canvasRectangle = this._Str_25261(k, _arg_2);

        if(!canvasRectangle) return;

        let _local_10   = (Math.floor(_arg_3.z) + 1);
        let width       = Math.round(canvasRectangle.width);
        let height      = Math.round(canvasRectangle.height);
        let bounds      = this.getCanvasBoundingRectangle(_arg_2);

        if(bounds && ((bounds.right < 0) || (bounds.bottom < 0) || (bounds.left >= width) || (bounds.top >= height)))
        {
            roomCamera.reset();
        }

        // if (((((((!(roomCamera._Str_7609 == width)) || (!(roomCamera._Str_7902 == height))) || (!(roomCamera.scale == roomGeometry.scale))) || (!(roomCamera._Str_16377 == roomGeometry.updateId))) || (!(Vector3d.isEqual(_arg_3, roomCamera._Str_16185)))) || (roomCamera._Str_12536)))
        // {
        //     roomCamera._Str_16185 = _arg_3;
            
        //     const _local_15 = new Vector3d();
            
        //     _local_15.assign(_arg_3);

        //     _local_15.x = Math.round(_local_15.x);
        //     _local_15.y = Math.round(_local_15.y);

        //     const _local_16 = (roomInstance.model.getValue(RoomVariableEnum.ROOM_MIN_X) - 0.5);
        //     const _local_17 = (roomInstance.model.getValue(RoomVariableEnum.ROOM_MIN_Y) - 0.5);
        //     const _local_18 = (roomInstance.model.getValue(RoomVariableEnum.ROOM_MAX_X) + 0.5);
        //     const _local_19 = (roomInstance.model.getValue(RoomVariableEnum.ROOM_MAX_Y) + 0.5);
        //     const _local_20 = Math.round(((_local_16 + _local_18) / 2));
        //     const _local_21 = Math.round(((_local_17 + _local_19) / 2));
        //     const _local_22 = 2;
        //     let _local_23 = new PIXI.Point((_local_15.x - _local_20), (_local_15.y - _local_21));
        //     const _local_24 = (roomGeometry.scale / Math.sqrt(2));
        //     const _local_25 = (_local_24 / 2);
        //     const _local_26 = new PIXI.Matrix();
        //     _local_26.rotate(((-(roomGeometry.direction.x + 90) / 180) * Math.PI));
        //     _local_23 = _local_26.apply(_local_23);
        //     _local_23.y = (_local_23.y * (_local_25 / _local_24));
        //     const _local_27 = (((canvasRectangle.width / 2) / _local_24) - 1);
        //     const _local_28 = (((canvasRectangle.height / 2) / _local_25) - 1);
            
        //     let _local_29 = 0;
        //     let _local_30 = 0;
        //     let _local_31 = 0;
        //     let _local_32 = 0;
        //     let _local_33 = roomGeometry.getScreenPoint(new Vector3d(_local_20, _local_21, _local_22));

        //     if(!_local_33) return;
            
        //     _local_33.x = (_local_33.x + Math.round((canvasRectangle.width / 2)));
        //     _local_33.y = (_local_33.y + Math.round((canvasRectangle.height / 2)));

        //     if (bounds != null)
        //     {
        //         bounds.x += -(renderingCanvas.screenOffsetX);
        //         bounds.y += -(renderingCanvas.screenOffsetY);

        //         if(((bounds.width > 1) && (bounds.height > 1)))
        //         {
        //             _local_29 = (((bounds.left - _local_33.x) - (roomGeometry.scale * 0.25)) / _local_24);
        //             _local_31 = (((bounds.right - _local_33.x) + (roomGeometry.scale * 0.25)) / _local_24);
        //             _local_30 = (((bounds.top - _local_33.y) - (roomGeometry.scale * 0.5)) / _local_25);
        //             _local_32 = (((bounds.bottom - _local_33.y) + (roomGeometry.scale * 0.5)) / _local_25);
        //         }
        //         else
        //         {
        //             roomGeometry.adjustLocation(new Vector3d(-30, -30), 25);

        //             return;
        //         }
        //     }
        //     else
        //     {
        //         roomGeometry.adjustLocation(new Vector3d(0, 0), 25);
                
        //         return;
        //     }

        //     let _local_34 = false;
        //     let _local_35 = false;
        //     let _local_36 = false;
        //     let _local_37 = false;
        //     let _local_38 = Math.round(((_local_31 - _local_29) * _local_24));

        //     if (_local_38 < canvasRectangle.width)
        //     {
        //         _local_10 = 2;
        //         _local_23.x = ((_local_31 + _local_29) / 2);
        //         _local_36 = true;
        //     }
        //     else
        //     {
        //         if (_local_23.x > (_local_31 - _local_27))
        //         {
        //             _local_23.x = (_local_31 - _local_27);
        //             _local_34 = true;
        //         }
        //         if (_local_23.x < (_local_29 + _local_27))
        //         {
        //             _local_23.x = (_local_29 + _local_27);
        //             _local_34 = true;
        //         }
        //     }
        //     let _local_39 = Math.round(((_local_32 - _local_30) * _local_25));
        //     if (_local_39 < canvasRectangle.height)
        //     {
        //         _local_10 = 2;
        //         _local_23.y = ((_local_32 + _local_30) / 2);
        //         _local_37 = true;
        //     }
        //     else
        //     {
        //         if (_local_23.y > (_local_32 - _local_28))
        //         {
        //             _local_23.y = (_local_32 - _local_28);
        //             _local_35 = true;
        //         }
        //         if (_local_23.y < (_local_30 + _local_28))
        //         {
        //             _local_23.y = (_local_30 + _local_28);
        //             _local_35 = true;
        //         }
        //         if (_local_35)
        //         {
        //             _local_23.y = (_local_23.y / (_local_25 / _local_24));
        //         }
        //     }
        //     _local_26.invert();
        //     _local_23 = _local_26.apply(_local_23);
        //     _local_23.x = (_local_23.x + _local_20);
        //     _local_23.y = (_local_23.y + _local_21);
        //     let _local_40 = 0.35;
        //     let _local_41 = 0.2;
        //     let _local_42 = 0.2;
        //     let _local_43 = 10;
        //     let _local_44 = 10;
        //     if ((_local_42 * width) > 100)
        //     {
        //         _local_42 = (100 / width);
        //     }
        //     if ((_local_40 * height) > 150)
        //     {
        //         _local_40 = (150 / height);
        //     }
        //     if ((_local_41 * height) > 150)
        //     {
        //         _local_41 = (150 / height);
        //     }
        //     if ((((roomCamera._Str_10235) && (roomCamera._Str_7609 == width)) && (roomCamera._Str_7902 == height)))
        //     {
        //         _local_42 = 0;
        //     }
        //     if ((((roomCamera._Str_10446) && (roomCamera._Str_7609 == width)) && (roomCamera._Str_7902 == height)))
        //     {
        //         _local_40 = 0;
        //         _local_41 = 0;
        //     }
        //     canvasRectangle.right = (canvasRectangle.right * (1 - (_local_42 * 2)));
        //     canvasRectangle.bottom = (canvasRectangle.bottom * (1 - (_local_40 + _local_41)));
        //     if (canvasRectangle.right < _local_43)
        //     {
        //         canvasRectangle.right = _local_43;
        //     }
        //     if (canvasRectangle.bottom < _local_44)
        //     {
        //         canvasRectangle.bottom = _local_44;
        //     }
        //     if ((_local_40 + _local_41) > 0)
        //     {
        //         canvasRectangle.x += (-(canvasRectangle.width) / 2);
        //         canvasRectangle.y += (-(canvasRectangle.height) * (_local_41 / (_local_40 + _local_41)));
        //     }
        //     else
        //     {
        //         canvasRectangle.x += (-(canvasRectangle.width) / 2);
        //         canvasRectangle.y += (-(canvasRectangle.height) / 2)
        //     }
        //     _local_33 = roomGeometry.getScreenPoint(_local_15);
        //     if (_local_33 != null)
        //     {
        //         _local_33.x = (_local_33.x + renderingCanvas.screenOffsetX);
        //         _local_33.y = (_local_33.y + renderingCanvas.screenOffsetY);
        //         _local_15.z = _local_10;
        //         _local_15.x = (Math.round((_local_23.x * 2)) / 2);
        //         _local_15.y = (Math.round((_local_23.y * 2)) / 2);
        //         if (roomCamera.location == null)
        //         {
        //             roomGeometry.location = _local_15;
        //             if (this._Str_11555)
        //             {
        //                 roomCamera._Str_20685(new Vector3d(0, 0, 0));
        //             }
        //             else
        //             {
        //                 roomCamera._Str_20685(_local_15);
        //             }
        //         }
        //         let _local_45 = roomGeometry.getScreenPoint(_local_15);
        //         let _local_46 = new Vector3d(0, 0, 0);
        //         if (_local_45 != null)
        //         {
        //             _local_46.x = _local_45.x;
        //             _local_46.y = _local_45.y;
        //         }
        //         if (((((((((_local_33.x < canvasRectangle.left) || (_local_33.x > canvasRectangle.right)) && (!(roomCamera._Str_8564))) || (((_local_33.y < canvasRectangle.top) || (_local_33.y > canvasRectangle.bottom)) && (!(roomCamera._Str_8690)))) || (((_local_36) && (!(roomCamera._Str_8564))) && (!(roomCamera._Str_7609 == width)))) || (((_local_37) && (!(roomCamera._Str_8690))) && (!(roomCamera._Str_7902 == height)))) || ((!(roomCamera._Str_18975 == bounds.width)) || (!(roomCamera._Str_15953 == bounds.height)))) || ((!(roomCamera._Str_7609 == width)) || (!(roomCamera._Str_7902 == height)))))
        //         {
        //             roomCamera._Str_10235 = _local_34;
        //             roomCamera._Str_10446 = _local_35;
        //             if (this._Str_11555)
        //             {
        //                 roomCamera.target = _local_46;
        //             }
        //             else
        //             {
        //                 roomCamera.target = _local_15;
        //             }
        //         }
        //         else
        //         {
        //             if (!_local_34)
        //             {
        //                 roomCamera._Str_10235 = false;
        //             }
        //             if (!_local_35)
        //             {
        //                 roomCamera._Str_10446 = false;
        //             }
        //         }
        //     }
        //     console.log('hello')
        //     roomCamera._Str_8564 = _local_36;
        //     roomCamera._Str_8690 = _local_37;
        //     roomCamera._Str_7609 = width;
        //     roomCamera._Str_7902 = height;
        //     roomCamera.scale = roomGeometry.scale;
        //     roomCamera._Str_16377 = roomGeometry.updateId;
        //     roomCamera._Str_18975 = bounds.width;
        //     roomCamera._Str_15953 = bounds.height;
        //     if(true) //!this._sessionDataManager._Str_18110
        //     {
        //         if (this._Str_11555)
        //         {
        //             roomCamera.update(_arg_4, 8);
        //         }
        //         else
        //         {
        //             roomCamera.update(_arg_4, 0.5);
        //         }
        //     }
        //     if (this._Str_11555)
        //     {
        //         renderingCanvas.screenOffsetX = -(roomCamera.location.x);
        //         renderingCanvas.screenOffsetY = -(roomCamera.location.y);
        //     }
        //     else
        //     {
        //         roomGeometry.adjustLocation(roomCamera.location, 25);
        //     }
        // }
        // else
        // {
        //     roomCamera._Str_10235 = false;
        //     roomCamera._Str_10446 = false;
        //     roomCamera._Str_8564 = false;
        //     roomCamera._Str_8690 = false;
        // }
    }

    private _Str_25261(roomId: number, canvasId: number): PIXI.Rectangle
    {
        const canvas = this.getRoomInstanceRenderingCanvas(roomId, canvasId);

        if(!canvas) return null;

        return new PIXI.Rectangle(0, 0, canvas.width, canvas.height);
    }

    public getRoomObjectBoundingRectangle(roomId: number, objectId: number, category: number, canvasId: number): PIXI.Rectangle
    {
        const geometry = this.getRoomInstanceGeometry(roomId, canvasId);

        if(!geometry) return null;
        
        const roomObject = this.getRoomObject(roomId, objectId, category);

        if(!roomObject) return null;
            
        const visualization = roomObject.visualization;

        if(!visualization) return null;
        
        const rectangle     = visualization.getBoundingRectangle();
        const canvas        = this.getRoomInstanceRenderingCanvas(roomId, canvasId);
        const scale         = ((canvas) ? canvas.scale : 1);
        const screenPoint   = geometry.getScreenPoint(roomObject.getLocation());

        if(!screenPoint) return null;
        
        rectangle.x         = (rectangle.x * scale);
        rectangle.y         = (rectangle.y * scale);
        rectangle.width     = (rectangle.width * scale);
        rectangle.height    = (rectangle.height * scale);

        screenPoint.x       = (screenPoint.x * scale);
        screenPoint.y       = (screenPoint.y * scale);

        rectangle.x += screenPoint.x;
        rectangle.y += screenPoint.y;

        if(!canvas) return null;
        
        rectangle.x += ((canvas.width / 2) + canvas.screenOffsetX);
        rectangle.y += ((canvas.height / 2) + canvas.screenOffsetY);
        
        return rectangle;
    }

    public getCanvasBoundingRectangle(canvasId: number): PIXI.Rectangle
    {
        return this.getRoomObjectBoundingRectangle(this._activeRoomId, RoomEngine.ROOM_OBJECT_ID, RoomObjectCategory.ROOM, canvasId);
    }

    public getFurnitureFloorName(typeId: number): string
    {
        if(!this._roomContentLoader) return null;

        return this._roomContentLoader.getFurnitureFloorNameForTypeId(typeId);
    }

    public getFurnitureWallName(typeId: number, extra: string = null): string
    {
        if(!this._roomContentLoader) return null;

        return this._roomContentLoader.getFurnitureWallNameForTypeId(typeId, extra);
    }

    public getFurnitureFloorColorIndex(typeId: number): number
    {
        if(!this._roomContentLoader) return null;

        return this._roomContentLoader.getFurnitureFloorColorIndex(typeId);
    }

    public getFurnitureWallColorIndex(typeId: number): number
    {
        if(!this._roomContentLoader) return null;

        return this._roomContentLoader.getFurnitureWallColorIndex(typeId);
    }

    private getRoomInstanceData(roomId: number): RoomInstanceData
    {
        const existing = this._roomInstanceData.get(roomId);

        if(existing) return existing;

        const data = new RoomInstanceData(roomId);

        this._roomInstanceData.set(data.roomId, data);

        return data;
    }

    public getRoomInstanceModelName(roomId: number): string
    {
        const instanceData = this.getRoomInstanceData(roomId);

        if(!instanceData) return null;

        return instanceData.modelName;
    }

    public setRoomInstanceModelName(roomId: number, name: string): void
    {
        const instanceData = this.getRoomInstanceData(roomId);

        if(!instanceData) return;

        instanceData.setModelName(name);
    }

    private getCurrentRoomCamera(): RoomCamera
    {
        return this.getRoomCamera(this._activeRoomId);
    }

    private getRoomCamera(roomId: number): RoomCamera
    {
        const instanceData = this.getRoomInstanceData(roomId);

        if(!instanceData) return null;

        return instanceData.roomCamera;
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

    private createRoomObjectAndInitialize(roomId: number, objectId: number, type: string, category: number): IRoomObjectController
    {
        const instance = this.getRoomInstance(roomId);

        if(!instance) return null;

        return instance.createRoomObjectAndInitalize(objectId, type, category) as IRoomObjectController;
    }

    public getTotalObjectsForManager(roomId: number, category: number): number
    {
        const instance = this.getRoomInstance(roomId);

        if(!instance) return 0;

        return instance.getTotalObjectsForManager(category);
    }

    public getRoomObject(roomId: number, objectId: number, category: number): IRoomObjectController
    {
        const instance = this.getRoomInstance(roomId);

        if(!instance) return null;

        return instance.getRoomObject(objectId, category) as IRoomObjectController;
    }

    public getRoomObjectByIndex(roomId: number, index: number, category: number): IRoomObjectController
    {
        const instance = this.getRoomInstance(roomId);

        if(!instance) return null;

        return instance.getRoomObjectByIndex(index, category) as IRoomObjectController;
    }

    public getRoomObjectCategoryForType(type: string): number
    {
        if(!type || !this._roomContentLoader) return RoomObjectCategory.MINIMUM;

        return this._roomContentLoader.getCategoryForType(type);
    }

    public getRoomObjectCursor(roomId: number): IRoomObjectController
    {
        return this.getRoomObject(roomId, RoomEngine.CURSOR_OBJECT_ID, RoomObjectCategory.CURSOR);
    }

    public getRoomObjectSelectionArrow(roomId: number): IRoomObjectController
    {
        return this.getRoomObject(roomId, RoomEngine.ARROW_OBJECT_ID, RoomObjectCategory.CURSOR);
    }

    public getRoomOwnObject(roomId: number): IRoomObjectController
    {
        return this.getRoomObject(roomId, RoomEngine.ROOM_OBJECT_ID, RoomObjectCategory.ROOM);
    }

    public getRoomObjectUser(roomId: number, objectId: number): IRoomObjectController
    {
        return this.getRoomObject(roomId, objectId, RoomObjectCategory.UNIT);
    }

    public removeRoomObjectUser(roomId: number, objectId: number): void
    {
        return this.removeRoomObject(roomId, objectId, RoomObjectCategory.UNIT);
    }

    public createRoomObjectUser(roomId: number, objectId: number, type: string): IRoomObjectController
    {
        return this.createRoomObjectAndInitialize(roomId, objectId, type, RoomObjectCategory.UNIT);
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

    public getRoomObjectWall(roomId: number, objectId: number): IRoomObjectController
    {
        return this.getRoomObject(roomId, objectId, RoomObjectCategory.WALL);
    }

    public removeRoomObjectWall(roomId: number, objectId: number): void
    {
        return this.removeRoomObject(roomId, objectId, RoomObjectCategory.WALL);
    }

    public createRoomObjectWall(roomId: number, id: number, type: string): IRoomObjectController
    {
        return this.createRoomObjectAndInitialize(roomId, id, type, RoomObjectCategory.WALL);
    }

    private removeRoomObject(roomId: number, objectId: number, category: number): void
    {
        const instance = this.getRoomInstance(roomId);

        if(!instance) return null;

        instance.removeRoomObject(objectId, category);

        if(this.events) this.events.dispatchEvent(new RoomEngineObjectEvent(RoomEngineObjectEvent.REMOVED, roomId, objectId, category));
    }

    public addFurnitureFloor(roomId: number, id: number, typeId: number, location: IVector3D, direction: IVector3D, state: number, objectData: IObjectData, extra: number = NaN, expires: number = -1, usagePolicy: number = 0, ownerId: number = 0, ownerName: string = '', synchronized: boolean = true, realRoomObject: boolean = true, sizeZ: number = -1): void
    {
        const instanceData = this.getRoomInstanceData(roomId);

        if(!instanceData) return null;

        const furnitureData = new FurnitureData(id, typeId, null, location, direction, state, objectData, extra, expires, usagePolicy, ownerId, ownerName, synchronized, realRoomObject, sizeZ);

        instanceData.addPendingFurnitureFloor(furnitureData);
    }

    public addFurnitureWall(roomId: number, id: number, typeId: number, location: IVector3D, direction: IVector3D, state: number, extra: string, expires: number = -1, usagePolicy: number = 0, ownerId: number = 0, ownerName: string = '', realRoomObject: boolean = true): void
    {
        const instanceData = this.getRoomInstanceData(roomId);

        if(!instanceData) return null;

        const objectData = new LegacyDataType();

        objectData.setString(extra);

        const furnitureData = new FurnitureData(id, typeId, null, location, direction, state, objectData, NaN, expires, usagePolicy, ownerId, ownerName, true, realRoomObject);

        instanceData.addPendingFurnitureWall(furnitureData);
    }

    public updateRoomObjectFloor(roomId: number, objectId: number, location: IVector3D, direction: IVector3D, state: number, data: IObjectData, extra: number = NaN): boolean
    {
        const object = this.getRoomObjectFloor(roomId, objectId);

        if(!object) return false;
        
        object.processUpdateMessage(new RoomObjectUpdateMessage(location, direction));
        object.processUpdateMessage(new ObjectDataUpdateMessage(state, data, extra));
        
        return true;
    }

    public updateRoomObjectWall(roomId: number, objectId: number, location: IVector3D, direction: IVector3D, state: number, extra: string): boolean
    {
        const object = this.getRoomObjectWall(roomId, objectId);

        if(!object || !object.logic) return false;

        const updateMessage = new RoomObjectUpdateMessage(location, direction);
        const data          = new LegacyDataType();

        data.setString(extra);

        const dataUpdateMessage = new ObjectDataUpdateMessage(state, data);
        
        object.logic.processUpdateMessage(updateMessage);
        object.logic.processUpdateMessage(dataUpdateMessage);

        this.updateRoomObjectMask(roomId, objectId);
        
        return true;
    }

    public updateRoomObjectWallItemData(roomId: number, objectId: number, data: string): boolean
    {
        const object = this.getRoomObjectWall(roomId, objectId);

        if(!object || !object.logic) return false;

        object.logic.processUpdateMessage(new ObjectItemDataUpdateMessage(data));
        
        return true;
    }

    public updateRoomObjectFloorHeight(roomId: number, objectId: number, height: number): boolean
    {
        const object = this.getRoomObjectFloor(roomId, objectId);

        if(!object) return false;
        
        object.processUpdateMessage(new ObjectHeightUpdateMessage(null, null, height));

        return true;
    }

    public updateRoomObjectFloorExpiration(roomId: number, objectId: number, expires: number): boolean
    {
        const object = this.getRoomObjectFloor(roomId, objectId);

        if(!object) return false;

        object.model.setValue(RoomObjectVariable.FURNITURE_EXPIRY_TIME, expires);
        object.model.setValue(RoomObjectVariable.FURNITURE_EXPIRTY_TIMESTAMP, Nitro.instance.time);

        return true;
    }

    public updateRoomObjectWallExpiration(roomId: number, objectId: number, expires: number): boolean
    {
        const object = this.getRoomObjectWall(roomId, objectId);

        if(!object) return false;

        object.model.setValue(RoomObjectVariable.FURNITURE_EXPIRY_TIME, expires);
        object.model.setValue(RoomObjectVariable.FURNITURE_EXPIRTY_TIMESTAMP, Nitro.instance.time);

        return true;
    }

    public updateRoomObjectMask(roomId: number, objectId: number, _arg_3: boolean = true): void
    {
        const object = this.getRoomObjectWall(roomId, objectId);

        if(!object) return;

        const maskName      = RoomObjectCategory.WALL + '_' + objectId;
        const roomObject    = this.getRoomObjectWall(roomId, objectId);

        let maskUpdate: ObjectRoomMaskUpdateMessage = null;

        if(roomObject && roomObject.model)
        {
            if(roomObject.model.getValue(RoomObjectVariable.FURNITURE_USES_PLANE_MASK) > 0)
            {
                const maskType  = roomObject.model.getValue(RoomObjectVariable.FURNITURE_PLANE_MASK_TYPE);
                const location  = roomObject.getLocation();

                if(_arg_3) maskUpdate = new ObjectRoomMaskUpdateMessage(ObjectRoomMaskUpdateMessage.ADD_MASK, maskName, maskType, location);
                else maskUpdate = new ObjectRoomMaskUpdateMessage(ObjectRoomMaskUpdateMessage._Str_10260, maskName);
            }
        }
        else
        {
            maskUpdate = new ObjectRoomMaskUpdateMessage(ObjectRoomMaskUpdateMessage._Str_10260, maskName);
        }

        const roomOwnObject = this.getRoomOwnObject(roomId);

        if(roomOwnObject && roomOwnObject.logic && maskUpdate) roomOwnObject.logic.processUpdateMessage(maskUpdate);
    }

    public rollRoomObjectFloor(roomId: number, objectId: number, location: IVector3D, targetLocation: IVector3D): void
    {
        const object = this.getRoomObjectFloor(roomId, objectId);

        if(!object) return;

        object.processUpdateMessage(new ObjectMoveUpdateMessage(location, targetLocation, null, !!targetLocation));
    }

    public addRoomObjectUser(roomId: number, objectId: number, location: IVector3D, direction: IVector3D, headDirection: number, type: number, figure: string): boolean
    {
        const existing = this.getRoomObjectUser(roomId, objectId);

        if(existing) return false;

        let objectType = RoomObjectUserType.getTypeString(type);

        if(objectType === RoomObjectUserType.PET) objectType = this.getPetType(figure);

        const object = this.createRoomObjectUser(roomId, objectId, objectType);

        if(!object) return false;

        object.processUpdateMessage(new ObjectAvatarUpdateMessage(this.fixedUserLocation(roomId, location), null, direction, headDirection, false, 0));

        if(figure) object.processUpdateMessage(new ObjectAvatarFigureUpdateMessage(figure));

        if(this.events) this.events.dispatchEvent(new RoomEngineObjectEvent(RoomEngineObjectEvent.ADDED, roomId, objectId, RoomObjectCategory.UNIT));

        return true;
    }

    public updateRoomObjectUserLocation(roomId: number, objectId: number, location: IVector3D, targetLocation: IVector3D, canStandUp: boolean = false, baseY: number = 0, direction: IVector3D = null, headDirection: number = NaN): void
    {
        const object = this.getRoomObjectUser(roomId, objectId);

        if(!object) return;

        if(!location) location = object.getLocation();

        if(!direction) direction = object.getDirection();

        if(isNaN(headDirection)) headDirection = object.model.getValue(RoomObjectVariable.HEAD_DIRECTION) as number;

        object.processUpdateMessage(new ObjectAvatarUpdateMessage(this.fixedUserLocation(roomId, location), this.fixedUserLocation(roomId, targetLocation), direction, headDirection, canStandUp, baseY));
    }

    private fixedUserLocation(roomId: number, location: IVector3D): IVector3D
    {
        if(!location) return null;
        
        const heightMap     = this.getFurnitureStackingHeightMap(roomId);
        const wallGeometry  = this.getLegacyWallGeometry(roomId);

        if(!heightMap || !wallGeometry) return location;

        var _local_5 = location.z;
        var _local_6 = heightMap.getTileHeight(location.x, location.y);
        var _local_7 = wallGeometry.getHeight(location.x, location.y);

        if((Math.abs((_local_5 - _local_6)) < 0.1) && (Math.abs((_local_6 - _local_7)) < 0.1))
        {
            _local_5 = wallGeometry._Str_24141(location.x, location.y);
        }

        return new Vector3d(location.x, location.y, _local_5);
    }

    public updateRoomObjectUserAction(roomId: number, objectId: number, action: string, value: number, parameter: string = null): void
    {
        const object = this.getRoomObjectUser(roomId, objectId);

        if(!object) return;

        let message: ObjectStateUpdateMessage = null;
        
        switch(action)
        {
            case RoomObjectVariable.FIGURE_TALK:
                message = new ObjectAvatarChatUpdateMessage(value);
                break;
            case RoomObjectVariable.FIGURE_SLEEP:
                message = new ObjectAvatarSleepUpdateMessage(value === 1);
                break;
            case RoomObjectVariable.FIGURE_IS_TYPING:
                message = new ObjectAvatarTypingUpdateMessage(value === 1);
                break;
            case RoomObjectVariable.FIGURE_IS_MUTED:
                message = new ObjectAvatarMutedUpdateMessage(value === 1);
                break;
            case RoomObjectVariable.FIGURE_CARRY_OBJECT:
                message = new ObjectAvatarCarryObjectUpdateMessage(value, parameter);
                break;
            case RoomObjectVariable.FIGURE_USE_OBJECT:
                message = new ObjectAvatarUseObjectUpdateMessage(value);
                break;
            case RoomObjectVariable.FIGURE_DANCE:
                message = new ObjectAvatarDanceUpdateMessage(value);
                break;
            case RoomObjectVariable.FIGURE_GAINED_EXPERIENCE:
                message = new ObjectAvatarExperienceUpdateMessage(value);
                break;
            case RoomObjectVariable.FIGURE_NUMBER_VALUE:
                message = new ObjectAvatarPlayerValueUpdateMessage(value);
                break;
            case RoomObjectVariable.FIGURE_SIGN:
                message = new ObjectAvatarSignUpdateMessage(value);
                break;
            case RoomObjectVariable.FIGURE_EXPRESSION:
                message = new ObjectAvatarExpressionUpdateMessage(value);
                break;
            case RoomObjectVariable.FIGURE_IS_PLAYING_GAME:
                message = new ObjectAvatarPlayingGameUpdateMessage(value === 1);
                break;
            case RoomObjectVariable.FIGURE_GUIDE_STATUS:
                message = new ObjectAvatarGuideStatusUpdateMessage(value);
                break;
        }

        if(!message) return;

        object.processUpdateMessage(message);
    }

    public updateRoomObjectUserFigure(roomId: number, objectId: number, figure: string, gender: string = null, subType: string = null, isRiding: boolean = false): void
    {
        const object = this.getRoomObjectUser(roomId, objectId);

        if(!object) return;

        object.processUpdateMessage(new ObjectAvatarFigureUpdateMessage(figure, gender, subType, isRiding));
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

    public updateRoomObjectUserPetGesture(roomId: number, objectId: number, gesture: string): void
    {
        const object = this.getRoomObjectUser(roomId, objectId);

        if(!object) return;

        object.processUpdateMessage(new ObjectAvatarPetGestureUpdateMessage(gesture));
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

    public useRoomObject(objectId: number, category: number): boolean
    {
        const roomObject = this.getRoomObject(this._activeRoomId, objectId, category);

        if(roomObject)
        {
            const eventHandler = roomObject.logic;

            if(eventHandler)
            {
                eventHandler.useObject();

                return true;
            }
        }

        return false;
    }

    public refreshRoomObjectFurnitureData(roomId: string, objectId: number, category: number): void
    {
        const id = this.getRoomIdFromString(roomId);

        if(category === RoomObjectCategory.WALL)
        {
            this.updateRoomObjectMask(id, objectId);
        }

        const object = this.getRoomObject(id, objectId, category);

        if(object && object.model && object.logic)
        {
            const dataFormat = object.model.getValue(RoomObjectVariable.FURNITURE_DATA_FORMAT);

            if(!isNaN(dataFormat))
            {
                const data = ObjectDataFactory.getData(dataFormat);

                data.initializeFromRoomObjectModel(object.model);

                object.processUpdateMessage(new ObjectDataUpdateMessage(object.state, data));
            }

            this.events.dispatchEvent(new RoomEngineObjectEvent(RoomEngineObjectEvent.CONTENT_UPDATED, id, objectId, category));
        }

        if(roomId !== RoomEngine.TEMPORARY_ROOM) this._Str_21543(id, object);
    }

    public loadRoomObjectBadgeImage(roomId: number, objectId: number, objectCategory: number, badgeId: string, groupBadge: boolean = true): void
    {
        if(!this._sessionDataManager) return;

        const roomObject = this.getRoomObjectFloor(roomId, objectId);

        if(!roomObject || !roomObject.logic) return;

        let badgeName = (groupBadge) ? this._sessionDataManager.loadGroupBadgeImage(badgeId) : this._sessionDataManager.loadBadgeImage(badgeId);

        if(!badgeName)
        {
            badgeName = 'loading_icon';

            if(!this._badgeListeners) this._badgeListeners = new Map();

            if(!this._badgeListeners.size)
            {
                this._sessionDataManager.events.addEventListener(BadgeImageReadyEvent.IMAGE_READY, this.onBadgeImageReadyEvent.bind(this));
            }

            let listeners = this._badgeListeners.get(badgeId);

            if(!listeners) listeners = [];

            listeners.push(new RoomObjectBadgeImageAssetListener(roomObject, groupBadge));

            this._badgeListeners.set(badgeId, listeners);
        }
        else
        {
            this.putBadgeInObjectAssets(roomObject, badgeId, groupBadge);
        }

        roomObject.logic.processUpdateMessage(new ObjectGroupBadgeUpdateMessage(badgeId, badgeName));
    }

    private onBadgeImageReadyEvent(k: BadgeImageReadyEvent): void
    {
        if(!this._sessionDataManager) return;

        const listeners = this._badgeListeners && this._badgeListeners.get(k.badgeId);

        if(!listeners) return;

        for(let listener of listeners)
        {
            if(!listener) continue;

            this.putBadgeInObjectAssets(listener.object, k.badgeId, listener.groupBadge);

            const badgeName = (listener.groupBadge) ? this._sessionDataManager.loadGroupBadgeImage(k.badgeId) : this._sessionDataManager.loadBadgeImage(k.badgeId);

            if(listener.object && listener.object.logic) listener.object.logic.processUpdateMessage(new ObjectGroupBadgeUpdateMessage(k.badgeId, badgeName));
        }

        this._badgeListeners.delete(k.badgeId);

        if(!this._badgeListeners.size)
        {
            this._sessionDataManager.events.removeEventListener(BadgeImageReadyEvent.IMAGE_READY, this.onBadgeImageReadyEvent.bind(this));
        }
    }

    private putBadgeInObjectAssets(object: IRoomObjectController, badgeId: string, groupBadge: boolean = false): void
    {
        if(!this._roomContentLoader || !this._sessionDataManager) return;

        const badgeName = (groupBadge) ? this._sessionDataManager.loadGroupBadgeImage(badgeId) : this._sessionDataManager.loadBadgeImage(badgeId);
        const badgeImage    = (groupBadge) ? this._sessionDataManager.getGroupBadgeImage(badgeId) : this._sessionDataManager.getBadgeImage(badgeId);

        if(badgeImage) this._roomContentLoader.addAssetToCollection(object.type, badgeName, badgeImage);
    }

    public dispatchMouseEvent(canvasId: number, x: number, y: number, type: string, altKey: boolean, ctrlKey: boolean, shiftKey: boolean, buttonDown: boolean): void
    {       
        const canvas = this.getRoomInstanceRenderingCanvas(this._activeRoomId, canvasId);

        if(!canvas) return;

        const overlay   = this.getRenderingCanvasOverlay(canvas);
        const sprite    = this._Str_16498(overlay, RoomEngine.OBJECT_ICON_SPRITE);

        if(sprite)
        {
            const rectangle = sprite.getLocalBounds();

            sprite.x = (x - (rectangle.width / 2));
            sprite.y = (y - (rectangle.height / 2));
        }
        
        if(!this._Str_25871(canvas, x, y, type, altKey, ctrlKey, shiftKey))
        {
            if(!canvas._Str_21232(x, y, type, altKey, ctrlKey, shiftKey, buttonDown))
            {
                let eventType: string = null;

                if(type === MouseEventType.MOUSE_CLICK)
                {
                    if(this.events)
                    {
                        this.events.dispatchEvent(new RoomEngineObjectEvent(RoomEngineObjectEvent.DESELECTED, this._activeRoomId, -1, RoomObjectCategory.MINIMUM));
                    }

                    eventType = RoomObjectMouseEvent.CLICK;
                }
                else
                {
                    if(type === MouseEventType.MOUSE_MOVE) eventType = RoomObjectMouseEvent.MOUSE_MOVE;

                    else if(type === MouseEventType.MOUSE_DOWN) eventType = RoomObjectMouseEvent.MOUSE_DOWN;

                    else if(type === MouseEventType.MOUSE_UP) eventType = RoomObjectMouseEvent.MOUSE_UP;
                }

                this._roomObjectEventHandler.handleRoomObjectEvent(new RoomObjectMouseEvent(eventType, this.getRoomObject(this._activeRoomId, RoomEngine.ROOM_OBJECT_ID, RoomObjectCategory.ROOM), null, altKey), this._activeRoomId);
            }
        }

        this._lastCanvasId  = canvasId;
        this._mouseX        = x;
        this._mouseY        = y;
    }

    private _Str_25871(canvas: IRoomRenderingCanvas, x: number, y: number, type: string, altKey: boolean, ctrlKey: boolean, shiftKey: boolean): boolean
    {
        if(this._Str_3688) return false;

        let offsetX = (x - this._mouseX);
        let offsetY = (y - this._mouseY);

        if(type === MouseEventType.MOUSE_DOWN)
        {
            if(!altKey && !ctrlKey && !shiftKey && !this.isDecorating)
            {
                this._Str_7695  = true;
                this._Str_6482  = false;
                this._Str_21787 = this._mouseX;
                this._Str_19133 = this._mouseY;
            }
        }
        else
        {
            if(type === MouseEventType.MOUSE_UP)
            {
                if(this._Str_7695)
                {
                    this._Str_7695 = false;

                    if(this._Str_6482)
                    {
                        const instanceData = this.getRoomInstanceData(this._activeRoomId);

                        if(instanceData)
                        {
                            const camera = instanceData.roomCamera;

                            if(camera)
                            {
                                if(!camera._Str_12536)
                                {
                                    camera._Str_8564 = false;
                                    camera._Str_8690 = false;
                                }

                                camera._Str_25467(new Vector3d(-(canvas.screenOffsetX), -(canvas.screenOffsetX)));

                                if(this._cameraCentered) camera.reset();
                            }
                        }
                    }
                }
            }
            else
            {
                if(type === MouseEventType.MOUSE_MOVE)
                {
                    if(this._Str_7695)
                    {
                        if(!this._Str_6482)
                        {
                            offsetX = (x - this._Str_21787);
                            offsetY = (y - this._Str_19133);
                            if (((((offsetX <= -(RoomEngine.DRAG_THRESHOLD)) || (offsetX >= RoomEngine.DRAG_THRESHOLD)) || (offsetY <= -(RoomEngine.DRAG_THRESHOLD))) || (offsetY >= RoomEngine.DRAG_THRESHOLD)))
                            {
                                this._Str_6482 = true;
                            }

                            offsetX = 0;
                            offsetY = 0;
                        }

                        if(((!(offsetX == 0)) || (!(offsetY == 0))))
                        {
                            this._Str_13608 += offsetX;
                            this._Str_14213 += offsetY;

                            this._Str_6482 = true;
                        }
                    }
                }
                else
                {
                    if((type === MouseEventType.MOUSE_CLICK) || (type === MouseEventType.DOUBLE_CLICK))
                    {
                        this._Str_7695 = false;

                        if(this._Str_6482)
                        {
                            this._Str_6482 = false;

                            return true;
                        }
                    }
                }
            }
        }
        
        return false;
    }

    public updateMousePointer(type: string, objectId: number, objectType: string): void
    {
        const category = this.getRoomObjectCategoryForType(objectType);

        switch(type)
        {
            case RoomObjectFurnitureActionEvent.MOUSE_BUTTON:
                this.setMouseButton(this._activeRoomId, category, objectId);
                return;
            default:
                this.setMouseDefault(this._activeRoomId, category, objectId);
                return;
        }
    }

    private setMouseButton(roomId: number, category: number, objectId: number): void
    {
        if(!this._roomSessionManager) return;

        const session = this._roomSessionManager.getSession(roomId);

        if(!session) return;

        if(((category !== RoomObjectCategory.FLOOR) && (category !== RoomObjectCategory.WALL)) || ((session.controllerLevel >= RoomControllerLevel.GUEST)))
        {
            const instanceData = this.getRoomInstanceData(roomId);

            if(instanceData)
            {
                if(instanceData._Str_16810((category + '_' + objectId))) this._Str_13525 = true;
            }
        }
    }

    private setMouseDefault(roomId: number, category: number, objectId: number): void
    {
        if(!this._roomSessionManager) return;

        const session = this._roomSessionManager.getSession(roomId);

        if(!session) return;

        if(((category !== RoomObjectCategory.FLOOR) && (category !== RoomObjectCategory.WALL)) || ((session.controllerLevel >= RoomControllerLevel.GUEST)))
        {
            const instanceData = this.getRoomInstanceData(roomId);

            if(instanceData)
            {
                if(instanceData._Str_11959((category + '_' + objectId))) this._Str_13525 = true;
            }
        }
    }

    public processRoomObjectOperation(objectId: number, category: number, operation: string): boolean
    {
        if(!this._roomObjectEventHandler) return false;

        this._roomObjectEventHandler._Str_3571(this._activeRoomId, objectId, category, operation);
    }

    private processRoomObjectEvent(event: RoomObjectEvent): void
    {
        if(!this._roomObjectEventHandler) return;

        const roomIdString = this.getRoomObjectRoomId(event.object);

        if(!roomIdString) return;

        const roomId = this.getRoomIdFromString(roomIdString);

        this._roomObjectEventHandler.handleRoomObjectEvent(event, roomId);
    }

    public getRoomObjectScreenLocation(roomId: number, objectId: number, objectType: number, canvasId: number = -1): PIXI.Point
    {
        if(canvasId == -1) canvasId = this._lastCanvasId;

        const geometry = this.getRoomInstanceGeometry(roomId, canvasId);

        if(!geometry)  return null;
        
        const roomObject = this.getRoomObject(roomId, objectId, objectType);

        if(!roomObject) return null;
        
        const screenPoint = geometry.getScreenPoint(roomObject.getLocation());

        if(!screenPoint) return null;
        
        const renderingCanvas = this.getRoomInstanceRenderingCanvas(roomId, canvasId);

        if(!renderingCanvas) return null;
        
        screenPoint.x = (screenPoint.x * renderingCanvas.scale);
        screenPoint.y = (screenPoint.y * renderingCanvas.scale);

        screenPoint.x += ((renderingCanvas.width / 2) + renderingCanvas.screenOffsetX);
        screenPoint.y += ((renderingCanvas.height / 2) + renderingCanvas.screenOffsetY);
        
        return screenPoint;
    }

    public selectRoomObject(roomId: number, objectId: number, objectCategory: number): void
    {
        if(!this._roomObjectEventHandler) return;

        this._roomObjectEventHandler._Str_17481(roomId, objectId, objectCategory);
    }

    private _Str_24651(k: PIXI.Sprite, _arg_2: string, _arg_3: PIXI.Texture): PIXI.Sprite
    {
        if(!k || !_arg_3) return;

        let _local_4 = this._Str_16498(k, _arg_2);

        if(_local_4) return null;

        _local_4 = PIXI.Sprite.from(_arg_3);
        _local_4.name = _arg_2;

        k.addChild(_local_4);

        return _local_4;
    }

    public _Str_16645(objectId: number, category: number, _arg_3: boolean, _arg_4: string = null, _arg_5: IObjectData = null, _arg_6: number = -1, _arg_7: number = -1, _arg_8: string = null): void
    {
        let type: string            = null;
        let colorIndex              = 0;
        let _local_9: ImageResult   = null;

        if(_arg_3)
        {
            _local_9 = this.getRoomObjectImage(this._activeRoomId, objectId, category, new Vector3d(), 1, null);
        }
        else
        {
            if(this._roomContentLoader)
            {
                if(category === RoomObjectCategory.FLOOR)
                {
                    type        = this._roomContentLoader.getFurnitureFloorNameForTypeId(objectId);
                    colorIndex  = this._roomContentLoader.getFurnitureFloorColorIndex(objectId);
                }

                else if(category === RoomObjectCategory.WALL)
                {
                    type        = this._roomContentLoader.getFurnitureWallNameForTypeId(objectId, _arg_4);
                    colorIndex  = this._roomContentLoader.getFurnitureWallColorIndex(objectId);
                }

                else if(category === RoomObjectCategory.UNIT)
                {
                    type = RoomObjectUserType.getTypeString(objectId);

                    if(type === "pet")
                    {
                        type = this.getPetType(_arg_4);

                        const _local_13 = new PetFigureData(_arg_4);

                        _local_9 = this._Str_2641(_local_13.typeId, _local_13.paletteId, _local_13.color, new Vector3d(180), 64, null, true, 0, _local_13.customParts, _arg_8);
                    }
                    else
                    {
                        _local_9 = this.getGenericRoomObjectImage(type, _arg_4, new Vector3d(180), 1, null, 0, null, _arg_5, _arg_6, _arg_7, _arg_8);
                    }
                }
                
                else
                {
                    _local_9 = this.getGenericRoomObjectImage(type, colorIndex.toString(), new Vector3d(), 1, null, 0, _arg_4, _arg_5, _arg_6, _arg_7, _arg_8);
                }
            }
        }

        if(!_local_9 || !_local_9.data) return;

        const _local_10 = this.getActiveRoomInstanceRenderingCanvas();

        if(!_local_10) return;
        
        const _local_14 = this.getRenderingCanvasOverlay(_local_10);

        this._Str_21215(_local_14, RoomEngine.OBJECT_ICON_SPRITE);

        const _local_15 = this._Str_24651(_local_14, RoomEngine.OBJECT_ICON_SPRITE, _local_9.data);

        if(_local_15)
        {
            _local_15.x = (this._mouseX - (_local_9.data.width / 2));
            _local_15.y = (this._mouseY - (_local_9.data.height / 2));
        }
    }

    public getRoomObjectImage(k: number, _arg_2: number, category: number, _arg_4: IVector3D, _arg_5: number, _arg_6: IGetImageListener, _arg_7: number = 0): ImageResult
    {
        if(!this._roomManager) return null;

        let extras: string      = null;
        let objectId: string    = null;
        let color: string       = '';
        let data: IObjectData   = null;
        let objectType: number  = -1;

        const roomId        = this.getRoomId(k);
        const roomInstance  = this._roomManager.getRoomInstance(roomId);

        if(roomInstance)
        {
            const roomObject = roomInstance.getRoomObject(_arg_2, category);

            if(roomObject && roomObject.model)
            {
                objectId    = roomObject.type;
                objectType   = roomObject.id;

                switch(category)
                {
                    case RoomObjectCategory.FLOOR:
                    case RoomObjectCategory.WALL:
                        color = (roomObject.model.getValue(RoomObjectVariable.FURNITURE_COLOR).toString());
                        extras = (roomObject.model.getValue(RoomObjectVariable.FURNITURE_EXTRAS) as string);

                        const dataFormat = (roomObject.model.getValue(RoomObjectVariable.FURNITURE_DATA_FORMAT) as number);

                        if(dataFormat !== LegacyDataType.FORMAT_KEY)
                        {
                            data = ObjectDataFactory.getData(dataFormat);

                            data.initializeFromRoomObjectModel(roomObject.model);
                        }

                        break;
                    case RoomObjectCategory.UNIT:
                        color = roomObject.model.getValue(RoomObjectVariable.FIGURE);
                        break;
                }
            }
        }

        return this.getGenericRoomObjectImage(objectId, color, _arg_4, _arg_5, _arg_6, _arg_7, extras, data, -1, -1, null, objectType);
    }

    public _Str_2641(k: number, _arg_2: number, _arg_3: number, _arg_4: IVector3D, _arg_5: number, _arg_6: IGetImageListener, _arg_7: boolean = true, _arg_8: number = 0, _arg_9: PetCustomPart[] = null, _arg_10: string = null):ImageResult
    {
        let _local_11: string = null;
        let _local_12 = ((((k + " ") + _arg_2) + " ") + _arg_3.toString(16));

        if(!_arg_7) _local_12 = (_local_12 + (" " + "head"));

        if(_arg_9)
        {
            _local_12 = (_local_12 + (" " + _arg_9.length));

            for(let _local_13 of _arg_9)
            {
                _local_12 = (_local_12 + (((((" " + _local_13.layerId) + " ") + _local_13.partId) + " ") + _local_13.paletteId));
            }
        }

        if(this._roomContentLoader) _local_11 = this._roomContentLoader.getPetNameForType(k);

        return this.getGenericRoomObjectImage(_local_11, _local_12, _arg_4, _arg_5, _arg_6, _arg_8, null, null, -1, -1, _arg_10);
    }

    public getGenericRoomObjectImage(type: string, value: string, direction: IVector3D, scale: number, _arg_5: IGetImageListener, _arg_6: number = 0, extras: string = null, objectData: IObjectData = null, state: number = -1, frameCount: number = -1, _arg_11: string = null, _arg_12: number = -1): ImageResult
    {
        if(!this._roomManager) return null;
        
        const imageResult = new ImageResult();

        imageResult.id = -1;

        if(!this._ready || !type) return imageResult;

        let roomInstance = this._roomManager.getRoomInstance(RoomEngine.TEMPORARY_ROOM);

        if(!roomInstance)
        {
            roomInstance = this._roomManager.createRoomInstance(RoomEngine.TEMPORARY_ROOM);

            if(!roomInstance) return imageResult;
        }

        let objectId        = this._numberBank._Str_19709();
        let objectCategory  = this.getRoomObjectCategoryForType(type);

        if(objectId < 0) return imageResult;

        objectId++;

        const roomObject = (roomInstance.createRoomObjectAndInitalize(objectId, type, objectCategory) as IRoomObjectController);

        if(!roomObject || !roomObject.model || !roomObject.logic) return imageResult;

        const model = roomObject.model;

        switch(objectCategory)
        {
            case RoomObjectCategory.FLOOR:
            case RoomObjectCategory.WALL:
                model.setValue(RoomObjectVariable.FURNITURE_COLOR, parseInt(value));
                break;
            case RoomObjectCategory.UNIT:
                if((type === RoomObjectUserType.USER) || (type === RoomObjectUserType.BOT) || (type === RoomObjectUserType.RENTABLE_BOT) || (type === RoomObjectUserType.PET))
                {
                    model.setValue(RoomObjectVariable.FIGURE, value);
                }
                break;
            case RoomObjectCategory.ROOM:
                break;
        }

        roomObject.setDirection(direction);

        const visualization = roomObject.visualization;

        if(!visualization)
        {
            roomInstance.removeRoomObject(objectId, objectCategory);

            return imageResult;
        }
        
        if((state > -1) || objectData)
        {
            if(objectData && (objectData.getLegacyString() !== ''))
            {
                roomObject.logic.processUpdateMessage(new ObjectDataUpdateMessage(parseInt(objectData.getLegacyString()), objectData));
            }
            else
            {
                roomObject.logic.processUpdateMessage(new ObjectDataUpdateMessage(state, objectData));
            }
        }

        let geometry = new RoomGeometry(scale, new Vector3d(-135, 30, 0), new Vector3d(11, 11, 5));

        visualization.update(geometry, 0, true, false);

        if(frameCount > 0)
        {
            let i = 0;

            while (i < frameCount)
            {
                visualization.update(geometry, 0, true, false);

                i++;
            }
        }

        const texture = visualization.getImage(_arg_6, _arg_12);

        imageResult.data    = texture;
        imageResult.id      = objectId;

        if(!this.isRoomContentTypeLoaded(type) && _arg_5)
        {
            this._imageListeners.set(objectId.toString(), _arg_5);

            model.setValue(RoomObjectVariable.IMAGE_QUERY_SCALE, scale);
        }
        else
        {
            roomInstance.removeRoomObject(objectId, objectCategory);

            this._numberBank._Str_15187((objectId - 1));

            imageResult.id = 0;
        }

        geometry.dispose();

        return imageResult;
    }

    public _Str_7972(k: boolean): void
    {
        const canvas = this.getActiveRoomInstanceRenderingCanvas();

        if(!canvas) return;

        const overlay   = this.getRenderingCanvasOverlay(canvas);
        const sprite    = this._Str_16498(overlay, RoomEngine.OBJECT_ICON_SPRITE);

        if(sprite)
        {
            sprite.visible = k;
        }
    }

    public _Str_17948(): void
    {
        const canvas = this.getActiveRoomInstanceRenderingCanvas();

        if(!canvas) return;

        const sprite = this.getRenderingCanvasOverlay(canvas);

        this._Str_21215(sprite, RoomEngine.OBJECT_ICON_SPRITE);
    }

    private getRenderingCanvasOverlay(k: IRoomRenderingCanvas): PIXI.Sprite
    {
        if(!k) return null;

        const displayObject = k.displayObject as PIXI.Container;

        if(!displayObject) return null;

        const sprite = displayObject.getChildByName(RoomEngine.OVERLAY) as PIXI.Sprite;

        if(!sprite) return null;

        return sprite;
    }

    private _Str_21215(k: PIXI.Sprite, _arg_2: string): boolean
    {
        if(!k) return false;

        let index = (k.children.length - 1);

        while(index >= 0)
        {
            const child = k.getChildAt(index) as PIXI.Sprite;

            if(child)
            {
                if(child.name === _arg_2)
                {
                    k.removeChildAt(index);

                    if(child.children.length)
                    {
                        const firstChild = child.getChildAt(0) as PIXI.Sprite;
                        
                        firstChild.parent.removeChild(firstChild);

                        firstChild.destroy();
                    }

                    return true;
                }
            }

            index--;
        }

        return false;
    }

    private _Str_16498(k: PIXI.Sprite, _arg_2: string): PIXI.Sprite
    {
        if(!k) return null;

        let index = (k.children.length - 1);

        while(index >= 0)
        {
            const child = k.getChildAt(index) as PIXI.Sprite;

            if(child)
            {
                if(child.name === _arg_2) return child;
            }

            index--;
        }

        return null;
    }

    protected _Str_21543(k: number, _arg_2: IRoomObject): void
    {
        const tileObjectMap = this.getRoomInstanceData(k).tileObjectMap;

        if(tileObjectMap) tileObjectMap._Str_21192(_arg_2);
    }

    public _Str_17652(k: string): void
    {
        const roomId = this.getRoomIdFromString(k);

        this.events.dispatchEvent(new RoomEngineEvent(RoomEngineEvent.OBJECTS_INITIALIZED, roomId));
    }

    public getRoomId(id: number): string
    {
        return (id.toString());
    }

    private getRoomIdFromString(roomId: string): number
    {
        if(!roomId) return -1;

        const split = roomId.split('_');

        if(split.length <= 0) return -1;

        return parseInt(split[0]);
    }

    private getRoomObjectRoomId(object: IRoomObject): string
    {
        if(!object || !object.model) return null;

        return (object.model.getValue(RoomObjectVariable.OBJECT_ROOM_ID));
    }

    public getPetTypeId(figure: string): number
    {
        let type = -1;

        if(figure)
        {
            const parts = figure.split(' ');

            if(parts.length > 1) type = parseInt(parts[0]);
        }

        return type;
    }

    private getPetType(type: string): string
    {
        if(!type) return null;

        const parts = type.split(' ');

        if(parts.length > 1)
        {
            const typeId = parseInt(parts[0]);

            if(this._roomContentLoader) return this._roomContentLoader.getPetNameForType(typeId);

            return 'pet';
        }

        return null;
    }

    public isRoomContentTypeLoaded(name: string): boolean
    {
        if(!this._roomContentLoader) return false;

        return (this._roomContentLoader.getCollection(name) !== null);
    }

    public get connection(): IConnection
    {
        return this._communication.connection;
    }

    public get sessionDataManager(): ISessionDataManager
    {
        return this._sessionDataManager;
    }

    public set sessionDataManager(manager: ISessionDataManager)
    {
        this._sessionDataManager = manager;
    }

    public get roomSessionManager(): IRoomSessionManager
    {
        return this._roomSessionManager;
    }

    public set roomSessionManager(manager: IRoomSessionManager)
    {
        this._roomSessionManager = manager;
    }

    public get roomManager(): IRoomManager
    {
        return this._roomManager;
    }

    public set roomManager(manager: IRoomManager)
    {
        this._roomManager = manager;
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

    public get ready(): boolean
    {
        return this._ready;
    }

    public get _Str_6374(): boolean
    {
        return this._Str_3688;
    }

    public set _Str_6374(flag: boolean)
    {
        this._Str_3688 = flag;
    }

    public get isDecorating(): boolean
    {
        if(!this._roomSessionManager) return false;

        const session = this._roomSessionManager.getSession(this._activeRoomId);

        return (session && session.isDecorating) || false;
    }

    private get _Str_11555(): boolean
    {
        return true;
    }

    public get selectedAvatarId(): number
    {
        if(!this._roomObjectEventHandler) return -1;

        return this._roomObjectEventHandler.selectedAvatarId;
    }
}