import { IRoomInstance } from '../../room/IRoomInstance';
import { IRoomObjectController } from '../../room/object/IRoomObjectController';
import { IVector3D } from '../../room/utils/IVector3D';
import { IObjectData } from './object/data/IObjectData';
import { RoomMapData } from './object/RoomMapData';
import { FurnitureStackingHeightMap } from './utils/FurnitureStackingHeightMap';
import { LegacyWallGeometry } from './utils/LegacyWallGeometry';

export interface IRoomCreator
{
    destroyRoom(id: number): void;
    getRoomInstance(roomId: number): IRoomInstance;
    updateRoomInstancePlaneVisibility(roomId: number, wallVisible: boolean, floorVisible?: boolean): boolean;
    updateRoomInstancePlaneThickness(roomId: number, wallThickness: number, floorThickness: number): boolean;
    updateRoomInstancePlaneType(roomId: number, floorType?: string, wallType?: string, landscapeType?: string, _arg_5?: boolean): boolean;
    removeRoomInstance(roomId: number): void;
    createRoomInstance(roomId: number, roomMap: RoomMapData): IRoomInstance
    setRoomSessionOwnUser(roomId: number, objectId: number): void;
    setRoomInstanceModelName(roomId: number, name: string): void;
    getFurnitureStackingHeightMap(roomId: number): FurnitureStackingHeightMap;
    setFurnitureStackingHeightMap(roomId: number, heightMap: FurnitureStackingHeightMap): void;
    getLegacyWallGeometry(roomId: number): LegacyWallGeometry;
    getRoomObject(roomId: number, objectId: number, category: number): IRoomObjectController;
    getRoomObjectCursor(roomId: number): IRoomObjectController;
    getRoomObjectUser(roomId: number, objectId: number): IRoomObjectController;
    removeRoomObjectUser(roomId: number, objectId: number): void;
    getRoomObjectFloor(roomId: number, objectId: number): IRoomObjectController;
    addFurnitureFloor(roomId: number, id: number, typeId: number, location: IVector3D, direction: IVector3D, state: number, objectData: IObjectData, extra?: number, expires?: number, usagePolicy?: number, ownerId?: number, ownerName?: string, synchronized?: boolean, realRoomObject?: boolean, sizeZ?: number): void;
    addFurnitureWall(roomId: number, id: number, typeId: number, location: IVector3D, direction: IVector3D, state: number, extra: string, expires?: number, usagePolicy?: number, ownerId?: number, ownerName?: string, realRoomObject?: boolean): void;
    removeRoomObjectFloor(roomId: number, objectId: number): void;
    removeRoomObjectWall(roomId: number, objectId: number): void;
    updateRoomObjectFloor(roomId: number, objectId: number, location: IVector3D, direction: IVector3D, state: number, data: IObjectData, extra?: number): boolean;
    updateRoomObjectWall(roomId: number, objectId: number, location: IVector3D, direction: IVector3D, state: number, extra: string): boolean;
    updateRoomObjectFloorHeight(roomId: number, objectId: number, height: number): boolean;
    updateRoomObjectFloorExpiration(roomId: number, objectId: number, expires: number): boolean;
    updateRoomObjectWallExpiration(roomId: number, objectId: number, expires: number): boolean;
    rollRoomObjectFloor(roomId: number, objectId: number, location: IVector3D, targetLocation: IVector3D): void;
    addRoomObjectUser(roomId: number, objectId: number, location: IVector3D, direction: IVector3D, headDirection: number, type: number, figure: string): boolean;
    updateRoomObjectUserLocation(roomId: number, objectId: number, location: IVector3D, targetLocation: IVector3D, canStandUp?: boolean, baseY?: number, direction?: IVector3D, headDirection?: number): void;
    updateRoomObjectUserAction(roomId: number, objectId: number, action: string, value: number, parameter?: string): void;
    updateRoomObjectUserFigure(roomId: number, objectId: number, figure: string, gender: string): void;
    updateRoomObjectUserFlatControl(roomId: number, objectId: number, level: string): void;
    updateRoomObjectUserEffect(roomId: number, objectId: number, effectId: number, delay?: number): void;
    updateRoomObjectUserGesture(roomId: number, objectId: number, gestureId: number): void;
    updateRoomObjectUserPetGesture(roomId: number, objectId: number, gesture: string): void;
    updateRoomObjectUserPosture(roomId: number, objectId: number, type: string, parameter?: string): void;
    updateRoomObjectUserOwn(roomId: number, objectId: number): void;
}