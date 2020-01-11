import { INitroManager } from '../../core/common/INitroManager';
import { INitroCommunicationManager } from '../communication/INitroCommunicationManager';
import { FurnitureData } from './furniture/FurnitureData';

export interface ISessionDataManager extends INitroManager
{
    getFloorItemData(id: number): FurnitureData;
    getFloorItemDataByName(name: string): FurnitureData;
    getWallItemData(id: number): FurnitureData;
    getWallItemDataByName(name: string): FurnitureData;
    communication: INitroCommunicationManager;
    userId: number;
    userName: string;
    figure: string;
    gender: string;
}