import { ObjectLogicType } from '../ObjectLogicType';
import { FurnitureMultiStateLogic } from './FurnitureMultiStateLogic';

export class FurniturePushableLogic extends FurnitureMultiStateLogic
{
    public static TYPE: string = ObjectLogicType.FURNITURE_PUSHABLE;
}