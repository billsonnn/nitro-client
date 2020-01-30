import * as PIXI from 'pixi.js-legacy';
import { IEventDispatcher } from '../../core/events/IEventDispatcher';
import { IRoomManager } from '../../room/IRoomManager';
import { IRoomObjectLogicFactory } from '../../room/object/logic/IRoomObjectLogicFactory';
import { IRoomObjectVisualizationFactory } from '../../room/object/visualization/IRoomObjectVisualizationFactory';
import { IRoomRendererFactory } from '../../room/renderer/IRoomRendererFactory';
import { IRoomSessionManager } from '../session/IRoomSessionManager';
import { ISessionDataManager } from '../session/ISessionDataManager';
import { RoomObjectEventHandler } from './RoomObjectEventHandler';

export interface IRoomEngine
{
    initialize(sessionData: ISessionDataManager, roomSession: IRoomSessionManager, roomManager: IRoomManager): void;
    dispose(): void;
    getRoomDisplay(roomId: number, id: number, width: number, height: number, scale: number): PIXI.DisplayObject;
    refreshRoomObjectFurnitureData(roomId: number, objectId: number, category: number): void;
    events: IEventDispatcher;
    objectEventHandler: RoomObjectEventHandler;
    roomRendererFactory: IRoomRendererFactory;
    visualizationFactory: IRoomObjectVisualizationFactory;
    logicFactory: IRoomObjectLogicFactory;
    activeRoomId: number;
    isReady: boolean;
    isDisposed: boolean;
}