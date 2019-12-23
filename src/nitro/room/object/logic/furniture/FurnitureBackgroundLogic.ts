import { IRoomObjectModel } from '../../../../../room/object/IRoomObjectModel';
import { ObjectLogicType } from '../ObjectLogicType';
import { FurnitureBrandingLogic } from './FurnitureBrandingLogic';

export class FurnitureBackgroundLogic extends FurnitureBrandingLogic
{
    public static TYPE: string = ObjectLogicType.FURNITURE_BG;

    protected getAdClickUrl(model: IRoomObjectModel): string
    {
        return null;
    }
}