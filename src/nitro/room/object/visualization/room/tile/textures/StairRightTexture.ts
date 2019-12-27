import { NitroConfiguration } from '../../../../../../../NitroConfiguration';
import { TileTexture } from './TileTexture';

export class StairRightTexture extends TileTexture
{
    public static TYPE: string = 'stairr';
    
    private static divideSteps(i: number): number
    {
        switch(i)
        {
            case 1: return 0;
            case 2: return 0.25;
            case 3: return 0.50;
            case 4: return 0.75;
            default: return i;
        }
    }

    protected static createGraphic(thickness: number = 0): PIXI.Graphics
    {
        const graphic = new PIXI.Graphics();

        const [ leftColor, rightColor ] = this.getColors();

        let points: PIXI.Point[] = [];

        for(let i = 4; i > 0; i--)
        {
            const divide    = this.divideSteps(i);
            const startX    = -Math.abs((-divide + 0.75) * NitroConfiguration.TILE_REAL_HEIGHT);
            const startY    = ((-divide + 0.75) * NitroConfiguration.TILE_HEIGHT) - divide * NitroConfiguration.TILE_REAL_HEIGHT;
            
            const verticies = [
                new PIXI.Point(startX, startY),
                new PIXI.Point(startX - NitroConfiguration.TILE_REAL_WIDTH / 8, startY + NitroConfiguration.TILE_REAL_HEIGHT / 8),
                new PIXI.Point(startX + 24, startY + 20),
                new PIXI.Point(startX + NitroConfiguration.TILE_REAL_WIDTH / 2, startY + NitroConfiguration.TILE_REAL_HEIGHT / 2)];

            points.push(...verticies);

            graphic.beginFill(NitroConfiguration.TILE_TOP_COLOR);
            graphic.lineStyle(2, NitroConfiguration.TILE_TOP_LINE_COLOR, 1, 1, true);
            graphic.moveTo(verticies[0].x, verticies[0].y);
            for(let i = 1; i < verticies.length; i++) graphic.lineTo(verticies[i].x, verticies[i].y);
            graphic.lineTo(verticies[0].x, verticies[0].y);
            graphic.endFill();

            if(thickness > 0)
            {
                graphic.beginFill(leftColor);
                graphic.lineStyle(1, leftColor);
                graphic.moveTo(verticies[1].x, verticies[1].y);
                graphic.lineTo(verticies[1].x, verticies[1].y + thickness);
                graphic.lineTo(verticies[2].x, verticies[2].y + thickness);
                graphic.lineTo(verticies[2].x, verticies[2].y);
                graphic.endFill();

                graphic.beginFill(rightColor);
                graphic.lineStyle(1, rightColor);
                graphic.moveTo(verticies[3].x, verticies[3].y);
                graphic.lineTo(verticies[3].x, verticies[3].y + thickness);
                graphic.lineTo(verticies[2].x, verticies[2].y + thickness);
                graphic.lineTo(verticies[2].x, verticies[2].y);
                graphic.endFill();
            }
        }

        this.POLYGON = new PIXI.Polygon(points);

        return graphic;
    }
}