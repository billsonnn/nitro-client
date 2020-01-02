import { IConnection } from '../../core/communication/connections/IConnection';
import { IRoomObjectController } from '../../room/object/IRoomObjectController';
import { IRoomSessionManager } from '../session/IRoomSessionManager';

export interface IRoomEngineServices
{
    getTileCursorObject(roomId: number): IRoomObjectController;
    connection: IConnection;
    roomSession: IRoomSessionManager;
    activeRoomId: number;
}