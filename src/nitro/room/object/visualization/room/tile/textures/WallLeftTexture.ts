import { WallRightTexture } from './WallRightTexture';

export class WallLeftTexture extends WallRightTexture
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

        return graphic;
    }
}