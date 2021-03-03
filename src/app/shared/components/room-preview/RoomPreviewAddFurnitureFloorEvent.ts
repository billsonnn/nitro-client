import { IObjectData } from '../../../../client/nitro/room/object/data/IObjectData';
import { IVector3D } from '../../../../client/room/utils/IVector3D';
import { RoomPreviewAddFurnitureEvent } from './RoomPreviewAddFurnitureEvent';

export class RoomPreviewAddFurnitureFloorEvent extends RoomPreviewAddFurnitureEvent
{
    public static ADD_FURNITURE: string = 'RPAFFE_ADD_FURNITURE';

    private _objectData: IObjectData;
    private _extras: string;

    constructor(classId: number, direction: IVector3D, objectData: IObjectData = null, extras: string = null)
    {
        super(RoomPreviewAddFurnitureFloorEvent.ADD_FURNITURE, classId, direction);

        this._objectData    = objectData;
        this._extras        = extras;
    }

    public get objectData(): IObjectData
    {
        return this._objectData;
    }

    public get extras(): string
    {
        return this._extras;
    }
}