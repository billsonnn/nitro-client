import { IVector3D } from '../../../../client/room/utils/IVector3D';
import { RoomPreviewAddFurnitureEvent } from './RoomPreviewAddFurnitureEvent';

export class RoomPreviewAddFurnitureWallEvent extends RoomPreviewAddFurnitureEvent
{
    public static ADD_FURNITURE: string = 'RPAFWE_ADD_FURNITURE';

    private _objectData: string;

    constructor(classId: number, direction: IVector3D, objectData: string = null)
    {
        super(RoomPreviewAddFurnitureWallEvent.ADD_FURNITURE, classId, direction);

        this._objectData = objectData;
    }

    public get objectData(): string
    {
        return this._objectData;
    }
}