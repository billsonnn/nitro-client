import { IRoomInstance } from '../../room/IRoomInstance';
import { RoomModelParser } from '../communication/messages/parser/room/mapping/RoomModelParser';
import { IRoomSessionManager } from '../session/IRoomSessionManager';

export interface IRoomCreator
{
    getRoomInstance(roomId: number): IRoomInstance;
    removeRoomInstance(roomId: number): void;
    destroyRoom(id: number): void;
    createRoomInstance(roomId: number): IRoomInstance;
    initializeRoomInstance(roomId: number, model: RoomModelParser): void;
    roomSession: IRoomSessionManager;
}