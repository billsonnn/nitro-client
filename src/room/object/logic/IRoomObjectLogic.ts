import { IDisposable } from '../../../core/common/disposable/IDisposable';
import { RoomObjectMouseEvent } from '../../events/RoomObjectMouseEvent';
import { RoomObjectUpdateMessage } from '../../messages/RoomObjectUpdateMessage';
import { IRoomObjectController } from '../IRoomObjectController';

export interface IRoomObjectLogic extends IDisposable
{
    initialize(...args: any[]): void;
    update(delta: number): void;
    processUpdateMessage(message: RoomObjectUpdateMessage): void;
    mouseEvent(event: RoomObjectMouseEvent): void;
    useObject(): void;
    setObject(object: IRoomObjectController): void;
    object: IRoomObjectController;
}