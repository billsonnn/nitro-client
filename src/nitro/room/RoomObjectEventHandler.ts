import { Disposable } from '../../core/common/disposable/Disposable';
import { IRoomEngineServices } from './IRoomEngineServices';

export class RoomObjectEventHandler extends Disposable
{
    private _roomEngine: IRoomEngineServices;

    constructor(roomEngine: IRoomEngineServices)
    {
        super();

        this._roomEngine = roomEngine;
    }
}