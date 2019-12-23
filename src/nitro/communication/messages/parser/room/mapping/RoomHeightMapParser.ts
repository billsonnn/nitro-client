import { IMessageParser } from '../../../../../../core/communication/messages/IMessageParser';
import { IMessageDataWrapper } from '../../../../../../core/communication/messages/IMessageDataWrapper';

export class RoomHeightMapParser implements IMessageParser
{
    private _width: number;
    private _height: number;
    private _totalTiles: number;
    private _heights: any[];

    public flush(): boolean
    {
        this._width         = 0;
        this._height        = 0;
        this._totalTiles    = 0;
        this._heights       = [];

        return true;
    }
    
    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._width         = wrapper.readInt();
        this._totalTiles    = wrapper.readInt();
        this._height        = this._totalTiles / this._width;

        for(let y = 0; y < this._height; y++)
        {
            for(let x = 0; x < this._width; x++)
            {
                let height = wrapper.readShort();

                if(height === 32767) height = -1;
                else height /= 256;

                this._heights.push({ x, y, height });
            }
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

    public get totalTiles(): number
    {
        return this._totalTiles;
    }

    public get heights(): any[]
    {
        return this._heights;
    }
}