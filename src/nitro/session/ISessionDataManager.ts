import { INitroManager } from '../../core/common/INitroManager';
import { INitroCommunicationManager } from '../communication/INitroCommunicationManager';
import { IFurnitureData } from './furniture/IFurnitureData';
import { IFurnitureDataListener } from './furniture/IFurnitureDataListener';

export interface ISessionDataManager extends INitroManager
{
    getAllFurnitureData(listener: IFurnitureDataListener): IFurnitureData[];
    removePendingFurniDataListener(listener: IFurnitureDataListener): void;
    getFloorItemData(id: number): IFurnitureData;
    getFloorItemDataByName(name: string): IFurnitureData;
    getWallItemData(id: number): IFurnitureData;
    getWallItemDataByName(name: string): IFurnitureData;
    getBadgeImage(name: string): PIXI.Texture;
    loadBadgeImage(name: string): string;
    getGroupBadgeImage(name: string): PIXI.Texture;
    loadGroupBadgeImage(name: string): string;
    hasSecurity(level: number): boolean;
    giveRespect(userId: number): void;
    givePetRespect(petId: number): void;
    communication: INitroCommunicationManager;
    userId: number;
    userName: string;
    figure: string;
    gender: string;
    isModerator: boolean;
}