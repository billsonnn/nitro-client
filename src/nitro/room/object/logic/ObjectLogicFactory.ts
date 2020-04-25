import { NitroLogger } from '../../../../core/common/logger/NitroLogger';
import { EventDispatcher } from '../../../../core/events/EventDispatcher';
import { IEventDispatcher } from '../../../../core/events/IEventDispatcher';
import { IRoomObjectEventHandler } from '../../../../room/object/logic/IRoomObjectEventHandler';
import { IRoomObjectLogicFactory } from '../../../../room/object/logic/IRoomObjectLogicFactory';
import { RoomObjectLogicBase } from '../../../../room/object/logic/RoomObjectLogicBase';
import { RoomObjectLogicType } from '../RoomObjectLogicType';
import { AvatarLogic } from './avatar/AvatarLogic';
import { FurnitureBadgeDisplayLogic } from './furniture/FurnitureBadgeDisplayLogic';
import { FurnitureChangeStateWhenStepOnLogic } from './furniture/FurnitureChangeStateWhenStepOnLogic';
import { FurnitureCounterClockLogic } from './furniture/FurnitureCounterClockLogic';
import { FurnitureCreditLogic } from './furniture/FurnitureCreditLogic';
import { FurnitureCustomStackHeightLogic } from './furniture/FurnitureCustomStackHeightLogic';
import { FurnitureDiceLogic } from './furniture/FurnitureDiceLogic';
import { FurnitureEditableInternalLinkLogic } from './furniture/FurnitureEditableInternalLinkLogic';
import { FurnitureFireworksLogic } from './furniture/FurnitureFireworksLogic';
import { FurnitureFloorHoleLogic } from './furniture/FurnitureFloorHoleLogic';
import { FurnitureGuildCustomizedLogic } from './furniture/FurnitureGuildCustomizedLogic';
import { FurnitureHighScoreLogic } from './furniture/FurnitureHighScoreLogic';
import { FurnitureHockeyScoreLogic } from './furniture/FurnitureHockeyScoreLogic';
import { FurnitureIceStormLogic } from './furniture/FurnitureIceStormLogic';
import { FurnitureLogic } from './furniture/FurnitureLogic';
import { FurnitureMultiHeightLogic } from './furniture/FurnitureMultiHeightLogic';
import { FurnitureMultiStateLogic } from './furniture/FurnitureMultiStateLogic';
import { FurnitureOneWayDoorLogic } from './furniture/FurnitureOneWayDoorLogic';
import { FurniturePetCustomizationLogic } from './furniture/FurniturePetCustomizationLogic';
import { FurniturePresentLogic } from './furniture/FurniturePresentLogic';
import { FurniturePurchaseableClothingLogic } from './furniture/FurniturePurchaseableClothingLogic';
import { FurniturePushableLogic } from './furniture/FurniturePushableLogic';
import { FurnitureRoomBackgroundColorLogic } from './furniture/FurnitureRoomBackgroundColorLogic';
import { FurnitureRoomBackgroundLogic } from './furniture/FurnitureRoomBackgroundLogic';
import { FurnitureRoomBillboardLogic } from './furniture/FurnitureRoomBillboardLogic';
import { FurnitureRoomDimmerLogic } from './furniture/FurnitureRoomDimmerLogic';
import { FurnitureScoreLogic } from './furniture/FurnitureScoreLogic';
import { FurnitureSoundBlockLogic } from './furniture/FurnitureSoundBlockLogic';
import { FurnitureStickieLogic } from './furniture/FurnitureStickieLogic';
import { FurnitureTrophyLogic } from './furniture/FurnitureTrophyLogic';
import { FurnitureVoteCounterLogic } from './furniture/FurnitureVoteCounterLogic';
import { FurnitureVoteMajorityLogic } from './furniture/FurnitureVoteMajorityLogic';
import { FurnitureWindowLogic } from './furniture/FurnitureWindowLogic';
import { PetLogic } from './pet/PetLogic';
import { RoomLogic } from './room/RoomLogic';
import { TileCursorLogic } from './room/TileCursorLogic';

export class ObjectLogicFactory implements IRoomObjectLogicFactory
{
    private _events: IEventDispatcher;

    private _cachedEvents: Map<string, boolean>;
    private _registeredEvents: Map<string, boolean>;
    private _functions: Function[];

    constructor()
    {
        this._events            = new EventDispatcher();

        this._cachedEvents      = new Map();
        this._registeredEvents  = new Map();
        this._functions         = [];
    }

    public getLogic(type: string): IRoomObjectEventHandler
    {
        const logic = this.getLogicType(type);

        if(!logic) return null;

        const instance = new logic() as IRoomObjectEventHandler;

        if(!instance) return null;

        instance.eventDispatcher = this._events;

        if(!this._cachedEvents.get(type))
        {
            this._cachedEvents.set(type, true);

            const eventTypes = instance.getEventTypes();

            for(let eventType of eventTypes)
            {
                if(!eventType) continue;

                this.registerEventType(eventType);
            }
        }

        return instance;
    }

    private registerEventType(type: string): void
    {
        if(this._registeredEvents.get(type)) return;

        this._registeredEvents.set(type, true);

        for(let func of this._functions)
        {
            if(!func) continue;

            this._events.addEventListener(type, func);
        }
    }

    public registerEventFunction(func: Function): void
    {
        if(!func) return;

        if(this._functions.indexOf(func) >= 0) return;

        this._functions.push(func);

        for(let eventType of this._registeredEvents.keys())
        {
            if(!eventType) continue;

            this._events.addEventListener(eventType, func);
        }
    }

