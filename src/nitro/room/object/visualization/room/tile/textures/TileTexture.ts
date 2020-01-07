import { NitroConfiguration } from '../../../../../../../NitroConfiguration';
import { NitroInstance } from '../../../../../../NitroInstance';

export class TileTexture
{
    public static TYPE: string = 'tile';

    public static TEXTURES: Map<string, PIXI.RenderTexture> = new Map();

    public static POLYGON: PIXI.Polygon = null;

    protected static getLookup(thickness: number): string
    {
        let lookup = thickness.toString();

        lookup += this.TYPE;

        return lookup;
    }

    public static getTexture(thickness: number): PIXI.RenderTexture
    {
        if(thickness === null) return null;

        const texture = this.TEXTURES.get(this.getLookup(thickness));

        if(!texture) return this.createTexture(thickness);
        
        return texture;
    }

    protected static getColors(): [ number, number ]
    {
        let leftColor   = NitroConfiguration.TILE_LEFT_COLOR;
        let rightColor  = NitroConfiguration.TILE_RIGHT_COLOR;

        return [ leftColor, rightColor ];
    }

    protected static createTexture(thickness: number = 0): PIXI.RenderTexture
    {
        const graphic = this.createGraphic(thickness);

        if(!graphic) return null;

        const texture = NitroInstance.instance.renderer.pixiRenderer.generateTexture(graphic, PIXI.SCALE_MODES.NEAREST, 1);

        if(!texture) return null;

        const lookup = this.getLookup(thickness);

        this.TEXTURES.set(lookup, texture);

        return texture;
    }

    protected static createGraphic(thickness: number = 0): PIXI.Graphics
    {
        const graphic = new PIXI.Graphics();

        const [ leftColor, rightColor ] = this.getColors();

        const verticies = [
            new PIXI.Point(0, 0),
            new PIXI.Point(-NitroConfiguration.TILE_REAL_HEIGHT, NitroConfiguration.TILE_REAL_HEIGHT / 2),
            new PIXI.Point(0, NitroConfiguration.TILE_REAL_HEIGHT),
            new PIXI.Point(NitroConfiguration.TILE_REAL_WIDTH / 2, NitroConfiguration.TILE_REAL_HEIGHT / 2),
            new PIXI.Point(0, 0)];

        graphic.beginFill(NitroConfiguration.TILE_TOP_COLOR);
        graphic.lineStyle(2, NitroConfiguration.TILE_TOP_LINE_COLOR, 1, 1, true);
        graphic.moveTo(verticies[0].x, verticies[0].y);
        for(let i = 1; i < verticies.length; i++) graphic.lineTo(verticies[i].x, verticies[i].y);
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

        this.POLYGON = new PIXI.Polygon(verticies);

        return graphic;
    }

    public static createSprite(thickness: number): PIXI.Sprite
    {
        const texture = this.getTexture(thickness);

        if(!texture) return null;

        const sprite = PIXI.Sprite.from(texture);

        return sprite;
    }
}