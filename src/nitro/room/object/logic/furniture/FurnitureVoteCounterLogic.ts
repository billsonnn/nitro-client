import { ObjectLogicType } from '../ObjectLogicType';
import { FurnitureMultiStateLogic } from './FurnitureMultiStateLogic';

export class FurnitureVoteCounterLogic extends FurnitureMultiStateLogic
{
    public static TYPE: string = ObjectLogicType.FURNITURE_VOTE_COUNTER;
}