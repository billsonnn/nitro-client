import { Disposable } from '../../../core/common/disposable/Disposable';

export class LegacyWallGeometry extends Disposable
{
    private static LEFT: string     = 'l';
    private static RIGHT: string    = 'r';

    private _scale: number;
    private _heightMap: number[][];
    private _width: number;
    private _height: number;
    private _floorHeight: number;

    constructor()
    {
        super();

        this._scale         = 64;
        this._heightMap     = [];
        this._width         = 0;
        this._height        = 0;
        this._floorHeight   = 0;
    }

    public initialize(width: number, height: number, floorHeight: number): void
    {
        if((width <= this._width) && (height <= this._height))
        {
            this._width         = width;
            this._height        = height;
            this._floorHeight   = floorHeight;

            return;
        }

        this.reset();

        let iterator: number = 0;

        while(iterator < height)
        {
            const row: number[] = [];

            this._heightMap.push(row);

            let subIterator: number = 0;

            while(subIterator < width)
            {
                row.push(0);
                subIterator++;
            }

            iterator++;
        }

        this._width         = width;
        this._height        = height;
        this._floorHeight   = floorHeight;
    }

    private reset(): void
    {
        this._heightMap = [];
    }
}