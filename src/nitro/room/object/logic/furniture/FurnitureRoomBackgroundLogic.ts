import { IRoomObjectModel } from '../../../../../room/object/IRoomObjectModel';
import { ObjectLogicType } from '../ObjectLogicType';
import { FurnitureRoomBrandingLogic } from './FurnitureRoomBrandingLogic';

export class FurnitureRoomBackgroundLogic extends FurnitureRoomBrandingLogic
{
    public static TYPE: string = ObjectLogicType.FURNITURE_BG;

    protected getAdClickUrl(model: IRoomObjectModel): string
    {
        return null;
    }
}