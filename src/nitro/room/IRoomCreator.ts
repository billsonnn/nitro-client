import { IRoomInstance } from '../../room/IRoomInstance';
import { IRoomObject } from '../../room/object/IRoomObject';
import { IRoomObjectController } from '../../room/object/IRoomObjectController';
import { IVector3D } from '../../room/utils/IVector3D';
import { RoomModelParser } from '../communication/messages/parser/room/mapping/RoomModelParser';
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
    setRoomSessionOwnUser(roomId: number, objectId: number): void;
    setRoomInstanceModelName(roomId: number, name: string): void;
    getFurnitureStackingHeightMap(roomId: number): FurnitureStackingHeightMap;
    setFurnitureStackingHeightMap(roomId: number, heightMap: FurnitureStackingHeightMap): void;
    getLegacyWallGeometry(roomId: number): LegacyWallGeometry;
    addRoomObjects(...objects: IRoomObject[]): void;
    getRoomObject(roomId: number, objectId: number, category: number): IRoomObjectController;
    getRoomObjectCursor(roomId: number): IRoomObjectController;
    getRoomObjectUser(roomId: number, objectId: number): IRoomObjectController;
    removeRoomObjectUser(roomId: number, objectId: number): void;
    getRoomObjectFloor(roomId: number, objectId: number): IRoomObjectController;
    addFurniture(roomId: number, id: number, typeId: number, location: IVector3D, direction: IVector3D, state: number, objectData: IObjectData, extra?: number, expires?: number, usagePolicy?: number, ownerId?: number, ownerName?: string, synchronized?: boolean, realRoomObject?: boolean, sizeZ?: number): void
    removeRoomObjectFloor(roomId: number, objectId: number): void;
    updateRoomObjectFloor(roomId: number, objectId: number, location: IVector3D, direction: IVector3D, state: number, data: IObjectData, extra?: number): boolean;
    updateRoomObjectFloorHeight(roomId: number, objectId: number, height: number): boolean;
    rollRoomObjectFloor(roomId: number, objectId: number, location: IVector3D, targetLocation: IVector3D): void;
    addRoomObjectUser(roomId: number, objectId: number, location: IVector3D, direction: IVector3D, type: string, figure: string, gender: string): boolean;
    updateRoomObjectUserLocation(roomId: number, objectId: number, location: IVector3D, targetLocation: IVector3D, canStandUp?: boolean, baseY?: number, direction?: IVector3D, headDirection?: number): void;
    updateRoomObjectUserAction(roomId: number, objectId: number, action: string, value: number, parameter?: string): void;
    updateRoomObjectUserFigure(roomId: number, objectId: number, figure: string, gender: string): void;
    updateRoomObjectUserFlatControl(roomId: number, objectId: number, level: string): void;
    updateRoomObjectUserEffect(roomId: number, objectId: number, effectId: number, delay?: number): void;
    updateRoomObjectUserGesture(roomId: number, objectId: number, gestureId: number): void;
    updateRoomObjectUserPosture(roomId: number, objectId: number, type: string, parameter?: string): void;
    updateRoomObjectUserOwn(roomId: number, objectId: number): void;
}