import { RoomObjectLogicType } from '../../RoomObjectLogicType';
import { FurnitureLogic } from './FurnitureLogic';

export class FurnitureChangeStateWhenStepOnLogic extends FurnitureLogic
{
    public static TYPE: string = RoomObjectLogicType.FURNITURE_CHANGE_STATE_WHEN_STEP_ON;
}