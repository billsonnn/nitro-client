import { IRoomInstance } from '../../room/IRoomInstance';
import { IRoomObject } from '../../room/object/IRoomObject';
import { IRoomObjectController } from '../../room/object/IRoomObjectController';
import { Position } from '../../room/utils/Position';
import { RoomModelParser } from '../communication/messages/parser/room/mapping/RoomModelParser';
import { IRoomSessionManager } from '../session/IRoomSessionManager';
import { IObjectData } from './object/data/IObjectData';

export interface IRoomCreator
{
    destroyRoom(id: number): void;
    getRoomInstance(roomId: number): IRoomInstance;
    removeRoomInstance(roomId: number): void;
    createRoomInstance(roomId: number): IRoomInstance;
    initializeRoomInstance(roomId: number, model: RoomModelParser): void;
    setRoomInstanceModelName(roomId: number, name: string): void;
    addRoomObjects(...objects: IRoomObject[]): void;
    getRoomObject(roomId: number, objectId: number, category: number): IRoomObjectController;
    getTileCursorObject(roomId: number): IRoomObjectController;
    getRoomUnitObject(roomId: number, objectId: number): IRoomObjectController;
    removeRoomUnitObject(roomId: number, objectId: number): void;
    getRoomFurnitureObject(roomId: number, objectId: number): IRoomObjectController;
    removeRoomFurnitureObject(roomId: number, objectId: number): void;
    updateRoomFurnitureObject(roomId: number, objectId: number, fromPosition: Position, toPosition: Position, state: number, data?: IObjectData): void;
    rollRoomFurnitureObject(roomId: number, objectId: number, fromPosition: Position, toPosition: Position): void;
    addRoomUnit(roomId: number, objectId: number, position: Position, type: string, figure: string, gender: string): boolean;
    updateRoomUnitLocation(roomId: number, objectId: number, fromPosition: Position, toPosition: Position, isSlide?: boolean, headDirection?: number): void;
    updateRoomUnitAction(roomId: number, objectId: number, action: string, value: number, parameter?: string): void;
    updateRoomUnitFigure(roomId: number, objectId: number, figure: string, gender: string): void;
    updateRoomUnitFlatControl(roomId: number, objectId: number, level: string): void;
    updateRoomUnitEffect(roomId: number, objectId: number, effectId: number, delay?: number): void
    updateRoomUnitPosture(roomId: number, objectId: number, type: string, parameter?: string): void;
    roomSession: IRoomSessionManager;
}