import { IRoomObjectController } from '../../../room/object/IRoomObjectController';
import { RoomEngineEvent } from './RoomEngineEvent';

export class RoomEngineObjectEvent extends RoomEngineEvent
{
    public static SELECTED: string          = 'REOE_SELECTED';
    public static DESELECTED: string        = 'REOE_DESELECTED';
    public static ADDED: string             = 'REOE_ADDED';
    public static REMOVED: string           = 'REOE_REMOVED';
    public static PLACED: string            = 'REOE_PLACED';
    public static PLACED_ON_USER: string    = 'REOE_PLACED_ON_USER';
    public static CONTENT_UPDATED: string   = 'REOE_CONTENT_UPDATED';
    public static REQUEST_MOVE: string      = 'REOE_REQUEST_MOVE';
    public static REQUEST_ROTATE: string    = 'REOE_REQUEST_ROTATE';
    public static MOUSE_ENTER: string       = 'REOE_MOUSE_ENTER';
    public static MOUSE_LEAVE: string       = 'REOE_MOUSE_LEAVE';

    private _object: IRoomObjectController;

    constructor(type: string, roomId: number, object: IRoomObjectController)
    {
        super(type, roomId);

        this._object = object;
    }

    public get object(): IRoomObjectController
    {
        return this._object;
    }
}