    public removeEventFunction(func: Function): void
    {
        if(!func) return;

        const index = this._functions.indexOf(func);

        if(index === -1) return;

        this._functions.splice(index, 1);

        for(let event of this._registeredEvents.keys())
        {
            if(!event) continue;

            this._events.removeEventListener(event, func);
        }
    }

    public getLogicType(type: string): typeof RoomObjectLogicBase
    {
        if(!type) return null;

        let logic: typeof RoomObjectLogicBase = null;

        switch(type)
        {
            case RoomObjectLogicType.ROOM:
                logic = RoomLogic;
                break;
            case RoomObjectLogicType.TILE_CURSOR:
                logic = TileCursorLogic;
                break;
            case RoomObjectLogicType.USER:
            case RoomObjectLogicType.BOT:
            case RoomObjectLogicType.RENTABLE_BOT:
                logic = AvatarLogic;
                break;
            case RoomObjectLogicType.PET:
                logic = PetLogic;
                break;
            case RoomObjectLogicType.FURNITURE_BASIC:
                logic = FurnitureLogic;
                break;
            case RoomObjectLogicType.FURNITURE_BADGE_DISPLAY:
                logic = FurnitureBadgeDisplayLogic;
                break;
            case RoomObjectLogicType.FURNITURE_CHANGE_STATE_WHEN_STEP_ON:
                logic = FurnitureChangeStateWhenStepOnLogic;
                break;
            case RoomObjectLogicType.FURNITURE_COUNTER_CLOCK:
                logic = FurnitureCounterClockLogic;
                break;
            case RoomObjectLogicType.FURNITURE_CREDIT:
                logic = FurnitureCreditLogic;
                break;
            case RoomObjectLogicType.FURNITURE_CUSTOM_STACK_HEIGHT:
                logic = FurnitureCustomStackHeightLogic;
                break;
            case RoomObjectLogicType.FURNITURE_DICE:
                logic = FurnitureDiceLogic;
                break;
            case RoomObjectLogicType.FURNITURE_EDITABLE_INTERNAL_LINK:
                logic = FurnitureEditableInternalLinkLogic;
                break;
            case RoomObjectLogicType.FURNITURE_FIREWORKS:
                logic = FurnitureFireworksLogic;
                break;
            case RoomObjectLogicType.FURNITURE_FLOOR_HOLE:
                logic = FurnitureFloorHoleLogic;
                break;
            case RoomObjectLogicType.FURNITURE_GUILD_CUSTOMIZED:
                logic = FurnitureGuildCustomizedLogic;
                break;
            case RoomObjectLogicType.FURNITURE_HIGH_SCORE:
                logic = FurnitureHighScoreLogic;
                break;
            case RoomObjectLogicType.FURNITURE_HOCKEY_SCORE:
                logic = FurnitureHockeyScoreLogic;
                break;
            case RoomObjectLogicType.FURNITURE_ES:
                logic = FurnitureIceStormLogic;
                break;
            case RoomObjectLogicType.FURNITURE_MULTIHEIGHT:
                logic = FurnitureMultiHeightLogic;
                break;
            case RoomObjectLogicType.FURNITURE_MULTISTATE:
                logic = FurnitureMultiStateLogic;
                break;
            case RoomObjectLogicType.FURNITURE_ONE_WAY_DOOR:
                logic = FurnitureOneWayDoorLogic;
                break;
            case RoomObjectLogicType.FURNITURE_PET_CUSTOMIZATION:
                logic = FurniturePetCustomizationLogic;
                break;
            case RoomObjectLogicType.FURNITURE_PRESENT:
                logic = FurniturePresentLogic;
                break;
            case RoomObjectLogicType.FURNITURE_PURCHASABLE_CLOTHING:
                logic = FurniturePurchaseableClothingLogic;
                break;
            case RoomObjectLogicType.FURNITURE_PUSHABLE:
                logic = FurniturePushableLogic;
                break;
            case RoomObjectLogicType.FURNITURE_BACKGROUND_COLOR:
                logic = FurnitureRoomBackgroundColorLogic;
                break;
            case RoomObjectLogicType.FURNITURE_BG:
                logic = FurnitureRoomBackgroundLogic;
                break;
            case RoomObjectLogicType.FURNITURE_BB:
                logic = FurnitureRoomBillboardLogic;
                break;
            case RoomObjectLogicType.FURNITURE_ROOMDIMMER:
                logic = FurnitureRoomDimmerLogic;
                break;
            case RoomObjectLogicType.FURNITURE_SCORE:
                logic = FurnitureScoreLogic;
                break;
            case RoomObjectLogicType.FURNITURE_SOUNDBLOCK:
                logic = FurnitureSoundBlockLogic;
                break;
            case RoomObjectLogicType.FURNITURE_STICKIE:
                logic = FurnitureStickieLogic;
                break;
            case RoomObjectLogicType.FURNITURE_TROPHY:
                logic = FurnitureTrophyLogic;
                break;
            case RoomObjectLogicType.FURNITURE_VOTE_COUNTER:
                logic = FurnitureVoteCounterLogic;
                break;
            case RoomObjectLogicType.FURNITURE_VOTE_MAJORITY:
                logic = FurnitureVoteMajorityLogic;
                break;
            case RoomObjectLogicType.FURNITURE_WINDOW:
                logic = FurnitureWindowLogic;
            default:
                logic = FurnitureLogic;
                break;
        }

        if(!logic)
        {
            NitroLogger.log(`Unknown Logic: ${ type }`);

            return null;
        }

        return logic;
    }
}