import { IRoomObjectManager } from './IRoomObjectManager';
import { IRoomObjectController } from './object/IRoomObjectController';

export interface IRoomInstanceContainer
{
    initalizeObject(object: IRoomObjectController, ...args: any[]): IRoomObjectController;
    createRoomObjectManager(): IRoomObjectManager;
}