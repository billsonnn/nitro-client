import { IRoomObjectModel } from '../../../../../room/object/IRoomObjectModel';
import { RoomObjectModelKey } from '../../RoomObjectModelKey';
import { ObjectLogicType } from '../ObjectLogicType';
import { FurnitureRoomBrandingLogic } from './FurnitureRoomBrandingLogic';

export class FurnitureRoomBillboardLogic extends FurnitureRoomBrandingLogic
{
    public static TYPE: string = ObjectLogicType.FURNITURE_BB;

    protected getAdClickUrl(model: IRoomObjectModel): string
    {
        return model.getValue(RoomObjectModelKey.FURNITURE_BRANDING_URL);
    }
}