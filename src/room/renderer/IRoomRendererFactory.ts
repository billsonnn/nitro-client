import { RoomObjectEventHandler } from '../../nitro/room/RoomObjectEventHandler';
import { IRoomInstance } from '../IRoomInstance';
import { IRoomRenderer } from './IRoomRenderer';

export interface IRoomRendererFactory
{
    createRenderer(eventHandler: RoomObjectEventHandler, roomInstance: IRoomInstance): IRoomRenderer;
}