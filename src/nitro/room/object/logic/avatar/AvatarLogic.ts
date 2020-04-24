
import { RoomObjectMouseEvent } from '../../../../../room/events/RoomObjectMouseEvent';
import { RoomSpriteMouseEvent } from '../../../../../room/events/RoomSpriteMouseEvent';
import { RoomObjectUpdateMessage } from '../../../../../room/messages/RoomObjectUpdateMessage';
import { IRoomObjectModel } from '../../../../../room/object/IRoomObjectModel';
import { IRoomGeometry } from '../../../../../room/utils/IRoomGeometry';
import { Vector3d } from '../../../../../room/utils/Vector3d';
import { AvatarAction } from '../../../../avatar/enum/AvatarAction';
import { NitroInstance } from '../../../../NitroInstance';
import { MouseEventType } from '../../../../ui/MouseEventType';
import { RoomObjectFurnitureActionEvent } from '../../../events/RoomObjectFurnitureActionEvent';
import { RoomObjectMoveEvent } from '../../../events/RoomObjectMoveEvent';
import { ObjectAvatarCarryObjectUpdateMessage } from '../../../messages/ObjectAvatarCarryObjectUpdateMessage';
import { ObjectAvatarChatUpdateMessage } from '../../../messages/ObjectAvatarChatUpdateMessage';
import { ObjectAvatarDanceUpdateMessage } from '../../../messages/ObjectAvatarDanceUpdateMessage';
import { ObjectAvatarEffectUpdateMessage } from '../../../messages/ObjectAvatarEffectUpdateMessage';
import { ObjectAvatarExpressionUpdateMessage } from '../../../messages/ObjectAvatarExpressionUpdateMessage';
import { ObjectAvatarFigureUpdateMessage } from '../../../messages/ObjectAvatarFigureUpdateMessage';
import { ObjectAvatarFlatControlUpdateMessage } from '../../../messages/ObjectAvatarFlatControlUpdateMessage';
import { ObjectAvatarGestureUpdateMessage } from '../../../messages/ObjectAvatarGestureUpdateMessage';
import { ObjectAvatarOwnMessage } from '../../../messages/ObjectAvatarOwnMessage';
import { ObjectAvatarPostureUpdateMessage } from '../../../messages/ObjectAvatarPostureUpdateMessage';
import { ObjectAvatarSelectedMessage } from '../../../messages/ObjectAvatarSelectedMessage';
import { ObjectAvatarSignUpdateMessage } from '../../../messages/ObjectAvatarSignUpdateMessage';
import { ObjectAvatarSleepUpdateMessage } from '../../../messages/ObjectAvatarSleepUpdateMessage';
import { ObjectAvatarTypingUpdateMessage } from '../../../messages/ObjectAvatarTypingUpdateMessage';
import { ObjectAvatarUpdateMessage } from '../../../messages/ObjectAvatarUpdateMessage';
import { ObjectAvatarUseObjectUpdateMessage } from '../../../messages/ObjectAvatarUseObjectUpdateMessage';
import { RoomObjectVariable } from '../../RoomObjectVariable';
import { MovingObjectLogic } from '../MovingObjectLogic';

export class AvatarLogic extends MovingObjectLogic
{
    private static MAX_HAND_ID: number      = 999999999;
    private static MAX_HAND_USE_ID: number  = 999;
    private static _Str_13364: number       = 28;
    private static _Str_8860: number        = 500;
    private static _Str_15351: number       = 29;
    private static _Str_13733: number       = 184;
    private static _Str_13094: number       = 185;

    private _selected: boolean;
    private _reportedLocation: Vector3d;
    private _effectChangeTimeStamp: number;
    private _newEffect: number;
    private _blinkingStartTimestamp: number;
    private _blinkingEndTimestamp: number;
    private _talkingEndTimestamp: number;
    private _talkingPauseStartTimestamp: number;
    private _talkingPauseEndTimestamp: number;
    private _carryObjectStartTimestamp: number;
    private _carryObjectEndTimestamp: number;
    private _allowUseCarryObject: boolean;
    private _animationEndTimestamp: number;
    private _signEndTimestamp: number;
    private _gestureEndTimestamp: number;

    constructor()
    {
        super();

        this._selected                      = false;
        this._reportedLocation              = null;
        this._effectChangeTimeStamp         = 0;
        this._newEffect                     = 0;
        this._blinkingStartTimestamp        = NitroInstance.instance.time + this.randomBlinkStartTimestamp();
        this._blinkingEndTimestamp          = 0;
        this._talkingEndTimestamp           = 0;
        this._talkingPauseStartTimestamp    = 0;
        this._talkingPauseEndTimestamp      = 0;
        this._carryObjectStartTimestamp     = 0;
        this._carryObjectEndTimestamp       = 0;
        this._allowUseCarryObject           = false;
        this._animationEndTimestamp         = 0;
        this._signEndTimestamp              = 0;
        this._gestureEndTimestamp           = 0;
    }

