import { RoomObjectVariable } from '../../RoomObjectVariable';
import { FurnitureAnimatedVisualization } from './FurnitureAnimatedVisualization';

export class FurnitureVoteCounterVisualization extends FurnitureAnimatedVisualization
{
    private static ONES_SPRITE: string      = 'ones_sprite';
    private static TENS_SPRITE: string      = 'tens_sprite';
    private static HUNDREDS_SPRITE: string  = 'hundreds_sprite';
    private static _Str_17839: number       = -1;

    protected getFrameNumber(scale: number, layerId: number): number
    {
        const result    = this.object.model.getValue(RoomObjectVariable.FURNITURE_VOTE_COUNTER_COUNT) as number;
        const tag       = this.getLayerTag(scale, this.direction, layerId);

        switch(tag)
        {
            case FurnitureVoteCounterVisualization.ONES_SPRITE: return (result % 10);
            case FurnitureVoteCounterVisualization.TENS_SPRITE: return ((result / 10) % 10);
            case FurnitureVoteCounterVisualization.HUNDREDS_SPRITE: return ((result / 100) % 10);
            default: return super.getFrameNumber(scale, layerId);
        }
    }

    protected getLayerAlpha(scale: number, direction: number, layerId: number): number
    {
        const result = this.object.model.getValue(RoomObjectVariable.FURNITURE_VOTE_COUNTER_COUNT) as number;

        if(result === FurnitureVoteCounterVisualization._Str_17839)
        {
            const tag = this.getLayerTag(scale, direction, layerId);

            switch(tag)
            {
                case FurnitureVoteCounterVisualization.ONES_SPRITE:
                case FurnitureVoteCounterVisualization.TENS_SPRITE:
                case FurnitureVoteCounterVisualization.HUNDREDS_SPRITE:
                    return 0;
            }
        }

        return super.getLayerAlpha(scale, direction, layerId);
    }
}