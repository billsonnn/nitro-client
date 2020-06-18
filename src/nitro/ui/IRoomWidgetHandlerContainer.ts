import { IRoomSession } from 'nitro/session/IRoomSession';
import { IEventDispatcher } from '../../core/events/IEventDispatcher';
import { IAvatarRenderManager } from '../avatar/IAvatarRenderManager';
import { IRoomEngine } from '../room/IRoomEngine';

export interface IRoomWidgetHandlerContainer
{
    getFirstCanvasId(): number;
    events: IEventDispatcher;
    roomEngine: IRoomEngine;
    avatarRenderManager: IAvatarRenderManager;
    roomSession: IRoomSession;
}