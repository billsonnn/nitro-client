import { IConnection } from '../../core/communication/connections/IConnection';
import { IRoomObjectController } from '../../room/object/IRoomObjectController';
import { IRoomSessionManager } from '../session/IRoomSessionManager';
import { SelectedRoomObjectData } from './utils/SelectedRoomObjectData';

export interface IRoomEngineServices
{
    getSelectedRoomObjectData(roomId: number): SelectedRoomObjectData;
    getTileCursorObject(roomId: number): IRoomObjectController;
    connection: IConnection;
    roomSession: IRoomSessionManager;
    activeRoomId: number;
}