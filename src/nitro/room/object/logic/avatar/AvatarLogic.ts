
import { RoomObjectMouseEvent } from '../../../../../room/events/RoomObjectMouseEvent';
import { RoomObjectUpdateMessage } from '../../../../../room/messages/RoomObjectUpdateMessage';
import { IRoomObjectCollision } from '../../../../../room/object/visualization/IRoomObjectCollision';
import { AvatarAction } from '../../../../avatar/actions/AvatarAction';
import { NitroInstance } from '../../../../NitroInstance';
import { ObjectAvatarCarryObjectUpdateMessage } from '../../../messages/ObjectAvatarCarryObjectUpdateMessage';
import { ObjectAvatarChatUpdateMessage } from '../../../messages/ObjectAvatarChatUpdateMessage';
import { ObjectAvatarDanceUpdateMessage } from '../../../messages/ObjectAvatarDanceUpdateMessage';
import { ObjectAvatarExpressionUpdateMessage } from '../../../messages/ObjectAvatarExpressionUpdateMessage';
import { ObjectAvatarFigureUpdateMessage } from '../../../messages/ObjectAvatarFigureUpdateMessage';
import { ObjectAvatarFlatControlUpdateMessage } from '../../../messages/ObjectAvatarFlatControlUpdateMessage';
import { ObjectAvatarGestureUpdateMessage } from '../../../messages/ObjectAvatarGestureUpdateMessage';
import { ObjectAvatarOwnMessage } from '../../../messages/ObjectAvatarOwnMessage';
import { ObjectAvatarPostureUpdateMessage } from '../../../messages/ObjectAvatarPostureUpdateMessage';
import { ObjectAvatarSignUpdateMessage } from '../../../messages/ObjectAvatarSignUpdateMessage';
import { ObjectAvatarSleepUpdateMessage } from '../../../messages/ObjectAvatarSleepUpdateMessage';
import { ObjectAvatarTypingUpdateMessage } from '../../../messages/ObjectAvatarTypingUpdateMessage';
import { ObjectAvatarUpdateMessage } from '../../../messages/ObjectAvatarUpdateMessage';
import { ObjectAvatarUseObjectUpdateMessage } from '../../../messages/ObjectAvatarUseObjectUpdateMessage';
import { RoomObjectModelKey } from '../../RoomObjectModelKey';
import { MovingObjectLogic } from '../MovingObjectLogic';

export class AvatarLogic extends MovingObjectLogic
{
    private static MAX_HAND_ID: number      = 999999999;
    private static MAX_HAND_USE_ID: number  = 999;

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

        this._blinkingStartTimestamp        = NitroInstance.instance.renderer.totalTimeRunning + this.randomBlinkStartTimestamp();
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

    public update(delta: number): void
    {
        super.update(delta);

        const model = this.object && this.object.model;

        if(!model) return;

        const totalTimeRunning = NitroInstance.instance.renderer.totalTimeRunning;

        if(this._talkingEndTimestamp > 0)
        {
            if(totalTimeRunning > this._talkingEndTimestamp)
            {
                model.setValue(RoomObjectModelKey.FIGURE_TALK, 0);

                this._talkingEndTimestamp           = 0;
                this._talkingPauseStartTimestamp    = 0;
                this._talkingPauseEndTimestamp      = 0;
            }
            else
            {
                if(!this._talkingPauseEndTimestamp && !this._talkingPauseStartTimestamp)
                {
                    this._talkingPauseStartTimestamp    = totalTimeRunning + this.randomTalkingPauseStartTimestamp();
                    this._talkingPauseEndTimestamp      = this._talkingPauseStartTimestamp + this.randomTalkingPauseEndTimestamp();
                }
                else
                {
                    if((this._talkingPauseStartTimestamp > 0) && (totalTimeRunning > this._talkingPauseStartTimestamp))
                    {
                        model.setValue(RoomObjectModelKey.FIGURE_TALK, 0);

                        this._talkingPauseStartTimestamp = 0;
                    }
                    else
                    {
                        if((this._talkingPauseEndTimestamp > 0) && (totalTimeRunning > this._talkingPauseEndTimestamp))
                        {
                            model.setValue(RoomObjectModelKey.FIGURE_TALK, 1);
                            
                            this._talkingPauseEndTimestamp = 0;
                        }
                    }
                }
            }
        }

        if((this._animationEndTimestamp > 0) && (totalTimeRunning > this._animationEndTimestamp))
        {
            model.setValue(RoomObjectModelKey.FIGURE_EXPRESSION, 0);

            this._animationEndTimestamp = 0;
        }

        if((this._gestureEndTimestamp > 0) && (totalTimeRunning > this._gestureEndTimestamp))
        {
            model.setValue(RoomObjectModelKey.FIGURE_GESTURE, 0);

            this._gestureEndTimestamp = 0;
        }

        if((this._signEndTimestamp > 0) && (totalTimeRunning > this._signEndTimestamp))
        {
            model.setValue(RoomObjectModelKey.FIGURE_SIGN, -1);

            this._signEndTimestamp = 0;
        }

        if(this._carryObjectEndTimestamp > 0)
        {
            if(totalTimeRunning > this._carryObjectEndTimestamp)
            {
                model.setValue(RoomObjectModelKey.FIGURE_CARRY_OBJECT, 0);
                model.setValue(RoomObjectModelKey.FIGURE_USE_OBJECT, 0);

                this._carryObjectStartTimestamp = 0;
                this._carryObjectEndTimestamp   = 0;
                this._allowUseCarryObject       = false;
            }
        }

        if(this._allowUseCarryObject)
        {
            if((totalTimeRunning - this._carryObjectStartTimestamp) > 5000)
            {
                if(((totalTimeRunning - this._carryObjectStartTimestamp) % 10000) < 1000)
                {
                    model.setValue(RoomObjectModelKey.FIGURE_USE_OBJECT, 1);
                }
                else
                {
                    model.setValue(RoomObjectModelKey.FIGURE_USE_OBJECT, 0);
                }
            }
        }

        if((this._blinkingStartTimestamp > -1) && (totalTimeRunning > this._blinkingStartTimestamp))
        {
            model.setValue(RoomObjectModelKey.FIGURE_BLINK, 1);

            this._blinkingStartTimestamp    = totalTimeRunning + this.randomBlinkStartTimestamp();
            this._blinkingEndTimestamp      = totalTimeRunning + this.randomBlinkEndTimestamp();
        }

        if((this._blinkingEndTimestamp > 0) && (totalTimeRunning > this._blinkingEndTimestamp))
        {
            model.setValue(RoomObjectModelKey.FIGURE_BLINK, 0);

            this._blinkingEndTimestamp = 0;
        }
    }

