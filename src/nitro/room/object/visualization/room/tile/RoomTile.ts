import { NitroConfiguration } from '../../../../../../NitroConfiguration';
import { Position } from '../../../../../../room/utils/Position';
import { RoomTileType } from './RoomTileType';
import { StairLeftTexture } from './textures/StairLeftTexture';
import { StairRightTexture } from './textures/StairRightTexture';
import { TileTexture } from './textures/TileTexture';
import { WallLeftTexture } from './textures/WallLeftTexture';
import { WallRightTexture } from './textures/WallRightTexture';

export class RoomTile
{
    private _graphic: PIXI.Sprite;

    private _position: Position;
    private _type: RoomTileType;
    private _height: number;

    constructor(position: Position, type: RoomTileType = RoomTileType.TILE)
    {
        if(!position || !type) throw new Error('invalid_tile');

        this._graphic   = null;

        this._position  = position;
        this._type      = type;
        this._height    = -1;
    }

    public dispose(): void
    {
        if(this._graphic)
        {
            if(this._graphic.parent) this.graphic.parent.removeChild(this._graphic);

            this._graphic.destroy();
        }

        this._graphic = null;
    }

    public createGraphic(): PIXI.Sprite
    {
        this.destroyGraphic();

        let graphic: PIXI.Sprite = null;

        if(this._type === RoomTileType.STAIR_RIGHT) graphic = StairRightTexture.createSprite(NitroConfiguration.TILE_THICKNESS);

        else if(this._type === RoomTileType.STAIR_LEFT) graphic = StairLeftTexture.createSprite(NitroConfiguration.TILE_THICKNESS);

        else if(this._type === RoomTileType.WALL_RIGHT) graphic = WallRightTexture.createSprite(NitroConfiguration.WALL_HEIGHT);

        else if(this._type === RoomTileType.WALL_LEFT) graphic = WallLeftTexture.createSprite(NitroConfiguration.WALL_HEIGHT);

        else graphic = TileTexture.createSprite(NitroConfiguration.TILE_THICKNESS);

        if(!graphic) return null;

        this._graphic = graphic;

        return graphic;
    }

    private destroyGraphic(): void
    {
        if(!this._graphic) return;

        if(this._graphic.parent) this._graphic.parent.removeChild(this._graphic);

        this._graphic.destroy();

        this._graphic = null;
    }

    public containsPoint(point: PIXI.Point): boolean
    {
        if(!this._graphic || !this._graphic.hitArea) return false;

        point = this._graphic.worldTransform.applyInverse(point);

        return this._graphic.hitArea.contains(point.x, point.y);
    }

    public get graphic(): PIXI.Sprite
    {
        return this._graphic;
    }

    public get position(): Position
    {
        return this._position;
    }

    public get type(): RoomTileType
    {
        return this._type;
    }

    public get height(): number
    {
        return this._height;
    }

    public set height(height: number)
    {
        this._height = height;
    }
}