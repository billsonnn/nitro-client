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

    public dispose(): void
    {
        
    }

    private isValidCoordinate(x: number, y: number): boolean
    {
        return ((x >= 0) && (x < this._width) && (y >= 0) && (y < this._height));
    }

    public getHeight(x: number, y: number): number
    {
        return (this.isValidCoordinate(x, y)) ? this._heights.get((y * this._width) + x) : 0;
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

    public _Str_20406(k: number, _arg_2: number, _arg_3: number, _arg_4: number, _arg_5: number, _arg_6: number, _arg_7: number, _arg_8: number, _arg_9: boolean, _arg_10: number = -1): boolean
    {
        var _local_12 = 0;
        var _local_13 = 0;

        if(!this.isValidCoordinate(k, _arg_2) || !this.isValidCoordinate(((k + _arg_3) - 1), ((_arg_2 + _arg_4) - 1))) return false;

        if(((_arg_5 < 0) || (_arg_5 >= this._width))) _arg_5 = 0;

        if(((_arg_6 < 0) || (_arg_6 >= this._height))) _arg_6 = 0;

        _arg_7 = Math.min(_arg_7, (this._width - _arg_5));
        _arg_8 = Math.min(_arg_8, (this._height - _arg_6));

        if(_arg_10 === -1) _arg_10 = this.getHeight(k, _arg_2);

        var _local_11 = _arg_2;

        while (_local_11 < (_arg_2 + _arg_4))
        {
            _local_12 = k;

            while(_local_12 < (k + _arg_3))
            {
                if(((((_local_12 < _arg_5) || (_local_12 >= (_arg_5 + _arg_7))) || (_local_11 < _arg_6)) || (_local_11 >= (_arg_6 + _arg_8))))
                {
                    _local_13 = ((_local_11 * this._width) + _local_12);

                    const tile = this._isTile.get(_local_13);
                    
                    if(_arg_9)
                    {
                        if(tile === undefined) return false;
                    }
                    else
                    {
                        const stackable = this._isStackable.get(_local_13);
                        const height    = this._heights.get(_local_13);

                        if((stackable === undefined) || (tile === undefined) || (height === undefined) || (Math.abs(height - _arg_10) > 0.01)) return false;
                    }
                }

                _local_12++;
            }

            _local_11++;
        }

        return true;
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