    public processUpdateMessage(message: RoomObjectUpdateMessage): void
    {
        if(!message || !this.object) return;

        super.processUpdateMessage(message);

        const model = this.object && this.object.model;

        if(!model) return;

        const totalTimeRunning = NitroInstance.instance.renderer.totalTimeRunning;

        if(message instanceof ObjectAvatarUpdateMessage)
        {
            model.setValue(RoomObjectModelKey.HEAD_DIRECTION, message.headDirection);

            return;
        }

        else if(message instanceof ObjectAvatarFigureUpdateMessage)
        {
            model.setValue(RoomObjectModelKey.FIGURE, message.figure);
            model.setValue(RoomObjectModelKey.GENDER, message.gender);

            return;
        }

        else if(message instanceof ObjectAvatarPostureUpdateMessage)
        {
            model.setValue(RoomObjectModelKey.FIGURE_POSTURE, message.postureType);
            model.setValue(RoomObjectModelKey.FIGURE_POSTURE_PARAMETER, message.parameter);

            return;
        }

        else if(message instanceof ObjectAvatarChatUpdateMessage)
        {
            model.setValue(RoomObjectModelKey.FIGURE_TALK, 1);

            this._talkingEndTimestamp = NitroInstance.instance.renderer.totalTimeRunning + (message.numberOfWords * 1000);

            return;
        }

        else if(message instanceof ObjectAvatarGestureUpdateMessage)
        {
            model.setValue(RoomObjectModelKey.FIGURE_GESTURE, message.gesture);

            this._gestureEndTimestamp = NitroInstance.instance.renderer.totalTimeRunning + 3000;

            return;
        }

        else if(message instanceof ObjectAvatarDanceUpdateMessage)
        {
            model.setValue(RoomObjectModelKey.FIGURE_DANCE, message.danceStyle)

            return;
        }

        else if(message instanceof ObjectAvatarExpressionUpdateMessage)
        {
            model.setValue(RoomObjectModelKey.FIGURE_EXPRESSION, message.expressionType);

            this._animationEndTimestamp = AvatarAction.getExpressionTimeout(model.getValue(RoomObjectModelKey.FIGURE_EXPRESSION));

            if(this._animationEndTimestamp > -1) this._animationEndTimestamp += totalTimeRunning;

            return;
        }

        else if(message instanceof ObjectAvatarFlatControlUpdateMessage)
        {
            model.setValue(RoomObjectModelKey.FIGURE_FLAT_CONTROL, message.level);

            return;
        }

        else if(message instanceof ObjectAvatarSignUpdateMessage)
        {
            model.setValue(RoomObjectModelKey.FIGURE_SIGN, message.signType);

            this._signEndTimestamp = NitroInstance.instance.renderer.totalTimeRunning + 5000;
        }

        else if(message instanceof ObjectAvatarSleepUpdateMessage)
        {
            model.setValue(RoomObjectModelKey.FIGURE_SLEEP, message.isSleeping ? 1 : 0);

            if(message.isSleeping) this._blinkingStartTimestamp = -1;
            else this._blinkingStartTimestamp = totalTimeRunning + this.randomBlinkStartTimestamp();

            return;
        }

        else if(message instanceof ObjectAvatarTypingUpdateMessage)
        {
            model.setValue(RoomObjectModelKey.FIGURE_IS_TYPING, message.isTyping ? 1 : 0);

            return;
        }

        else if(message instanceof ObjectAvatarCarryObjectUpdateMessage)
        {
            model.setValue(RoomObjectModelKey.FIGURE_CARRY_OBJECT, message.itemType);
            model.setValue(RoomObjectModelKey.FIGURE_USE_OBJECT, 0);

            this._carryObjectStartTimestamp = totalTimeRunning;

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

        else if(message instanceof ObjectAvatarUseObjectUpdateMessage)
        {
            model.setValue(RoomObjectModelKey.FIGURE_USE_OBJECT, message.itemType);

            return;
        }

        else if(message instanceof ObjectAvatarOwnMessage)
        {
            model.setValue(RoomObjectModelKey.OWN_USER, 1);

            return;
        }
    }

    public mouseEvent(event: RoomObjectMouseEvent): void
    {
        const collision = event.collision as IRoomObjectCollision;

        switch(event.type)
        {
            case RoomObjectMouseEvent.MOUSE_MOVE:
                document.body.style.cursor = 'pointer';
                break;
            case RoomObjectMouseEvent.CLICK:
                //Nitro.networkManager.processOutgoing(new UnitLookComposer(this.object.position));
                break;
        }
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