import { RoomObjectVisualizationType } from '../../RoomObjectVisualizationType';
import { FurnitureAnimatedVisualization } from './FurnitureAnimatedVisualization';

export class FurnitureCounterClockVisualization extends FurnitureAnimatedVisualization
{
    public static TYPE: string = RoomObjectVisualizationType.FURNITURE_COUNTER_CLOCK;

    private static SECONDS_SPRITE: string       = 'seconds_sprite';
    private static TEN_SECONDS_SPRITE: string   = 'ten_seconds_sprite';
    private static MINUTES_SPRITE: string       = 'minutes_sprite';
    private static TEN_MINUTES_SPRITE: string   = 'ten_minutes_sprite';

    protected getFrameNumber(layerId: number): number
    {
        const tag       = this.getLayerTag(this.direction, layerId);
        const animation = this.object.state;

        switch(tag)
        {
            case FurnitureCounterClockVisualization.SECONDS_SPRITE: return Math.floor((animation % 60) % 10);
            case FurnitureCounterClockVisualization.TEN_SECONDS_SPRITE: return Math.floor((animation % 60) / 10);
            case FurnitureCounterClockVisualization.MINUTES_SPRITE: return Math.floor((animation / 60) % 10);
            case FurnitureCounterClockVisualization.TEN_MINUTES_SPRITE: return Math.floor(((animation / 60) / 10) % 10);
            default: return super.getFrameNumber(layerId);
        }
    }
}