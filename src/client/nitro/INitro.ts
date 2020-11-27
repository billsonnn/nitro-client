import { Application } from 'pixi.js';
import { IEventDispatcher } from '../core/events/IEventDispatcher';
import { INitroCore } from '../core/INitroCore';
import { NitroTimer } from '../core/utils/NitroTimer';
import { IRoomManager } from '../room/IRoomManager';
import { IAvatarRenderManager } from './avatar/IAvatarRenderManager';
import { INitroCommunicationManager } from './communication/INitroCommunicationManager';
import { INitroLocalizationManager } from './localization/INitroLocalizationManager';
import { IRoomEngine } from './room/IRoomEngine';
import { IRoomSessionManager } from './session/IRoomSessionManager';
import { ISessionDataManager } from './session/ISessionDataManager';

export interface INitro extends Application
{
    init(): void;
    dispose(): void;
    getConfiguration<T>(key: string, value?: T): T;
    getLocalization(key: string, replacements?: { [index: string]: any }): string;
    nitroTimer: NitroTimer;
    core: INitroCore;
    events: IEventDispatcher;
    localization: INitroLocalizationManager;
    communication: INitroCommunicationManager;
    avatar: IAvatarRenderManager;
    roomEngine: IRoomEngine;
    sessionDataManager: ISessionDataManager;
    roomSessionManager: IRoomSessionManager;
    roomManager: IRoomManager;
    width: number;
    height: number;
    time: number;
    isReady: boolean;
    isDisposed: boolean;
}