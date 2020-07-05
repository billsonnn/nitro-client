import { IConnection } from '../../core/communication/connections/IConnection';
import { IEventDispatcher } from '../../core/events/IEventDispatcher';
import { IRoomObjectController } from '../../room/object/IRoomObjectController';
import { IRoomRenderingCanvas } from '../../room/renderer/IRoomRenderingCanvas';
import { IRoomSessionManager } from '../session/IRoomSessionManager';
import { ISessionDataManager } from '../session/ISessionDataManager';
import { IObjectData } from './object/data/IObjectData';
import { FurnitureStackingHeightMap } from './utils/FurnitureStackingHeightMap';
import { LegacyWallGeometry } from './utils/LegacyWallGeometry';
import { SelectedRoomObjectData } from './utils/SelectedRoomObjectData';

export interface IRoomEngineServices
{
    getActiveRoomInstanceRenderingCanvas(): IRoomRenderingCanvas;
    addRoomInstanceFloorHole(roomId: number, objectId: number): void;
    removeRoomInstanceFloorHole(roomId: number, objectId: number): void;
    getSelectedRoomObjectData(roomId: number): SelectedRoomObjectData;
    setSelectedRoomObjectData(roomId: number, data: SelectedRoomObjectData): void;
    getLegacyWallGeometry(roomId: number): LegacyWallGeometry;
    getFurnitureStackingHeightMap(roomId: number): FurnitureStackingHeightMap;
    getRoomObject(roomId: number, objectId: number, category: number): IRoomObjectController;
    getRoomObjectByIndex(roomId: number, index: number, category: number): IRoomObjectController;
    getRoomObjectCategoryForType(type: string): number;
    getRoomObjectCursor(roomId: number): IRoomObjectController;
    getRoomObjectSelectionArrow(roomId: number): IRoomObjectController;
    loadRoomObjectBadgeImage(roomId: number, objectId: number, objectCategory: number, badgeId: string, groupBadge?: boolean): void;
    updateRoomObjectMask(roomId: number, objectId: number, _arg_?: boolean): void;
    _Str_16645(k: number, _arg_2: number, _arg_3: boolean, _arg_4?: string, _arg_5?: IObjectData, _arg_6?: number, _arg_7?: number, _arg_8?: string): void
    _Str_7972(k: boolean): void;
    updateMousePointer(type: string, objectId: number, objectType: string): void;
    _Str_17948(): void;
    connection: IConnection;
    sessionData: ISessionDataManager;
    roomSession: IRoomSessionManager;
    activeRoomId: number;
    events: IEventDispatcher;
    _Str_6374: boolean;
    isDecorating: boolean;
}