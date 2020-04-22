import { INitroManager } from '../../core/common/INitroManager';
import { INitroCommunicationManager } from '../communication/INitroCommunicationManager';
import { FurnitureData } from './furniture/FurnitureData';
import { IFurnitureDataListener } from './furniture/IFurnitureDataListener';

export interface ISessionDataManager extends INitroManager
{
    getAllFurnitureData(listener: IFurnitureDataListener): FurnitureData[];
    removePendingFurniDataListener(listener: IFurnitureDataListener): void;
    getFloorItemData(id: number): FurnitureData;
    getFloorItemDataByName(name: string): FurnitureData;
    getWallItemData(id: number): FurnitureData;
    getWallItemDataByName(name: string): FurnitureData;
    hasSecurity(level: number): boolean;
    communication: INitroCommunicationManager;
    userId: number;
    userName: string;
    figure: string;
    gender: string;
    isModerator: boolean;
}