import * as PIXI from 'pixi.js-legacy';
import { IEventDispatcher } from '../../core/events/IEventDispatcher';
import { IRoomManager } from '../../room/IRoomManager';
import { IRoomObjectController } from '../../room/object/IRoomObjectController';
import { IRoomObjectLogicFactory } from '../../room/object/logic/IRoomObjectLogicFactory';
import { IRoomObjectVisualizationFactory } from '../../room/object/visualization/IRoomObjectVisualizationFactory';
import { IRoomRendererFactory } from '../../room/renderer/IRoomRendererFactory';
import { IRoomRenderingCanvas } from '../../room/renderer/IRoomRenderingCanvas';
import { IRoomGeometry } from '../../room/utils/IRoomGeometry';
import { IRoomSessionManager } from '../session/IRoomSessionManager';
import { ISessionDataManager } from '../session/ISessionDataManager';
import { RoomObjectEventHandler } from './RoomObjectEventHandler';

export interface IRoomEngine
{
    initialize(sessionData: ISessionDataManager, roomSession: IRoomSessionManager, roomManager: IRoomManager): void;
    dispose(): void;
    setActiveRoomId(roomId: number): void;
    onRoomEngineInitalized(flag: boolean): void;
    getRoomInstanceDisplay(roomId: number, id: number, width: number, height: number, scale: number): PIXI.DisplayObject;
    setRoomRenderingCanvasScale(roomId: number, canvasId: number, scale: number): void;
    getRoomInstanceRenderingCanvas(roomId: number, canvasId?: number): IRoomRenderingCanvas;
    getRoomInstanceRenderingCanvasOffset(roomId: number, canvasId?: number): PIXI.Point;
    initializeRoomInstanceRenderingCanvas(roomId: number, canvasId: number, width: number, height: number): void;
    getRoomInstanceGeometry(roomId: number, canvasId?: number): IRoomGeometry;
    getRoomInstanceNumber(roomId: number, key: string): number;
    getTotalObjectsForManager(roomId: number, category: number): number;
    getRoomObject(roomId: number, objectId: number, category: number): IRoomObjectController;
    getRoomObjectBoundingRectangle(roomId: number, objectId: number, category: number, canvasId: number): PIXI.Rectangle;
    getRoomObjectScreenLocation(roomId: number, objectId: number, objectType: number, canvasId?: number): PIXI.Point;
    refreshRoomObjectFurnitureData(roomId: string, objectId: number, category: number): void;
    processRoomObjectOperation(objectId: number, category: number, operation: string): boolean;
    dispatchMouseEvent(canvasId: number, x: number, y: number, type: string, altKey: boolean, ctrlKey: boolean, shiftKey: boolean, buttonDown: boolean): void;
    events: IEventDispatcher;
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