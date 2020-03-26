import { IRoomObjectModel } from '../../../../../room/object/IRoomObjectModel';
import { RoomObjectLogicType } from '../../RoomObjectLogicType';
import { RoomObjectVariable } from '../../RoomObjectVariable';
import { FurnitureRoomBrandingLogic } from './FurnitureRoomBrandingLogic';

export class FurnitureRoomBillboardLogic extends FurnitureRoomBrandingLogic
{
    public static TYPE: string = RoomObjectLogicType.FURNITURE_BB;

    protected getAdClickUrl(model: IRoomObjectModel): string
    {
        return model.getValue(RoomObjectVariable.FURNITURE_BRANDING_URL);
    }
}