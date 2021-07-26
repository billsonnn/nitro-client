import { IConnection } from 'nitro-renderer/src/core/communication/connections/IConnection';
import { IEventDispatcher } from 'nitro-renderer/src/core/events/IEventDispatcher';
import { IAvatarRenderManager } from 'nitro-renderer/src/nitro/avatar/IAvatarRenderManager';
import { IRoomEngine } from 'nitro-renderer/src/nitro/room/IRoomEngine';
import { IRoomSession } from 'nitro-renderer/src/nitro/session/IRoomSession';
import { IRoomSessionManager } from 'nitro-renderer/src/nitro/session/IRoomSessionManager';
import { ISessionDataManager } from 'nitro-renderer/src/nitro/session/ISessionDataManager';
import { IRoomObject } from 'nitro-renderer/src/room/object/IRoomObject';
import { Rectangle } from 'pixi.js';
import { RoomWidgetMessage } from './RoomWidgetMessage';
import { RoomWidgetUpdateEvent } from './RoomWidgetUpdateEvent';

export interface IRoomWidgetHandlerContainer
{
    getFirstCanvasId(): number;
    getRoomViewRect(): Rectangle;
    checkFurniManipulationRights(roomId: number, objectId: number, category: number): boolean;
    isOwnerOfFurniture(roomObject: IRoomObject): boolean;
    processWidgetMessage(message: RoomWidgetMessage): RoomWidgetUpdateEvent;
    events: IEventDispatcher;
    connection: IConnection;
    roomEngine: IRoomEngine;
    avatarRenderManager: IAvatarRenderManager;
    roomSession: IRoomSession;
    roomSessionManager: IRoomSessionManager;
    sessionDataManager: ISessionDataManager;
}
