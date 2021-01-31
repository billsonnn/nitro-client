import { Texture } from 'pixi.js';
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
    getBadgeUrl(name: string): string;
    getGroupBadgeUrl(name: string): string;
    getBadgeImage(name: string): Texture;
    loadBadgeImage(name: string): string;
    getGroupBadgeImage(name: string): Texture;
    loadGroupBadgeImage(name: string): string;
    isUserIgnored(userName: string): boolean;
    hasSecurity(level: number): boolean;
    giveRespect(userId: number): void;
    givePetRespect(petId: number): void;
    sendSpecialCommandMessage(text: string, styleId?: number): void;
    communication: INitroCommunicationManager;
    userId: number;
    userName: string;
    figure: string;
    gender: string;
    isGodMode: boolean;
    realName: string;
    respectsReceived: number;
    respectsLeft: number;
    respectsPetLeft: number;
    canChangeName: boolean;
    clubLevel: number;
    securityLevel: number;
    isAmbassador: boolean;
    isSystemOpen: boolean;
    isSystemShutdown: boolean;
    isAuthenticHabbo: boolean;
    isModerator: boolean;
    isCameraFollowDisabled: boolean;
    uiFlags: number;
}
