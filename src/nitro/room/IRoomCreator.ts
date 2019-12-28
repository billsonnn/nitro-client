import { IRoomInstance } from '../../room/IRoomInstance';
import { IRoomObject } from '../../room/object/IRoomObject';
import { IRoomObjectController } from '../../room/object/IRoomObjectController';
import { Position } from '../../room/utils/Position';
import { RoomModelParser } from '../communication/messages/parser/room/mapping/RoomModelParser';
import { IRoomSessionManager } from '../session/IRoomSessionManager';
import { IObjectData } from './object/data/IObjectData';

export interface IRoomCreator
{
    getRoomInstance(roomId: number): IRoomInstance;
    removeRoomInstance(roomId: number): void;
    destroyRoom(id: number): void;
    createRoomInstance(roomId: number): IRoomInstance;
    initializeRoomInstance(roomId: number, model: RoomModelParser): void;
    addObjects(...objects: IRoomObject[]): void;
    getRoomUnitObject(roomId: number, objectId: number): IRoomObjectController;
    removeRoomUnitObject(roomId: number, objectId: number): void;
    getRoomFurnitureObject(roomId: number, objectId: number): IRoomObjectController;
    removeRoomFurnitureObject(roomId: number, objectId: number): void;
    updateRoomFurnitureObject(roomId: number, objectId: number, position: Position, state: number, data?: IObjectData): void;
    roomSession: IRoomSessionManager;
}