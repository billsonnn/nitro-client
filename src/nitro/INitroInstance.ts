import { INitroManager } from '../core/common/INitroManager';
import { IEventDispatcher } from '../core/events/IEventDispatcher';
import { INitroCore } from '../core/INitroCore';
import { INitroRenderer } from '../core/renderer/INitroRenderer';
import { AvatarManager } from './avatar/AvatarManager';
import { INitroCommunicationManager } from './communication/INitroCommunicationManager';
import { INitroNavigator } from './navigator/INitroNavigator';
import { IRoomSessionManager } from './session/IRoomSessionManager';
import { ISessionDataManager } from './session/ISessionDataManager';

export interface INitroInstance extends INitroManager
{
    core: INitroCore;
    events: IEventDispatcher;
    communication: INitroCommunicationManager;
    avatar: AvatarManager;
    session: ISessionDataManager;
    roomSession: IRoomSessionManager;
    navigator: INitroNavigator;
    renderer: INitroRenderer;
}