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

        if(this._data) this._data.dispose();

        super.onDispose();
    }

    private generateMap(): void
    {
        this.resetMap();

        if(!this._data.heightMap) return;

        let y = 0;

        while(y < this._data.height)
        {
            let x = 0;

            while(x < this._data.width)
            {
                let height = this._data.heightMap[y][x];

                if(height === undefined) height = -110;

                if(height < 0)
                {
                    x++;

                    continue;
                }

                const tile = new RoomTile(new Position(x, y, height), RoomTileType.TILE);

                if(this._map[x] === undefined) this._map[x] = [];

                this._map[x][y] = tile;

                const sprite = tile.createGraphic();

                if(!sprite) continue;

                this._tiles.push(tile);

                sprite.x        += tile.position.calculateX;
                sprite.y        += tile.position.calculateY - tile.position.calculateZ;
                sprite.zIndex   = (x + y) * 1000;

                if(this._selfContainer) this._selfContainer.addCollision(tile.graphic);
                
                x++;
            }

            y++;
        }
    }
}