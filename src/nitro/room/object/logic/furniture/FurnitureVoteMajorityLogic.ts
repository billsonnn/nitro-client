import { ObjectLogicType } from '../ObjectLogicType';
import { FurnitureMultiStateLogic } from './FurnitureMultiStateLogic';

export class FurnitureVoteMajorityLogic extends FurnitureMultiStateLogic
{
    public static TYPE: string = ObjectLogicType.FURNITURE_VOTE_MAJORITY;
}