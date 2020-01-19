import { Direction } from './Direction';
import { IVector3D } from './IVector3D';
import { Vector3d } from './Vector3d';

export class AffectedVectors
{
    public static getVectors(sizeX: number, sizeY: number, vector: IVector3D, direction: IVector3D): IVector3D[]
    {
        if(!vector) return null;
            
        const vectors: IVector3D[] = [];

        if(direction.x === Direction.EAST || direction.x === Direction.WEST) [ sizeX, sizeY ] = [ sizeY, sizeX ];

        for(let tempX = vector.x; tempX < vector.x + sizeX; tempX++)
        {
            for(let tempY = vector.y; tempY < vector.y + sizeY; tempY++) vectors.push(new Vector3d(tempX, tempY));
        }

        if(!vectors || !vectors.length) return null;

        return vectors;
    }
}