    public getEventTypes(): string[]
    {
        const types = [ RoomObjectMouseEvent.CLICK, RoomObjectMoveEvent.POSITION_CHANGED, RoomObjectMouseEvent.MOUSE_ENTER, RoomObjectMouseEvent.MOUSE_LEAVE, RoomObjectFurnitureActionEvent.MOUSE_BUTTON, RoomObjectFurnitureActionEvent.MOUSE_ARROW ];

        return this.mergeTypes(super.getEventTypes(), types);
    }

    public dispose(): void
    {
        if(this._selected && this.object)
        {
            if(this.eventDispatcher) this.eventDispatcher.dispatchEvent(new RoomObjectMoveEvent(RoomObjectMoveEvent.OBJECT_REMOVED, this.object));
        }

        super.dispose();

        this._reportedLocation = null;
    }

    public update(time: number): void
    {
        super.update(time);

        if(this._selected && this.object)
        {
            if(this.eventDispatcher)
            {
                const location = this.object.getLocation();

                if(((!this._reportedLocation || (this._reportedLocation.x !== location.x)) || (this._reportedLocation.y !== location.y)) || (this._reportedLocation.z !== location.z))
                {
                    if(!this._reportedLocation) this._reportedLocation = new Vector3d();

                    this._reportedLocation.assign(location);

                    this.eventDispatcher.dispatchEvent(new RoomObjectMoveEvent(RoomObjectMoveEvent.POSITION_CHANGED, this.object));
                }
            }
        }

        const model = this.object && this.object.model;

        if(model) this.updateModel(this.time, model);
    }

    private updateModel(time: number, model: IRoomObjectModel): void
    {
        if(this._talkingEndTimestamp > 0)
        {
            if(time > this._talkingEndTimestamp)
            {
                model.setValue(RoomObjectVariable.FIGURE_TALK, 0);

                this._talkingEndTimestamp           = 0;
                this._talkingPauseStartTimestamp    = 0;
                this._talkingPauseEndTimestamp      = 0;
            }
            else
            {
                if(!this._talkingPauseEndTimestamp && !this._talkingPauseStartTimestamp)
                {
                    this._talkingPauseStartTimestamp    = time + this.randomTalkingPauseStartTimestamp();
                    this._talkingPauseEndTimestamp      = this._talkingPauseStartTimestamp + this.randomTalkingPauseEndTimestamp();
                }
                else
                {
                    if((this._talkingPauseStartTimestamp > 0) && (time > this._talkingPauseStartTimestamp))
                    {
                        model.setValue(RoomObjectVariable.FIGURE_TALK, 0);

                        this._talkingPauseStartTimestamp = 0;
                    }
                    else
                    {
                        if((this._talkingPauseEndTimestamp > 0) && (time > this._talkingPauseEndTimestamp))
                        {
                            model.setValue(RoomObjectVariable.FIGURE_TALK, 1);
                            
                            this._talkingPauseEndTimestamp = 0;
                        }
                    }
                }
            }
        }

        if((this._animationEndTimestamp > 0) && (time > this._animationEndTimestamp))
        {
            model.setValue(RoomObjectVariable.FIGURE_EXPRESSION, 0);

            this._animationEndTimestamp = 0;
        }

        if((this._gestureEndTimestamp > 0) && (time > this._gestureEndTimestamp))
        {
            model.setValue(RoomObjectVariable.FIGURE_GESTURE, 0);

            this._gestureEndTimestamp = 0;
        }

        if((this._signEndTimestamp > 0) && (time > this._signEndTimestamp))
        {
            model.setValue(RoomObjectVariable.FIGURE_SIGN, -1);

            this._signEndTimestamp = 0;
        }

        if(this._carryObjectEndTimestamp > 0)
        {
            if(time > this._carryObjectEndTimestamp)
            {
                model.setValue(RoomObjectVariable.FIGURE_CARRY_OBJECT, 0);
                model.setValue(RoomObjectVariable.FIGURE_USE_OBJECT, 0);

                this._carryObjectStartTimestamp = 0;
                this._carryObjectEndTimestamp   = 0;
                this._allowUseCarryObject       = false;
            }
        }

        if(this._allowUseCarryObject)
        {
            if((time - this._carryObjectStartTimestamp) > 5000)
            {
                if(((time - this._carryObjectStartTimestamp) % 10000) < 1000)
                {
                    model.setValue(RoomObjectVariable.FIGURE_USE_OBJECT, 1);
                }
                else
                {
                    model.setValue(RoomObjectVariable.FIGURE_USE_OBJECT, 0);
                }
            }
        }

        if((this._blinkingStartTimestamp > -1) && (time > this._blinkingStartTimestamp))
        {
            model.setValue(RoomObjectVariable.FIGURE_BLINK, 1);

            this._blinkingStartTimestamp    = time + this.randomBlinkStartTimestamp();
            this._blinkingEndTimestamp      = time + this.randomBlinkEndTimestamp();
        }

        if((this._blinkingEndTimestamp > 0) && (time > this._blinkingEndTimestamp))
        {
            model.setValue(RoomObjectVariable.FIGURE_BLINK, 0);

            this._blinkingEndTimestamp = 0;
        }

        if((this._effectChangeTimeStamp > 0) && (time > this._effectChangeTimeStamp))
        {
            model.setValue(RoomObjectVariable.FIGURE_EFFECT, this._newEffect);

            this._effectChangeTimeStamp = 0;
        }
    }

