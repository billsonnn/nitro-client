import { INitroManager } from '../core/common/INitroManager';
import { IEventDispatcher } from '../core/events/IEventDispatcher';
import { INitroCore } from '../core/INitroCore';
import { INitroRenderer } from '../core/renderer/INitroRenderer';
import { IRoomManager } from '../room/IRoomManager';
import { AvatarManager } from './avatar/AvatarManager';
import { INitroCommunicationManager } from './communication/INitroCommunicationManager';
import { INitroNavigator } from './navigator/INitroNavigator';
import { IRoomEngine } from './room/IRoomEngine';
import { IRoomSessionManager } from './session/IRoomSessionManager';
import { ISessionDataManager } from './session/ISessionDataManager';

export interface INitroInstance extends INitroManager
{
    core: INitroCore;
    events: IEventDispatcher;
    communication: INitroCommunicationManager;
    avatar: AvatarManager;
    roomEngine: IRoomEngine;
    session: ISessionDataManager;
    roomSession: IRoomSessionManager;
    roomManager: IRoomManager;
    navigator: INitroNavigator;
    renderer: INitroRenderer;
}