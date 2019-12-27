import { INitroManager } from '../core/common/INitroManager';
import { IRoomInstance } from './IRoomInstance';
import { IRoomObjectController } from './object/IRoomObjectController';

export interface IRoomManager extends INitroManager
{
    getRoomInstance(roomId: number): IRoomInstance;
    createRoomInstance(roomId: number): IRoomInstance;
    removeRoomInstance(roomId: number): boolean;
    initalizeObject(object: IRoomObjectController, ...args: any[]): IRoomObjectController;
}