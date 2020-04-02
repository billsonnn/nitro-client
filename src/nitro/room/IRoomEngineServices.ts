import { IConnection } from '../../core/communication/connections/IConnection';
import { IEventDispatcher } from '../../core/events/IEventDispatcher';
import { IRoomObjectController } from '../../room/object/IRoomObjectController';
import { IRoomRenderingCanvas } from '../../room/renderer/IRoomRenderingCanvas';
import { IRoomSessionManager } from '../session/IRoomSessionManager';
import { ISessionDataManager } from '../session/ISessionDataManager';
import { FurnitureStackingHeightMap } from './utils/FurnitureStackingHeightMap';
import { SelectedRoomObjectData } from './utils/SelectedRoomObjectData';

export interface IRoomEngineServices
{
    getActiveRoomInstanceRenderingCanvas(): IRoomRenderingCanvas;
    addRoomInstanceFloorHole(roomId: number, objectId: number): void;
    removeRoomInstanceFloorHole(roomId: number, objectId: number): void;
    getSelectedRoomObjectData(roomId: number): SelectedRoomObjectData;
    setSelectedRoomObjectData(roomId: number, data: SelectedRoomObjectData): void;
    getFurnitureStackingHeightMap(roomId: number): FurnitureStackingHeightMap;
    getRoomObject(roomId: number, objectId: number, category: number): IRoomObjectController;
    getRoomObjectCategoryForType(type: string): number;
    getRoomObjectCursor(roomId: number): IRoomObjectController;
    updateMousePointer(type: string, objectId: number, objectType: string): void;
    connection: IConnection;
    sessionData: ISessionDataManager;
    roomSession: IRoomSessionManager;
    activeRoomId: number;
    events: IEventDispatcher;
    _Str_6374: boolean;
    isDecorating: boolean;
}