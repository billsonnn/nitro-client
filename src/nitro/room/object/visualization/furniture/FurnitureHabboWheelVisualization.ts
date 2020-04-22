import { RoomObjectVisualizationType } from '../../RoomObjectVisualizationType';
import { FurnitureAnimatedVisualization } from './FurnitureAnimatedVisualization';

export class FurnitureHabboWheelVisualization extends FurnitureAnimatedVisualization
{
    public static TYPE: string = RoomObjectVisualizationType.FURNITURE_HABBOWHEEL;

    private static ANIMATION_ID_OFFSET_SLOW1: number    = 10;
    private static ANIMATION_ID_OFFSET_SLOW2: number    = 20;
    private static _Str_7627: number                    = 31;
    private static _Str_4186: number                    = 32;

    private _stateQueue: number[];
    private _running: boolean;

    constructor()
    {
        super();

        this._stateQueue    = [];
        this._running       = false;
    }

    protected setAnimation(animationId: number): void
    {
        if(animationId === -1)
        {
            if(!this._running)
            {
                this._running       = true;
                this._stateQueue    = [];

                this._stateQueue.push(FurnitureHabboWheelVisualization._Str_7627);
                this._stateQueue.push(FurnitureHabboWheelVisualization._Str_4186);

                return;
            }
        }

        if((animationId > 0) && (animationId <= FurnitureHabboWheelVisualization.ANIMATION_ID_OFFSET_SLOW1))
        {
            if(this._running)
            {
                this._running       = false;
                this._stateQueue    = [];

                this._stateQueue.push(FurnitureHabboWheelVisualization.ANIMATION_ID_OFFSET_SLOW1 + animationId);
                this._stateQueue.push(FurnitureHabboWheelVisualization.ANIMATION_ID_OFFSET_SLOW2 + animationId);
                this._stateQueue.push(animationId);

                return;
            }

            super.setAnimation(animationId);
        }
    }

    protected updateAnimation(scale: number): number
    {
        if(this.getLastFramePlayed(1) && this.getLastFramePlayed(2) && this.getLastFramePlayed(3))
        {
            if(this._stateQueue.length) super.setAnimation(this._stateQueue.shift());
        }

        return super.updateAnimation(scale);
    }
}