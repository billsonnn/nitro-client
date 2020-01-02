import TWEEN from '@tweenjs/tween.js';
import { RoomObjectUpdateMessage } from '../../../../room/messages/RoomObjectUpdateMessage';
import { RoomObjectLogicBase } from '../../../../room/object/logic/RoomObjectLogicBase';
import { Position } from '../../../../room/utils/Position';
import { ObjectMoveUpdateMessage } from '../../messages/ObjectMoveUpdateMessage';
import { RoomObjectModelKey } from '../RoomObjectModelKey';

export class MovingObjectLogic extends RoomObjectLogicBase
{
    private static TWEEN_DURATION: number = 500;

    private _tween: TWEEN.Tween;
    private _liftAmount: number;

    constructor()
    {
        super();

        this._tween         = null;
        this._liftAmount    = 0;
    }

    public dispose(): void
    {
        this.stopTweening();

        this._liftAmount = 0;
        
        super.dispose();
    }

    public update(totalTimeRunning: number): void
    {
        super.update(totalTimeRunning);

        if(this._tween) TWEEN.update();

        const locationOffset = this.getLocationOffset();

        const model = this.object && this.object.model;

        if(!model) return;
        
        if(locationOffset)
        {
            if(this._liftAmount !== locationOffset.z)
            {
                this._liftAmount = locationOffset.z;

                model.setValue(RoomObjectModelKey.FURNITURE_LIFT_AMOUNT, this._liftAmount);
            }
        }
        else
        {
            if(this._liftAmount !== 0)
            {
                this._liftAmount = 0;

                model.setValue(RoomObjectModelKey.FURNITURE_LIFT_AMOUNT, this._liftAmount);
            }
        }
    }

    public processUpdateMessage(message: RoomObjectUpdateMessage): void
    {
        if(message instanceof ObjectMoveUpdateMessage) return this.processMoveMessage(message);

        super.processUpdateMessage(message);
    }

    private processMoveMessage(message: ObjectMoveUpdateMessage): void
    {
        if(!message || !this.object) return;

        this.stopTweening();

        if(message.position) this.object.setPosition(message.position);

        const goal = message.goal;

        if(goal)
        {
            if(message.isSlide)
            {
                this.slideToPosition(goal);

                return;
            }
            
            this.object.setPosition(goal);
        }
    }

    protected getLocationOffset(): Position
    {
        return null;
    }

    private slideToPosition(position: Position): void
    {
        if(!position || position.compareStrict(this.object.position)) return;

        let screenPosition: Position        = this.object.getScreenPosition();
        let goalScreenPosition: Position    = position.toScreenPosition();

        this.object.setTempPosition(screenPosition);

        goalScreenPosition.depth = position.calculatedDepth;

        this._tween = new TWEEN.Tween(this.object.tempPosition)
            .to({ x: goalScreenPosition.x, y: goalScreenPosition.y, depth: goalScreenPosition.depth }, MovingObjectLogic.TWEEN_DURATION)
            .onUpdate(() =>
            {
                this.object.updateCounter++;
            })
            .onComplete(() =>
            {
                this._tween = null;

                this.object.setPosition(position);
            })
            .start();
    }

    private stopTweening(): void
    {
        if(!this._tween) return;

        this._tween.stop();

        this._tween = null;
    }
}