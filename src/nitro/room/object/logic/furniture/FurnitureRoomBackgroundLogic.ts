import { IRoomObjectModel } from '../../../../../room/object/IRoomObjectModel';
import { RoomObjectLogicType } from '../../RoomObjectLogicType';
import { FurnitureRoomBrandingLogic } from './FurnitureRoomBrandingLogic';

export class FurnitureRoomBackgroundLogic extends FurnitureRoomBrandingLogic
{
    public static TYPE: string = RoomObjectLogicType.FURNITURE_BG;

    protected getAdClickUrl(model: IRoomObjectModel): string
    {
        return null;
    }
}