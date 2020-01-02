import { DoorWallRightTexture } from './DoorWallRightTexture';

export class DoorWallLeftTexture extends DoorWallRightTexture
{
    public static TYPE: string = 'walll';

    protected static getColors(): [ number, number ]
    {
        const [ leftColor, rightColor ] = super.getColors();

        return [ rightColor, leftColor ];
    }

    protected static createGraphic(thickness: number = 0): PIXI.Graphics
    {
        const graphic = super.createGraphic(thickness);

        graphic.scale.x = -1;

        graphic.x += 24;
        graphic.y += 10;

        return graphic;
    }
}