import { IDisposable } from '../../../core/common/disposable/IDisposable';
import { RoomObjectEventHandler } from '../../../nitro/room/RoomObjectEventHandler';
import { RoomObjectMouseEvent } from '../../events/RoomObjectMouseEvent';
import { RoomObjectUpdateMessage } from '../../messages/RoomObjectUpdateMessage';
import { IRoomObjectController } from '../IRoomObjectController';

export interface IRoomObjectLogic extends IDisposable
{
    initialize(...args: any[]): void;
    update(totalTimeRunning: number): void;
    processUpdateMessage(message: RoomObjectUpdateMessage): void;
    mouseEvent(event: RoomObjectMouseEvent): void;
    useObject(): void;
    setObject(object: IRoomObjectController): void;
    setEventHandler(eventHandler: RoomObjectEventHandler): void;
    object: IRoomObjectController;
    eventHandler: RoomObjectEventHandler;
}