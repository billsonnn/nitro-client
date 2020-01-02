import { RoomObjectEventHandler } from '../../nitro/room/RoomObjectEventHandler';
import { IRoomInstance } from '../IRoomInstance';
import { IRoomRenderer } from './IRoomRenderer';
import { IRoomRendererFactory } from './IRoomRendererFactory';
import { RoomRenderer } from './RoomRenderer';

export class RoomRendererFactory implements IRoomRendererFactory
{
    public createRenderer(eventHandler: RoomObjectEventHandler, roomInstance: IRoomInstance): IRoomRenderer
    {
        return new RoomRenderer(eventHandler, roomInstance);
    }
}