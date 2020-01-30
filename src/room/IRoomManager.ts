import { INitroManager } from '../core/common/INitroManager';
import { RoomContentLoader } from '../nitro/room/RoomContentLoader';
import { IRoomInstance } from './IRoomInstance';
import { IRoomObject } from './object/IRoomObject';

export interface IRoomManager extends INitroManager
{
    getRoomInstance(roomId: number): IRoomInstance;
    createRoomInstance(roomId: number): IRoomInstance;
    removeRoomInstance(roomId: number): boolean;
    addUpdateCategory(category: number): void;
    removeUpdateCategory(category: number): void;
    createRoomObjectAndInitalize(roomId: number, objectId: number, type: string, category: number): IRoomObject;
    setContentLoader(loader: RoomContentLoader): void;
    update(time: number): void;
    rooms: Map<number, IRoomInstance>
}