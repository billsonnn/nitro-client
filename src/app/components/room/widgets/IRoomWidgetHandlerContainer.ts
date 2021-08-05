import { NitroRectangle } from '@nitrots/nitro-renderer/src';
import { IConnection } from '@nitrots/nitro-renderer/src/core/communication/connections/IConnection';
import { IEventDispatcher } from '@nitrots/nitro-renderer/src/core/events/IEventDispatcher';
import { IAvatarRenderManager } from '@nitrots/nitro-renderer/src/nitro/avatar/IAvatarRenderManager';
import { IRoomEngine } from '@nitrots/nitro-renderer/src/nitro/room/IRoomEngine';
import { IRoomSession } from '@nitrots/nitro-renderer/src/nitro/session/IRoomSession';
import { IRoomSessionManager } from '@nitrots/nitro-renderer/src/nitro/session/IRoomSessionManager';
import { ISessionDataManager } from '@nitrots/nitro-renderer/src/nitro/session/ISessionDataManager';
import { IRoomObject } from '@nitrots/nitro-renderer/src/room/object/IRoomObject';
import { RoomWidgetMessage } from './RoomWidgetMessage';
import { RoomWidgetUpdateEvent } from './RoomWidgetUpdateEvent';

export interface IRoomWidgetHandlerContainer
{
    getFirstCanvasId(): number;
    getRoomViewRect(): NitroRectangle;
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
