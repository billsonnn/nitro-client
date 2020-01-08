import { Direction } from './Direction';
import { Position } from './Position';

export class AffectedPositions
{
    public static getPositions(sizeX: number, sizeY: number, position: Position): Position[]
    {
        if(!position) return null;
            
        const positions: Position[] = [];

        if(position.direction === Direction.EAST || position.direction === Direction.WEST) [ sizeX, sizeY ] = [ sizeY, sizeX ];

        for(let tempX = position.x; tempX < position.x + sizeX; tempX++)
        {
            for(let tempY = position.y; tempY < position.y + sizeY; tempY++) positions.push(new Position(tempX, tempY));
        }

        if(!positions.length) return null;

        return positions;
    }
}