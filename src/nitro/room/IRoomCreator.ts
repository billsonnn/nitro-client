import { IRoomInstance } from '../../room/IRoomInstance';
import { IRoomObject } from '../../room/object/IRoomObject';
import { IRoomObjectController } from '../../room/object/IRoomObjectController';
import { IVector3D } from '../../room/utils/IVector3D';
import { RoomModelParser } from '../communication/messages/parser/room/mapping/RoomModelParser';
import { IRoomSessionManager } from '../session/IRoomSessionManager';
import { IObjectData } from './object/data/IObjectData';
import { FurnitureStackingHeightMap } from './utils/FurnitureStackingHeightMap';
import { LegacyWallGeometry } from './utils/LegacyWallGeometry';

export interface IRoomCreator
{
    destroyRoom(id: number): void;
    getRoomInstance(roomId: number): IRoomInstance;
    removeRoomInstance(roomId: number): void;
    createRoomInstance(roomId: number): IRoomInstance;
    initializeRoomInstance(roomId: number, model: RoomModelParser): void;
    setRoomInstanceModelName(roomId: number, name: string): void;
    getFurnitureStackingHeightMap(roomId: number): FurnitureStackingHeightMap;
    setFurnitureStackingHeightMap(roomId: number, heightMap: FurnitureStackingHeightMap): void;
    getLegacyWallGeometry(roomId: number): LegacyWallGeometry;
    addRoomObjects(...objects: IRoomObject[]): void;
    getRoomObject(roomId: number, objectId: number, category: number): IRoomObjectController;
    getTileCursorObject(roomId: number): IRoomObjectController;
    getRoomUnitObject(roomId: number, objectId: number): IRoomObjectController;
    removeRoomUnitObject(roomId: number, objectId: number): void;
    getRoomFurnitureObject(roomId: number, objectId: number): IRoomObjectController;
    removeRoomFurnitureObject(roomId: number, objectId: number): void;
    updateRoomFurnitureObject(roomId: number, objectId: number, location: IVector3D, direction: IVector3D, state: number, data: IObjectData, extra?: number): void;
    updateRoomFurnitureObjectHeight(roomId: number, objectId: number, height: number): void;
    rollRoomFurnitureObject(roomId: number, objectId: number, location: IVector3D, targetLocation: IVector3D): void;
    addRoomUnit(roomId: number, objectId: number, location: IVector3D, direction: IVector3D, type: string, figure: string, gender: string): boolean;
    updateRoomUnitLocation(roomId: number, objectId: number, location: IVector3D, targetLocation: IVector3D, canStandUp?: boolean, baseY?: number, direction?: IVector3D, headDirection?: number): void;
    updateRoomUnitAction(roomId: number, objectId: number, action: string, value: number, parameter?: string): void;
    updateRoomUnitFigure(roomId: number, objectId: number, figure: string, gender: string): void;
    updateRoomUnitFlatControl(roomId: number, objectId: number, level: string): void;
    updateRoomUnitEffect(roomId: number, objectId: number, effectId: number, delay?: number): void;
    updateRoomUnitGesture(roomId: number, objectId: number, gestureId: number): void;
    updateRoomUnitPosture(roomId: number, objectId: number, type: string, parameter?: string): void;
    updateRoomUnitOwnUser(roomId: number, objectId: number): void;
    roomSession: IRoomSessionManager;
}