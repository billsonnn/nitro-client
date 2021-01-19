import { Rectangle } from 'pixi.js';
import { FriendListService } from '../../../app/components/friendlist/services/friendlist.service';
import { NotificationService } from '../../../app/components/notification/services/notification.service';
import { WiredService } from '../../../app/components/wired/services/wired.service';
import { IConnection } from '../../core/communication/connections/IConnection';
import { IEventDispatcher } from '../../core/events/IEventDispatcher';
import { IRoomObject } from '../../room/object/IRoomObject';
import { IAvatarRenderManager } from '../avatar/IAvatarRenderManager';
import { IRoomEngine } from '../room/IRoomEngine';
import { IRoomSession } from '../session/IRoomSession';
import { IRoomSessionManager } from '../session/IRoomSessionManager';
import { ISessionDataManager } from '../session/ISessionDataManager';

export interface IRoomWidgetHandlerContainer
{
    getFirstCanvasId(): number;
    getRoomViewRect(): Rectangle;
    checkFurniManipulationRights(roomId: number, objectId: number, category: number): boolean;
    isOwnerOfFurniture(roomObject: IRoomObject): boolean;
    events: IEventDispatcher;
    connection: IConnection;
    roomEngine: IRoomEngine;
    avatarRenderManager: IAvatarRenderManager;
    roomSession: IRoomSession;
    roomSessionManager: IRoomSessionManager;
    sessionDataManager: ISessionDataManager;
    notificationService: NotificationService;
    wiredService: WiredService;
    friendService: FriendListService;
}