import { AffectedPositions } from '../../../room/utils/AffectedPositions';
import { Position } from '../../../room/utils/Position';

export class FurnitureStackingHeightMap
{
    private _width: number;
    private _height: number;
    private _heights: Map<number, number>;
    private _isStackable: Map<number, boolean>;
    private _isTile: Map<number, boolean>;

    constructor(width: number, height: number)
    {
        this._width         = width;
        this._height        = height;
        this._heights       = new Map();
        this._isStackable   = new Map();
        this._isTile        = new Map();
    }

    private isValidCoordinate(x: number, y: number): boolean
    {
        return ((x >= 0) && (x < this._width) && (y >= 0) && (y < this._height));
    }

    public getHeight(x: number, y: number): number
    {
        if(!this.isValidCoordinate(x, y)) return -1;

        const height = this._heights.get((y * this._width) + x);

        if(height === undefined) return -1;

        return height;
    }

    public setHeight(x: number, y: number, height: number): void
    {
        if(!this.isValidCoordinate(x, y)) return;

        this._heights.set((y * this._width) + x, height);
    }

    public isStackable(x: number, y: number): boolean
    {
        if(!this.isValidCoordinate(x, y)) return false;

        return this._isStackable.get((y * this._width) + x);
    }

    public setStackable(x: number, y: number, isStackable: boolean): void
    {
        if(!this.isValidCoordinate(x, y)) return;

        this._isStackable.set((y * this._width) + x, isStackable);
    }

    public isTile(x: number, y: number): boolean
    {
        if(!this.isValidCoordinate(x, y)) return false;

        return this._isTile.get((y * this._width) + x);
    }

    public setTile(x: number, y: number, isTile: boolean): void
    {
        if(!this.isValidCoordinate(x, y)) return;

        this._isTile.set((y * this._width) + x, isTile);
    }

    public getValidPlacement(position: Position, sizeX: number, sizeY: number, stackable: boolean = false): Position
    {
        const positions = AffectedPositions.getPositions(sizeX, sizeY, position);

        if(!positions || !positions.length) return null;

        const goalHeight = this.getHeight(position.x, position.y);

        for(let pos of positions)
        {
            if(!pos) continue;

            if((!this.isTile(pos.x, pos.y) || !this.isStackable(pos.x, pos.y)) && !stackable) return null;

            const height = this.getHeight(pos.x, pos.y);

            if(height !== goalHeight) return null;
        }

        return new Position(position.x, position.y, goalHeight, position.direction);
    }

    public get width(): number
    {
        return this._width;
    }

    public get height(): number
    {
        return this._height;
    }
}