import { RoomObjectLogicType } from '../../RoomObjectLogicType';
import { FurnitureMultiStateLogic } from './FurnitureMultiStateLogic';

export class FurniturePushableLogic extends FurnitureMultiStateLogic
{
    public static TYPE: string = RoomObjectLogicType.FURNITURE_PUSHABLE;
}