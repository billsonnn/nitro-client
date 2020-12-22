import { Application } from 'pixi.js';
import { IEventDispatcher } from '../core/events/IEventDispatcher';
import { ILinkEventTracker } from '../core/events/ILinkEventTracker';
import { INitroCore } from '../core/INitroCore';
import { NitroTimer } from '../core/utils/NitroTimer';
import { IRoomManager } from '../room/IRoomManager';
import { IAvatarRenderManager } from './avatar/IAvatarRenderManager';
import { INitroCommunicationManager } from './communication/INitroCommunicationManager';
import { ILegacyExternalInterface } from './externalInterface/ILegacyExternalInterface';
import { INitroLocalizationManager } from './localization/INitroLocalizationManager';
import { IRoomEngine } from './room/IRoomEngine';
import { IRoomSessionManager } from './session/IRoomSessionManager';
import { ISessionDataManager } from './session/ISessionDataManager';

export interface INitro extends Application
{
    init(): void;
    dispose(): void;
    getConfiguration<T>(key: string, value?: T): T;
    getLocalization(key: string): string;
    getLocalizationWithParameter(key: string, parameter: string, replacement: string): string;
    addLinkEventTracker(tracker: ILinkEventTracker): void;
    removeLinkEventTracker(tracker: ILinkEventTracker): void;
    createLinkEvent(link: string): void;
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
    externalInterface: ILegacyExternalInterface;
    width: number;
    height: number;
    time: number;
    isReady: boolean;
    isDisposed: boolean;
}