import { NitroConfiguration } from '../../../../../../../NitroConfiguration';
import { TileTexture } from './TileTexture';

export class DoorWallRightTexture extends TileTexture
{
    public static TYPE: string = 'doorwr';

    protected static getColors(): [ number, number ]
    {
        let leftColor   = NitroConfiguration.WALL_LEFT_COLOR;
        let rightColor  = NitroConfiguration.WALL_RIGHT_COLOR;

        return [ leftColor, rightColor ];
    }

    protected static createGraphic(height: number = 0): PIXI.Graphics
    {
        const graphic = new PIXI.Graphics();

        const [ leftColor, rightColor ] = this.getColors();
        
        const startX    = 0;
        const startY    = 0;
        
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
            graphic.lineTo(verticies[1].x, verticies[1].y + height - 86);
            graphic.lineTo(verticies[2].x, verticies[2].y + height - 86);
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