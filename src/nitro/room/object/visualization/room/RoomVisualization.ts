import { NitroConfiguration } from '../../../../../NitroConfiguration';
import { IRoomObjectSprite } from '../../../../../room/object/visualization/IRoomObjectSprite';
import { IObjectVisualizationData } from '../../../../../room/object/visualization/IRoomObjectVisualizationData';
import { RoomObjectSprite } from '../../../../../room/object/visualization/RoomObjectSprite';
import { RoomObjectSpriteVisualization } from '../../../../../room/object/visualization/RoomObjectSpriteVisualization';
import { Direction } from '../../../../../room/utils/Direction';
import { IVector3D } from '../../../../../room/utils/IVector3D';
import { Vector3d } from '../../../../../room/utils/Vector3d';
import { RoomVisualizationData } from './RoomVisualizationData';
import { DoorWallLeftTexture } from './tile/textures/DoorWallLeftTexture';
import { DoorWallRightTexture } from './tile/textures/DoorWallRightTexture';
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
            this._selfContainer.x      -= NitroConfiguration.TILE_WIDTH + 2;
            this._selfContainer.y      -= NitroConfiguration.TILE_HEIGHT + 1;
            this._selfContainer.zIndex  = -10000000;
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
        const mapHeight     = this._data.modelParser.height;
        const mapWidth      = this._data.modelParser.width;

        let doorX           = 0;
        let doorY           = 0;
        let doorZ           = 0;
        let doorDirection   = 0;

        let y               = -1;
        let counter         = -1;

        while(y < mapHeight)
        {
            y++;

            let x = -1;

            while(x < mapWidth)
            {
                counter++;

                x++;

                let thickness: number = NitroConfiguration.TILE_THICKNESS;

                const height = this._data.modelParser.getHeight(x, y);

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

                if(height < 0) continue;

                const location = new Vector3d(x, y, height);

                let tileTextures: typeof TileTexture[]  = [ TileTexture ];
                let isStair: boolean                    = false;

                let nextTileHeight = this._data.modelParser.getHeight(x, y - 1);

                if(nextTileHeight >= 0)
                {
                    if(nextTileHeight === (height + 1))
                    {
                        tileTextures = [ StairRightTexture ];

                        isStair = true;
                    }
                }
                    
                nextTileHeight = this._data.modelParser.getHeight(x - 1, y);

                if(nextTileHeight === (height + 1))
                {
                    tileTextures = [ StairLeftTexture ];

                    isStair = true;
                }

                for(let [ index, texture ] of tileTextures.entries())
                {
                    counter += index;
                    
                    let sprite: IRoomObjectSprite = this.createAndAddSprite(`${ counter }`, null, texture.getTexture(thickness));

                    const screenLocation = location.toScreen();

                    sprite.x            = screenLocation.x;
                    sprite.y            = screenLocation.y;
                    sprite.hitArea      = texture.POLYGON;
                    sprite.tilePosition = location;

                    if(isStair) sprite.y -= NitroConfiguration.TILE_HEIGHT + (NitroConfiguration.TILE_HEIGHT / 2);
                }
            }
        }

        if(NitroConfiguration.WALLS_ENABLED) this.addDoor(doorX, doorY, doorZ, Direction.angleToDirection(doorDirection));
    }

    private addDoor(x: number, y: number, z: number, direction: number): void
    {
        const texture: typeof TileTexture = direction === Direction.EAST ? DoorWallLeftTexture : DoorWallRightTexture;
        
        if(!texture) return;

        const doorTexture = texture.getTexture(NitroConfiguration.WALL_HEIGHT);

        const sprite = new RoomObjectSprite(this.object, 'door', null, doorTexture);

        const location = new Vector3d(x, y, z).toScreen();

        location.y -= NitroConfiguration.WALL_HEIGHT - NitroConfiguration.TILE_THICKNESS;

        //sprite.zIndex   = position.depth + 500;

        this.object.room.renderer.collision.addCollision(sprite);
    }

    public getPositionForPoint(point: PIXI.Point, scale: number = 1): IVector3D
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