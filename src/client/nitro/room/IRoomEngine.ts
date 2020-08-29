import { INitroManager } from '../../core/common/INitroManager';
import { IRoomInstance } from '../../room/IRoomInstance';
import { IRoomManager } from '../../room/IRoomManager';
import { IRoomObjectController } from '../../room/object/IRoomObjectController';
import { IRoomObjectLogicFactory } from '../../room/object/logic/IRoomObjectLogicFactory';
import { IRoomObjectVisualizationFactory } from '../../room/object/visualization/IRoomObjectVisualizationFactory';
import { IRoomRendererFactory } from '../../room/renderer/IRoomRendererFactory';
import { IRoomRenderingCanvas } from '../../room/renderer/IRoomRenderingCanvas';
import { IRoomGeometry } from '../../room/utils/IRoomGeometry';
import { IVector3D } from '../../room/utils/IVector3D';
import { PetCustomPart } from '../avatar/pets/PetCustomPart';
import { IRoomSessionManager } from '../session/IRoomSessionManager';
import { ISessionDataManager } from '../session/ISessionDataManager';
import { IGetImageListener } from './IGetImageListener';
import { ImageResult } from './ImageResult';
import { IObjectData } from './object/data/IObjectData';
import { RoomMapData } from './object/RoomMapData';
import { RoomObjectEventHandler } from './RoomObjectEventHandler';

export interface IRoomEngine extends INitroManager
{
    setActiveRoomId(roomId: number): void;
    onRoomEngineInitalized(flag: boolean): void;
    disableUpdate(flag: boolean): void;
    runUpdate(): void;
    createRoomInstance(roomId: number, roomMap: RoomMapData): IRoomInstance;
    getRoomInstanceDisplay(roomId: number, id: number, width: number, height: number, scale: number): PIXI.DisplayObject;
    setRoomInstanceRenderingCanvasScale(roomId: number, canvasId: number, scale: number, point?: PIXI.Point, offsetPoint?: PIXI.Point): void;
    setRoomInstanceRenderingCanvasMask(roomId: number, canvasId: number, flag: boolean): void;
    getRoomInstanceRenderingCanvas(roomId: number, canvasId?: number): IRoomRenderingCanvas;
    getRoomInstanceRenderingCanvasOffset(roomId: number, canvasId?: number): PIXI.Point;
    setRoomInstanceRenderingCanvasOffset(roomId: number, canvasId: number, point: PIXI.Point): boolean;
    getRoomInstanceRenderingCanvasScale(roomId?: number, canvasId?: number): number;
    initializeRoomInstanceRenderingCanvas(roomId: number, canvasId: number, width: number, height: number): void;
    updateRoomInstancePlaneVisibility(roomId: number, wallVisible: boolean, floorVisible?: boolean): boolean;
    updateRoomInstancePlaneThickness(roomId: number, wallThickness: number, floorThickness: number): boolean;
    updateRoomInstancePlaneType(roomId: number, floorType?: string, wallType?: string, landscapeType?: string, _arg_5?: boolean): boolean;
    getRoomInstanceGeometry(roomId: number, canvasId?: number): IRoomGeometry;
    getRoomInstanceNumber(roomId: number, key: string): number;
    getTotalObjectsForManager(roomId: number, category: number): number;
    getRoomObject(roomId: number, objectId: number, category: number): IRoomObjectController;
    getRoomObjectByIndex(roomId: number, index: number, category: number): IRoomObjectController;
    removeRoomObjectFloor(roomId: number, objectId: number, userId?: number, _arg_4?: boolean): void;
    removeRoomObjectWall(roomId: number, objectId: number, userId?: number): void;
    removeRoomObjectUser(roomId: number, objectId: number): void;
    getRoomObjectBoundingRectangle(roomId: number, objectId: number, category: number, canvasId: number): PIXI.Rectangle;
    getRoomObjectScreenLocation(roomId: number, objectId: number, objectType: number, canvasId?: number): PIXI.Point;
    getGenericRoomObjectImage(type: string, value: string, direction: IVector3D, scale: number, listener: IGetImageListener, bgColor?: number, extras?: string, objectData?: IObjectData, state?: number, frameCount?: number, posture?: string, originalId?: number): ImageResult;
    updateRoomObjectWallLocation(roomId: number, objectId: number, location: IVector3D): boolean;
    addRoomObjectUser(roomId: number, objectId: number, location: IVector3D, direction: IVector3D, headDirection: number, type: number, figure: string): boolean;
    updateRoomObjectUserLocation(roomId: number, objectId: number, location: IVector3D, targetLocation: IVector3D, canStandUp?: boolean, baseY?: number, direction?: IVector3D, headDirection?: number): boolean;
    addFurnitureFloor(roomId: number, id: number, typeId: number, location: IVector3D, direction: IVector3D, state: number, objectData: IObjectData, extra?: number, expires?: number, usagePolicy?: number, ownerId?: number, ownerName?: string, synchronized?: boolean, realRoomObject?: boolean, sizeZ?: number): boolean;
    addFurnitureWall(roomId: number, id: number, typeId: number, location: IVector3D, direction: IVector3D, state: number, extra: string, expires?: number, usagePolicy?: number, ownerId?: number, ownerName?: string, realRoomObject?: boolean): boolean;
    initalizeTemporaryObjectsByType(type: string, _arg_2: boolean): void;
    updateRoomObjectUserAction(roomId: number, objectId: number, action: string, value: number, parameter?: string): boolean;
    updateRoomObjectUserFigure(roomId: number, objectId: number, figure: string, gender?: string, subType?: string, isRiding?: boolean): boolean;
    updateRoomObjectUserEffect(roomId: number, objectId: number, effectId: number, delay?: number): boolean;
    updateRoomObjectUserGesture(roomId: number, objectId: number, gestureId: number): boolean;
    updateRoomObjectUserPosture(roomId: number, objectId: number, type: string, parameter?: string): boolean;
    getRoomObjectImage(roomId: number, objectId: number, category: number, direction: IVector3D, scale: number, listener: IGetImageListener, bgColor?: number): ImageResult;
    getRoomObjectPetImage(typeId: number, paletteId: number, color: number, direction: IVector3D, scale: number, listener: IGetImageListener, _arg_7?: boolean, bgColor?: number, customParts?: PetCustomPart[], posture?: string): ImageResult;
    selectRoomObject(roomId: number, objectId: number, objectCategory: number): void;
    useRoomObject(objectId: number, category: number): boolean;
    objectInitialized(roomId: string, objectId: number, category: number): void;
    changeObjectState(roomId: number, objectId: number, category: number): void;
    processRoomObjectOperation(objectId: number, category: number, operation: string): boolean;
    dispatchMouseEvent(canvasId: number, x: number, y: number, type: string, altKey: boolean, ctrlKey: boolean, shiftKey: boolean, buttonDown: boolean): void;
    sessionDataManager: ISessionDataManager;
    roomSessionManager: IRoomSessionManager;
    roomManager: IRoomManager;
    objectEventHandler: RoomObjectEventHandler;
    roomRendererFactory: IRoomRendererFactory;
    visualizationFactory: IRoomObjectVisualizationFactory;
    logicFactory: IRoomObjectLogicFactory;
    activeRoomId: number;
    ready: boolean;
    disposed: boolean;
    selectedAvatarId: number;
    isDecorating: boolean;
}