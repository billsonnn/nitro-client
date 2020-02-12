import { IConnection } from '../../core/communication/connections/IConnection';
import { IEventDispatcher } from '../../core/events/IEventDispatcher';
import { IRoomObjectController } from '../../room/object/IRoomObjectController';
import { FurnitureStackingHeightMap } from './utils/FurnitureStackingHeightMap';
import { SelectedRoomObjectData } from './utils/SelectedRoomObjectData';

export interface IRoomEngineServices
{
    getSelectedRoomObjectData(roomId: number): SelectedRoomObjectData;
    setSelectedRoomObjectData(roomId: number, data: SelectedRoomObjectData): void;
    getFurnitureStackingHeightMap(roomId: number): FurnitureStackingHeightMap;
    getRoomObject(roomId: number, objectId: number, category: number): IRoomObjectController;
    getRoomObjectCategoryForType(type: string): number;
    getRoomObjectCursor(roomId: number): IRoomObjectController;
    connection: IConnection;
    activeRoomId: number;
    events: IEventDispatcher;
}