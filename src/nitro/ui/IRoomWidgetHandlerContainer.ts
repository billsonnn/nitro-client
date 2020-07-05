import { IRoomSession } from 'nitro/session/IRoomSession';
import { IConnection } from '../../core/communication/connections/IConnection';
import { IEventDispatcher } from '../../core/events/IEventDispatcher';
import { IRoomObject } from '../../room/object/IRoomObject';
import { IAvatarRenderManager } from '../avatar/IAvatarRenderManager';
import { IRoomEngine } from '../room/IRoomEngine';
import { IRoomSessionManager } from '../session/IRoomSessionManager';
import { ISessionDataManager } from '../session/ISessionDataManager';

export interface IRoomWidgetHandlerContainer
{
    getFirstCanvasId(): number;
    getRoomViewRect(): PIXI.Rectangle;
    checkFurniManipulationRights(roomId: number, objectId: number, category: number): boolean;
    isOwnerOfFurniture(roomObject: IRoomObject): boolean;
    events: IEventDispatcher;
    connection: IConnection;
    roomEngine: IRoomEngine;
    avatarRenderManager: IAvatarRenderManager;
    roomSession: IRoomSession;
    roomSessionManager: IRoomSessionManager;
    sessionDataManager: ISessionDataManager;
}