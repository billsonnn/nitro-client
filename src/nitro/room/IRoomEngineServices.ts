import { IConnection } from '../../core/communication/connections/IConnection';
import { IEventDispatcher } from '../../core/events/IEventDispatcher';
import { IRoomObjectController } from '../../room/object/IRoomObjectController';
import { IRoomSessionManager } from '../session/IRoomSessionManager';
import { SelectedRoomObjectData } from './utils/SelectedRoomObjectData';

export interface IRoomEngineServices
{
    getSelectedRoomObjectData(roomId: number): SelectedRoomObjectData;
    setSelectedRoomObjectData(roomId: number, data: SelectedRoomObjectData): void;
    getRoomObject(roomId: number, objectId: number, category: number): IRoomObjectController;
    getTileCursorObject(roomId: number): IRoomObjectController;
    connection: IConnection;
    roomSession: IRoomSessionManager;
    activeRoomId: number;
    events: IEventDispatcher;
}