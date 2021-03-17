import { NitroEvent } from 'nitro-renderer/src/core/events/NitroEvent';
import { IVector3D } from 'nitro-renderer/src/room/utils/IVector3D';

export class RoomPreviewAddFurnitureEvent extends NitroEvent
{
    private _classId: number;
    private _direction: IVector3D;

    constructor(type: string, classId: number, direction: IVector3D)
    {
        super(type);

        this._classId   = classId;
        this._direction = direction;
    }

    public get classId(): number
    {
        return this._classId;
    }

    public get direction(): IVector3D
    {
        return this._direction;
    }
}
