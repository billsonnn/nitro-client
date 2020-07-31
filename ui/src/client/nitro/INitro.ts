import { IEventDispatcher } from '../core/events/IEventDispatcher';
import { INitroCore } from '../core/INitroCore';
import { IRoomManager } from '../room/IRoomManager';
import { IAvatarRenderManager } from './avatar/IAvatarRenderManager';
import { INitroCatalog } from './catalog/INitroCatalog';
import { INitroCommunicationManager } from './communication/INitroCommunicationManager';
import { INitroInventory } from './inventory/INitroInventory';
import { INitroNavigator } from './navigator/INitroNavigator';
import { IRoomEngine } from './room/IRoomEngine';
import { IRoomSessionManager } from './session/IRoomSessionManager';
import { ISessionDataManager } from './session/ISessionDataManager';
import { INitroWindowManager } from './window/INitroWindowManager';

export interface INitro extends PIXI.Application
{
    init(): void;
    dispose(): void;
    resize(): void;
    core: INitroCore;
    events: IEventDispatcher;
    communication: INitroCommunicationManager;
    avatar: IAvatarRenderManager;
    windowManager: INitroWindowManager;
    roomEngine: IRoomEngine;
    sessionDataManager: ISessionDataManager;
    roomSessionManager: IRoomSessionManager;
    roomManager: IRoomManager;
    catalog: INitroCatalog;
    inventory: INitroInventory;
    navigator: INitroNavigator;
    time: number;
    isReady: boolean;
    isDisposed: boolean;
}