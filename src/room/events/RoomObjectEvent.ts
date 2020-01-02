import { NitroEvent } from '../../core/events/NitroEvent';
import { IRoomObject } from '../object/IRoomObject';

export class RoomObjectEvent extends NitroEvent
{
    private _object: IRoomObject;

    constructor(type: string, object: IRoomObject)
    {
        super(type);

        this._object = object;
    }

    public get object(): IRoomObject
    {
        return this._object;
    }
}