import { RoomObjectVisualizationType } from '../../RoomObjectVisualizationType';
import { FurnitureAnimatedVisualization } from './FurnitureAnimatedVisualization';

export class FurnitureQueueTileVisualization extends FurnitureAnimatedVisualization
{
    public static TYPE: string = RoomObjectVisualizationType.FURNITURE_QUEUE_TILE;

    public static ROLL_ANIMATION_STATE: number = 2;
    public static ROLL_FINISHED_STATE: number  = 0;

    private static ROLL_COUNTER: number = 15;

    private _animationCounter: number;

    constructor()
    {
        super();

        this._animationCounter = -1;
    }

    protected setAnimation(animationId: number, transition: boolean = true): void
    {
        if(animationId === FurnitureQueueTileVisualization.ROLL_ANIMATION_STATE)
        {
            this._animationCounter = FurnitureQueueTileVisualization.ROLL_COUNTER;
        }
        else this._animationCounter = -1;

        return super.setAnimation(animationId);
    }

    protected updateAnimation(): number
    {
        if(this._animationCounter === 0) this.setAnimation(FurnitureQueueTileVisualization.ROLL_FINISHED_STATE);
        
        else if(this._animationCounter > 0) this._animationCounter--;

        return super.updateAnimation();
    }
}