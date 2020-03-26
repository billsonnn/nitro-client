import { INitroManager } from '../core/common/INitroManager';
import { IEventDispatcher } from '../core/events/IEventDispatcher';
import { INitroCore } from '../core/INitroCore';
import { INitroRenderer } from '../core/renderer/INitroRenderer';
import { IRoomManager } from '../room/IRoomManager';
import { IAvatarRenderManager } from './avatar/IAvatarRenderManager';
import { INitroCommunicationManager } from './communication/INitroCommunicationManager';
import { INitroNavigator } from './navigator/INitroNavigator';
import { IRoomEngine } from './room/IRoomEngine';
import { IRoomSessionManager } from './session/IRoomSessionManager';
import { ISessionDataManager } from './session/ISessionDataManager';
import { RoomUI } from './ui/RoomUI';

export interface INitroInstance extends INitroManager
{
    core: INitroCore;
    events: IEventDispatcher;
    communication: INitroCommunicationManager;
    avatar: IAvatarRenderManager;
    roomEngine: IRoomEngine;
    session: ISessionDataManager;
    roomSession: IRoomSessionManager;
    roomManager: IRoomManager;
    roomUI: RoomUI;
    navigator: INitroNavigator;
    renderer: INitroRenderer;
}