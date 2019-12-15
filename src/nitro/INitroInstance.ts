import { INitroManager } from '../core/common/INitroManager';
import { IEventDispatcher } from '../core/events/IEventDispatcher';
import { INitroCore } from '../core/INitroCore';
import { INitroRenderer } from '../core/renderer/INitroRenderer';
import { INitroCommunicationManager } from './communication/INitroCommunicationManager';
import { IRoomEngine } from './room/IRoomEngine';
import { IRoomSessionManager } from './session/IRoomSessionManager';
import { ISessionDataManager } from './session/ISessionDataManager';

export interface INitroInstance extends INitroManager
{
    core: INitroCore;
    communication: INitroCommunicationManager;
    roomEngine: IRoomEngine;
    session: ISessionDataManager;
    roomSession: IRoomSessionManager;
    renderer: INitroRenderer;
    events: IEventDispatcher;
}