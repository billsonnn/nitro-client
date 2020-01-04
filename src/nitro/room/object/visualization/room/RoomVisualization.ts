import { NitroConfiguration } from '../../../../../NitroConfiguration';
import { IObjectVisualizationData } from '../../../../../room/object/visualization/IRoomObjectVisualizationData';
import { RoomObjectSpriteVisualization } from '../../../../../room/object/visualization/RoomObjectSpriteVisualization';
import { Direction } from '../../../../../room/utils/Direction';
import { Position } from '../../../../../room/utils/Position';
import { RoomVisualizationData } from './RoomVisualizationData';
import { StairLeftTexture } from './tile/textures/StairLeftTexture';
import { StairRightTexture } from './tile/textures/StairRightTexture';
import { TileTexture } from './tile/textures/TileTexture';

export class RoomVisualization extends RoomObjectSpriteVisualization
{
    protected _data: RoomVisualizationData;

    constructor()
    {
        super();

        this._data          = null;
        this._selfContained = true;
    }

    public initialize(data: IObjectVisualizationData): boolean
    {
        if(!(data instanceof RoomVisualizationData)) return false;
        
        this._data = data;

        super.initialize(data);

        this.generateMap();

        if(this._selfContainer)
        {
            this._selfContainer.x -= 35;
            this._selfContainer.y -= 2;
        }

        return true;
    }

    protected onDispose(): void
    {
        if(this._data && !this._data.saveable) this._data.dispose();

        super.onDispose();
    }

    private generateMap(): void
    {
        const mapHeight = this._data.modelParser.height;
        const mapWidth  = this._data.modelParser.width;

        let doorX = 0;
        let doorY = 0;
        let doorZ = 0;
        let doorDirection = 0;

        let y = -1;

        let counter = -1;

        while(y < mapHeight)
        {
            y++;

            let x = -1;

            while(x < mapWidth)
            {
                counter++;

                x++;

                const height = this._data.modelParser.getHeight(x, y);

                if(height < 0) continue;

                if((((y > 0) && (y < (mapHeight - 1))) || ((x > 0) && (x < (mapWidth - 1)))) && height !== -110)
                {
                    if(((this._data.modelParser.getHeight(x, (y - 1)) === -110) && (this._data.modelParser.getHeight((x - 1), y) === -110)) && (this._data.modelParser.getHeight(x, (y + 1)) === -110))
                    {
                        doorX           = x;
                        doorY           = y;
                        doorZ           = height;
                        doorDirection   = 90;
                    }

                    if(((this._data.modelParser.getHeight(x, (y - 1)) === -110) && (this._data.modelParser.getHeight((x - 1), y) === -110)) && (this._data.modelParser.getHeight((x + 1), y) === -110))
                    {
                        doorX           = x;
                        doorY           = y;
                        doorZ           = height;
                        doorDirection   = 180;
                    }
                }

                const position = new Position(x, y, height);

                let tileTexture: typeof TileTexture = TileTexture;
                let isStair: boolean                = false;
                
                let nextTileHeight = this._data.modelParser.getHeight(x, y - 1);

                if(nextTileHeight >= 0)
                {
                    if(nextTileHeight === (height + 1))
                    {
                        tileTexture = StairRightTexture;

                        isStair = true;
                    }
                }
                
                nextTileHeight = this._data.modelParser.getHeight(x - 1, y);

                if(nextTileHeight === (height + 1))
                {
                    tileTexture = StairLeftTexture;

                    isStair = true;
                }

                const sprite = this.createAndAddSprite(`${ counter }`, null, tileTexture.getTexture(NitroConfiguration.TILE_THICKNESS));

                sprite.x            = position.calculateX;
                sprite.y            = position.calculateY - position.calculateZ;
                sprite.hitArea      = tileTexture.POLYGON;
                sprite.tilePosition = position;

                if(isStair) sprite.y -= NitroConfiguration.TILE_HEIGHT + (NitroConfiguration.TILE_HEIGHT / 2);
            }
        }

        this.addDoor(new Position(doorX, doorY, doorZ, Direction.angleToDirection(doorDirection)));
    }

    private addDoor(position: Position): void
    {
        if(!position) return;

        // sprite.x        = tile.position.calculateX - NitroConfiguration.TILE_HEIGHT
        // sprite.y        = (tile.position.calculateY - tile.position.calculateZ) - NitroConfiguration.WALL_HEIGHT + NitroConfiguration.TILE_THICKNESS
        // sprite.zIndex   = tile.position.depth + 500;

        // this.object.room.renderer.collision.addCollision(sprite);
    }

    public getPositionForPoint(point: PIXI.Point, scale: number = 1): Position
    {
        if(!point || !this.sprites || !this.sprites.size) return null;

        point.x -= NitroConfiguration.TILE_WIDTH * scale;

        if(this._selfContainer)
        {
            for(let sprite of this.sprites.values())
            {
                if(!sprite || !sprite.hitArea) continue;

                const transform = sprite.worldTransform.applyInverse(point);

                if(!sprite.hitArea.contains(transform.x, transform.y)) continue;

                if(sprite.tilePosition) return sprite.tilePosition;

                break;
            }
        }

        return null;
    }
}