    public processUpdateMessage(message: RoomObjectUpdateMessage): void
    {
        if(!message || !this.object) return;

        super.processUpdateMessage(message);

        const model = this.object && this.object.model;

        if(!model) return;

        if(message instanceof ObjectAvatarPostureUpdateMessage)
        {
            model.setValue(RoomObjectVariable.FIGURE_POSTURE, message.postureType);
            model.setValue(RoomObjectVariable.FIGURE_POSTURE_PARAMETER, message.parameter);

            return;
        }

        if(message instanceof ObjectAvatarChatUpdateMessage)
        {
            model.setValue(RoomObjectVariable.FIGURE_TALK, 1);

            this._talkingEndTimestamp = this.time + (message.numberOfWords * 1000);

            return;
        }

        if(message instanceof ObjectAvatarTypingUpdateMessage)
        {
            model.setValue(RoomObjectVariable.FIGURE_IS_TYPING, message.isTyping ? 1 : 0);

            return;
        }

        if(message instanceof ObjectAvatarUpdateMessage)
        {
            model.setValue(RoomObjectVariable.HEAD_DIRECTION, message.headDirection);
            model.setValue(RoomObjectVariable.FIGURE_CAN_STAND_UP, message.canStandUp);
            model.setValue(RoomObjectVariable.FIGURE_VERTICAL_OFFSET, message.baseY);

            return;
        }

        if(message instanceof ObjectAvatarGestureUpdateMessage)
        {
            model.setValue(RoomObjectVariable.FIGURE_GESTURE, message.gesture);

            this._gestureEndTimestamp = this.time + 3000;

            return;
        }

        if(message instanceof ObjectAvatarExpressionUpdateMessage)
        {
            model.setValue(RoomObjectVariable.FIGURE_EXPRESSION, message.expressionType);

            this._animationEndTimestamp = AvatarAction.getExpressionTimeout(model.getValue(RoomObjectVariable.FIGURE_EXPRESSION));

            if(this._animationEndTimestamp > -1) this._animationEndTimestamp += this.time;

            return;
        }

        if(message instanceof ObjectAvatarDanceUpdateMessage)
        {
            model.setValue(RoomObjectVariable.FIGURE_DANCE, message.danceStyle)

            return;
        }

        if(message instanceof ObjectAvatarSleepUpdateMessage)
        {
            model.setValue(RoomObjectVariable.FIGURE_SLEEP, message.isSleeping ? 1 : 0);

            if(message.isSleeping) this._blinkingStartTimestamp = -1;
            else this._blinkingStartTimestamp = this.time + this.randomBlinkStartTimestamp();

            return;
        }

        if(message instanceof ObjectAvatarEffectUpdateMessage)
        {
            this.updateAvatarEffect(message.effect, message.delayMilliseconds, model);

            return;
        }

        if(message instanceof ObjectAvatarCarryObjectUpdateMessage)
        {
            model.setValue(RoomObjectVariable.FIGURE_CARRY_OBJECT, message.itemType);
            model.setValue(RoomObjectVariable.FIGURE_USE_OBJECT, 0);

            this._carryObjectStartTimestamp = this.time;

            if(message.itemType < AvatarLogic.MAX_HAND_ID)
            {
                this._carryObjectEndTimestamp   = 0;
                this._allowUseCarryObject       = message.itemType <= AvatarLogic.MAX_HAND_USE_ID;
            }
            else
            {
                this._carryObjectEndTimestamp   = this._carryObjectStartTimestamp + 1500;
                this._allowUseCarryObject       = false;
            }

            return;
        }

        if(message instanceof ObjectAvatarUseObjectUpdateMessage)
        {
            model.setValue(RoomObjectVariable.FIGURE_USE_OBJECT, message.itemType);

            return;
        }

        if(message instanceof ObjectAvatarSignUpdateMessage)
        {
            model.setValue(RoomObjectVariable.FIGURE_SIGN, message.signType);

            this._signEndTimestamp = this.time + 5000;

            return;
        }

        if(message instanceof ObjectAvatarFlatControlUpdateMessage)
        {
            model.setValue(RoomObjectVariable.FIGURE_FLAT_CONTROL, message.level);

            return;
        }

        if(message instanceof ObjectAvatarFigureUpdateMessage)
        {
            model.setValue(RoomObjectVariable.FIGURE, message.figure);
            model.setValue(RoomObjectVariable.GENDER, message.gender);

            return;
        }

        if(message instanceof ObjectAvatarSelectedMessage)
        {
            this._selected          = message.selected;
            this._reportedLocation  = null;

            return;
        }

        if(message instanceof ObjectAvatarOwnMessage)
        {
            model.setValue(RoomObjectVariable.OWN_USER, 1);

            return;
        }
    }

