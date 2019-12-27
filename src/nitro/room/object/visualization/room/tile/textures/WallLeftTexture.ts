import { NitroConfiguration } from '../../../../../../../NitroConfiguration';
import { WallRightTexture } from './WallRightTexture';

export class WallLeftTexture extends WallRightTexture
{
    public static TYPE: string = 'walll';

    protected static getColors(): [ number, number ]
    {
        const [ leftColor, rightColor ] = super.getColors();

        return [ rightColor, leftColor ];
    }

    protected static createGraphic(height: number = 0): PIXI.Graphics
    {
        const graphic = new PIXI.Graphics();

        const [ leftColor, rightColor ] = this.getColors();

        const divide    = 0;
        const startX    = -Math.abs((-divide + 0.75) * NitroConfiguration.TILE_REAL_HEIGHT);
        const startY    = ((-divide + 0.75) * NitroConfiguration.TILE_HEIGHT) - divide * NitroConfiguration.TILE_REAL_HEIGHT;
        
        const verticies = [
            new PIXI.Point(startX, startY),
            new PIXI.Point(startX - NitroConfiguration.TILE_REAL_WIDTH / 8, startY + NitroConfiguration.TILE_REAL_HEIGHT / 8),
            new PIXI.Point(startX + 24, startY + 20),
            new PIXI.Point(startX + NitroConfiguration.TILE_REAL_WIDTH / 2, startY + NitroConfiguration.TILE_REAL_HEIGHT / 2)];

        graphic.beginFill(NitroConfiguration.WALL_TOP_COLOR);
        graphic.moveTo(verticies[0].x, verticies[0].y);
        for(let i = 1; i < verticies.length; i++) graphic.lineTo(verticies[i].x, verticies[i].y);
        graphic.lineTo(verticies[0].x, verticies[0].y);
        graphic.endFill();

        if(height > 0)
        {
            graphic.beginFill(leftColor);
            graphic.moveTo(verticies[1].x, verticies[1].y);
            graphic.lineTo(verticies[1].x, verticies[1].y + height);
            graphic.lineTo(verticies[2].x, verticies[2].y + height);
            graphic.lineTo(verticies[2].x, verticies[2].y);
            graphic.endFill();

            graphic.beginFill(rightColor);
            graphic.moveTo(verticies[3].x, verticies[3].y);
            graphic.lineTo(verticies[3].x, verticies[3].y + height);
            graphic.lineTo(verticies[2].x, verticies[2].y + height);
            graphic.lineTo(verticies[2].x, verticies[2].y);
            graphic.endFill();
        }

        return graphic;
    }
}