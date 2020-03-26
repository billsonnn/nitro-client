import { RoomObjectLogicType } from '../../RoomObjectLogicType';
import { FurnitureMultiStateLogic } from './FurnitureMultiStateLogic';

export class FurnitureVoteCounterLogic extends FurnitureMultiStateLogic
{
    public static TYPE: string = RoomObjectLogicType.FURNITURE_VOTE_COUNTER;
}