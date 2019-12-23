import { Direction } from '../../../../../room/utils/Direction';
import { ObjectVisualizationType } from '../ObjectVisualizationType';
import { FurnitureVisualization } from './FurnitureVisualization';

export class FurnitureBackgroundVisualization extends FurnitureVisualization
{
    public static TYPE: string = ObjectVisualizationType.FURNITURE_BG;

    public getImageOffset(width: number, height: number, direction: number): [ number, number ]
    {
        switch(direction)
        {
            case Direction.NORTH_EAST:  return [ 0, -height ];
            case Direction.SOUTH_EAST:  return [ 0, 0 ];
            case Direction.SOUTH:       return [ -width / 2, -height / 2 ];
            case Direction.SOUTH_WEST:  return [ -width, 0 ];
            case Direction.NORTH_WEST:  return [ -width, -height ];
        }

        return [ 0, 0 ];
    }
}