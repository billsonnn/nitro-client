import { IRoomObjectLogic } from '../../../../room/object/logic/IRoomObjectLogic';
import { IRoomObjectLogicFactory } from '../../../../room/object/logic/IRoomObjectLogicFactory';
import { RoomObjectLogicBase } from '../../../../room/object/logic/RoomObjectLogicBase';
import { FurnitureBackgroundLogic } from './furniture/FurnitureBackgroundLogic';
import { FurnitureBadgeDisplayLogic } from './furniture/FurnitureBadgeDisplayLogic';
import { FurnitureChangeStateWhenStepOnLogic } from './furniture/FurnitureChangeStateWhenStepOnLogic';
import { FurnitureCounterClockLogic } from './furniture/FurnitureCounterClockLogic';
import { FurnitureCreditLogic } from './furniture/FurnitureCreditLogic';
import { FurnitureDiceLogic } from './furniture/FurnitureDiceLogic';
import { FurnitureEditableInternalLinkLogic } from './furniture/FurnitureEditableInternalLinkLogic';
import { FurnitureFireworksLogic } from './furniture/FurnitureFireworksLogic';
import { FurnitureGuildCustomizedLogic } from './furniture/FurnitureGuildCustomizedLogic';
import { FurnitureHighScoreLogic } from './furniture/FurnitureHighScoreLogic';
import { FurnitureHockeyScoreLogic } from './furniture/FurnitureHockeyScoreLogic';
import { FurnitureIceStormLogic } from './furniture/FurnitureIceStormLogic';
import { FurnitureLogic } from './furniture/FurnitureLogic';
import { FurnitureMultiHeightLogic } from './furniture/FurnitureMultiHeightLogic';
import { FurnitureMultiStateLogic } from './furniture/FurnitureMultiStateLogic';
import { FurniturePetCustomizationLogic } from './furniture/FurniturePetCustomizationLogic';
import { FurniturePresentLogic } from './furniture/FurniturePresentLogic';
import { FurniturePurchaseableClothingLogic } from './furniture/FurniturePurchaseableClothingLogic';
import { FurniturePushableLogic } from './furniture/FurniturePushableLogic';
import { FurnitureScoreLogic } from './furniture/FurnitureScoreLogic';
import { FurnitureSoundBlockLogic } from './furniture/FurnitureSoundBlockLogic';
import { FurnitureVoteCounterLogic } from './furniture/FurnitureVoteCounterLogic';
import { FurnitureVoteMajorityLogic } from './furniture/FurnitureVoteMajorityLogic';
import { ObjectLogicType } from './ObjectLogicType';
import { PetLogic } from './pet/PetLogic';
import { RoomLogic } from './room/RoomLogic';

export class ObjectLogicFactory implements IRoomObjectLogicFactory
{
    public getLogic(type: string): IRoomObjectLogic
    {
        const logic = this.getLogicType(type);

        if(!logic) return null;

        return new logic();
    }

    public getLogicType(type: string): typeof RoomObjectLogicBase
    {
        if(!type) return null;

        let logic: typeof RoomObjectLogicBase = null;

        switch(type)
        {
            case ObjectLogicType.ROOM:
                logic = RoomLogic;
                break;
            case ObjectLogicType.USER:
            case ObjectLogicType.BOT:
            case ObjectLogicType.RENTABLE_BOT:
                //logic = AvatarLogic;
                break;
            case ObjectLogicType.PET:
                logic = PetLogic;
                break;
            case ObjectLogicType.FURNITURE_BASIC:
                logic = FurnitureLogic;
                break;
            case ObjectLogicType.FURNITURE_BG:
                logic = FurnitureBackgroundLogic;
                break;
            case ObjectLogicType.FURNITURE_BADGE_DISPLAY:
                logic = FurnitureBadgeDisplayLogic;
                break;
            case ObjectLogicType.FURNITURE_CHANGE_STATE_WHEN_STEP_ON:
                logic = FurnitureChangeStateWhenStepOnLogic;
                break;
            case ObjectLogicType.FURNITURE_COUNTER_CLOCK:
                logic = FurnitureCounterClockLogic;
                break;
            case ObjectLogicType.FURNITURE_CREDIT:
                logic = FurnitureCreditLogic;
                break;
            case ObjectLogicType.FURNITURE_DICE:
                logic = FurnitureDiceLogic;
                break;
            case ObjectLogicType.FURNITURE_EDITABLE_INTERNAL_LINK:
                logic = FurnitureEditableInternalLinkLogic;
                break;
            case ObjectLogicType.FURNITURE_FIREWORKS:
                logic = FurnitureFireworksLogic;
                break;
            case ObjectLogicType.FURNITURE_GUILD_CUSTOMIZED:
                logic = FurnitureGuildCustomizedLogic;
                break;
            case ObjectLogicType.FURNITURE_HIGH_SCORE:
                logic = FurnitureHighScoreLogic;
                break;
            case ObjectLogicType.FURNITURE_HOCKEY_SCORE:
                logic = FurnitureHockeyScoreLogic;
                break;
            case ObjectLogicType.FURNITURE_ES:
                logic = FurnitureIceStormLogic;
                break;
            case ObjectLogicType.FURNITURE_MULTIHEIGHT:
                logic = FurnitureMultiHeightLogic;
                break;
            case ObjectLogicType.FURNITURE_MULTISTATE:
                logic = FurnitureMultiStateLogic;
                break;
            case ObjectLogicType.FURNITURE_PET_CUSTOMIZATION:
                logic = FurniturePetCustomizationLogic;
                break;
            case ObjectLogicType.FURNITURE_PRESENT:
                logic = FurniturePresentLogic;
                break;
            case ObjectLogicType.FURNITURE_PURCHASABLE_CLOTHING:
                logic = FurniturePurchaseableClothingLogic;
                break;
            case ObjectLogicType.FURNITURE_PUSHABLE:
                logic = FurniturePushableLogic;
                break;
            case ObjectLogicType.FURNITURE_SOUNDBLOCK:
                logic = FurnitureSoundBlockLogic;
                break;
            case ObjectLogicType.FURNITURE_SCORE:
                logic = FurnitureScoreLogic;
                break;
            case ObjectLogicType.FURNITURE_VOTE_COUNTER:
                logic = FurnitureVoteCounterLogic;
                break;
            case ObjectLogicType.FURNITURE_VOTE_MAJORITY:
                logic = FurnitureVoteMajorityLogic;
                break;
        }

        if(!logic)
        {
            console.log(`Invalid Logic: ${ type }`);

            return null;
        }

        return logic;
    }
}