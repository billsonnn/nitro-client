import { NitroConfiguration } from '../../../../../../../NitroConfiguration';
import { TileTexture } from './TileTexture';

export class WallCornerTexture extends TileTexture
{
    public static TYPE: string = 'wallc';

    public static createGraphic(thickness: number = 0.75): PIXI.Graphics
    {
        const graphic = new PIXI.Graphics();

        const startX    = -Math.abs(0.75 * NitroConfiguration.TILE_REAL_HEIGHT);
        const startY    = 0.75 * NitroConfiguration.TILE_HEIGHT;

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

        return graphic;
    }
}