import { IRoomInstance } from '../../room/IRoomInstance';
import { IRoomSessionManager } from '../session/IRoomSessionManager';
import { LegacyWallGeometry } from './utils/LegacyWallGeometry';

export interface IRoomCreator
{
    removeRoomInstance(roomId: number): void;
    destroyRoom(id: number): void;
    getWallGeometry(roomId: number): LegacyWallGeometry;
    createRoomInstance(roomId: number): IRoomInstance;
    roomSession: IRoomSessionManager;
}