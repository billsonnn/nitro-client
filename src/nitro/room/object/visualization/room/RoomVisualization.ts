import { IObjectVisualizationData } from '../../../../../room/object/visualization/IRoomObjectVisualizationData';
import { RoomObjectSpriteVisualization } from '../../../../../room/object/visualization/RoomObjectSpriteVisualization';
import { Position } from '../../../../../room/utils/Position';
import { RoomVisualizationData } from './RoomVisualizationData';
import { RoomTile } from './tile/RoomTile';
import { RoomTileType } from './tile/RoomTileType';

export class RoomVisualization extends RoomObjectSpriteVisualization
{
    protected _data: RoomVisualizationData;

    private _map: RoomTile[][];
    private _tiles: RoomTile[];

    constructor()
    {
        super();

        this._data  = null;

        this._map   = [];
        this._tiles = [];

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

    private resetMap(): void
    {
        if(!this._tiles || !this._tiles.length) return;

        for(let tile of this._tiles)
        {
            if(!tile) continue;

            tile.dispose();
        }

        this._map   = [];
        this._tiles = [];
    }

    protected onDispose(): void
    {
        this.resetMap();

        if(this._data && !this._data.saveable) this._data.dispose();

        super.onDispose();
    }

    private generateMap(): void
    {
        this.resetMap();

        const mapHeight = this._data.modelParser.height;
        const mapWidth  = this._data.modelParser.width;

        let doorX = 0;
        let doorY = 0;
        let doorZ = 0;
        let doorDirection = 0;

        let y = -1;

        while(y < mapHeight)
        {
            y++;

            let x = -1;

            while(x < mapWidth)
            {
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

                let tile: RoomTile = null;
                
                const nextTileHeight = this._data.modelParser.getHeight(x, y - 1);

                if(nextTileHeight >= 0)
                {
                    if(nextTileHeight === (height + 1)) tile = new RoomTile(position, RoomTileType.STAIR_RIGHT);
                }

                if(!tile)
                {
                    const nextTileHeight = this._data.modelParser.getHeight(x - 1, y);

                    if(nextTileHeight >= 0)
                    {
                        if(nextTileHeight === (height + 1)) tile = new RoomTile(position, RoomTileType.STAIR_LEFT);
                    }
                }

                if(!tile) tile = new RoomTile(position, RoomTileType.TILE);

                if(this._map[x] === undefined) this._map[x] = [];

                this._map[x][y] = tile;

                const sprite = tile.createGraphic();

                if(!sprite) continue;

                this._tiles.push(tile);

                sprite.x    = tile.position.calculateX;
                sprite.y    = tile.position.calculateY - tile.position.calculateZ;

                if(this._selfContainer) this._selfContainer.addCollision(tile.graphic);
            }
        }

        const door = new Position(doorX, doorY, doorZ, doorDirection);
    }
}