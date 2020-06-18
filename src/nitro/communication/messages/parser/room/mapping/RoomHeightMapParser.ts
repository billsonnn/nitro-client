import { IMessageDataWrapper } from '../../../../../../core/communication/messages/IMessageDataWrapper';
import { IMessageParser } from '../../../../../../core/communication/messages/IMessageParser';

export class RoomHeightMapParser implements IMessageParser
{
    private _width: number;
    private _height: number;
    private _heights: Map<number, number>;

    public flush(): boolean
    {
        this._width     = 0;
        this._height    = 0;
        this._heights   = new Map();

        return true;
    }

    public static convertHeight(height: number): number
    {
        return ((height < 0) ? -1 : ((height & 16383) / 0x0100));
    }

    public static isHeightStackable(height: number): boolean
    {
        return (height & 0x4000) === 0;
    }

    public static isValidHeight(height: number): boolean
    {
        return height >= 0;
    }

    public getHeight(x: number, y: number): number
    {
        if((x < 0) || (x >= this._width) || (y < 0) || (y >= this._height)) return -1;

        return RoomHeightMapParser.convertHeight(this._heights.get((y * this._width) + x));
    }

    public isStackable(x: number, y: number): boolean
    {
        if((x < 0) || (x >= this._width) || (y < 0) || (y >= this._height)) return true;

        return RoomHeightMapParser.isHeightStackable(this._heights.get((y * this._width) + x)); 
    }

    public isTile(x: number, y: number): boolean
    {
        if((x < 0) || (x >= this._width) || (y < 0) || (y >= this._height)) return false;

        return RoomHeightMapParser.isValidHeight(this._heights.get((y * this._width) + x));
    }
    
    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._width     = wrapper.readInt();
        let totalTiles  = wrapper.readInt();
        this._height    = totalTiles / this._width;

        let iterator = 0;

        while(iterator < totalTiles)
        {
            this._heights.set(iterator, wrapper.readShort());
            
            iterator++;
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

    public get heights(): Map<number, number>
    {
        return this._heights;
    }
}