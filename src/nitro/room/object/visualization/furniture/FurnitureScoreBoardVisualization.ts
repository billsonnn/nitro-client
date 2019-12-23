import { ObjectVisualizationType } from '../ObjectVisualizationType';
import { FurnitureAnimatedVisualization } from './FurnitureAnimatedVisualization';

export class FurnitureScoreBoardVisualization extends FurnitureAnimatedVisualization
{
    public static TYPE: string = ObjectVisualizationType.FURNITURE_SCORE_BOARD; 

    private static ONES_SPRITE: string      = 'ones_sprite';
    private static TENS_SPRITE: string      = 'tens_sprite';
    private static HUNDREDS_SPRITE: string  = 'hundreds_sprite';
    private static THOUSANDS_SPRITE: string = 'thousands_sprite';

    protected getFrameNumber(layerId: number): number
    {
        const tag       = this.getLayerTag(this.direction, layerId);
        const animation = this.object.state;

        switch(tag)
        {
            case FurnitureScoreBoardVisualization.ONES_SPRITE: return Math.floor(animation % 10);
            case FurnitureScoreBoardVisualization.TENS_SPRITE: return Math.floor((animation / 10) % 10);
            case FurnitureScoreBoardVisualization.HUNDREDS_SPRITE: return Math.floor((animation / 100) % 10);
            case FurnitureScoreBoardVisualization.THOUSANDS_SPRITE: return Math.floor((animation / 1000) % 10);
            default: return super.getFrameNumber(layerId);
        }
    }
}