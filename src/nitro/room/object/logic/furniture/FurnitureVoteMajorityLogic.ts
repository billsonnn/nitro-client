import { RoomObjectLogicType } from '../../RoomObjectLogicType';
import { FurnitureMultiStateLogic } from './FurnitureMultiStateLogic';

export class FurnitureVoteMajorityLogic extends FurnitureMultiStateLogic
{
    public static TYPE: string = RoomObjectLogicType.FURNITURE_VOTE_MAJORITY;
}