    private updateAvatarEffect(effect: number, delay: number,  model: IRoomObjectModel): void
    {
        if(effect === AvatarLogic._Str_13364)
        {
            this._effectChangeTimeStamp = (NitroInstance.instance.time + AvatarLogic._Str_8860);
            this._newEffect             = AvatarLogic._Str_15351;
        }

        else if (effect === AvatarLogic._Str_13733)
        {
            this._effectChangeTimeStamp = (NitroInstance.instance.time + AvatarLogic._Str_8860);
            this._newEffect             = AvatarLogic._Str_13094;
        }

        else if (model.getValue(RoomObjectVariable.FIGURE_EFFECT) === AvatarLogic._Str_15351)
        {
            this._effectChangeTimeStamp = (NitroInstance.instance.time + AvatarLogic._Str_8860);
            this._newEffect             = effect;

            effect = AvatarLogic._Str_13364;
        }

        else if (model.getValue(RoomObjectVariable.FIGURE_EFFECT) === AvatarLogic._Str_13094)
        {
            this._effectChangeTimeStamp = (NitroInstance.instance.time + AvatarLogic._Str_8860);
            this._newEffect             = effect;

            effect = AvatarLogic._Str_13733;
        }

        else if (delay === 0)
        {
            this._effectChangeTimeStamp = 0;
        }

        else
        {
            this._effectChangeTimeStamp = (NitroInstance.instance.time + delay);
            this._newEffect             = effect;
            
            return;
        }

        model.setValue(RoomObjectVariable.FIGURE_EFFECT, effect);
    }

    public mouseEvent(event: RoomSpriteMouseEvent, geometry: IRoomGeometry): void
    {
        let eventType: string = null;

        switch(event.type)
        {
            case MouseEventType.MOUSE_CLICK:
                eventType = RoomObjectMouseEvent.CLICK;
                break;
            case MouseEventType.ROLL_OVER:
                eventType = RoomObjectMouseEvent.MOUSE_ENTER;

                if(this.object.model) this.object.model.setValue(RoomObjectVariable.FIGURE_HIGHLIGHT, 1);

                if(this.eventDispatcher) this.eventDispatcher.dispatchEvent(new RoomObjectFurnitureActionEvent(RoomObjectFurnitureActionEvent.MOUSE_BUTTON, this.object));
                break;
            case MouseEventType.ROLL_OUT:
                eventType = RoomObjectMouseEvent.MOUSE_LEAVE;

                if(this.object.model) this.object.model.setValue(RoomObjectVariable.FIGURE_HIGHLIGHT, 0);

                if(this.eventDispatcher) this.eventDispatcher.dispatchEvent(new RoomObjectFurnitureActionEvent(RoomObjectFurnitureActionEvent.MOUSE_ARROW, this.object));
                break;
                break;
        }

        if(eventType && this.eventDispatcher) this.eventDispatcher.dispatchEvent(new RoomObjectMouseEvent(eventType, this.object, event._Str_3463, event.altKey, event.ctrlKey, event.shiftKey, event.buttonDown));
    }

    private randomTalkingPauseStartTimestamp(): number
    {
        return 100 + (Math.random() * 200);
    }

    private randomTalkingPauseEndTimestamp(): number
    {
        return 75 + (Math.random() * 75);
    }

    private randomBlinkStartTimestamp(): number
    {
        return 4500 + (Math.random() * 1000);
    }

    private randomBlinkEndTimestamp(): number
    {
        return 50 + (Math.random() * 200);
    }
}