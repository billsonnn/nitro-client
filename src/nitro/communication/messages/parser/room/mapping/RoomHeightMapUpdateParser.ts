import { IMessageDataWrapper } from '../../../../../../core/communication/messages/IMessageDataWrapper';
import { IMessageParser } from '../../../../../../core/communication/messages/IMessageParser';
import { RoomHeightMapParser } from './RoomHeightMapParser';

export class RoomHeightMapUpdateParser implements IMessageParser
{
    private _wrapper: IMessageDataWrapper;
    private _totalHeights: number;
    private _x: number;
    private _y: number;
    private _height: number;

    public flush(): boolean
    {
        this._wrapper       = null;
        this._totalHeights  = 0;
        this._x             = 0;
        this._y             = 0;
        this._height        = 0;

        return true;
    }

    public getHeight(): number
    {
        return RoomHeightMapParser.convertHeight(this._height);
    }

    public isStackable(): boolean
    {
        return RoomHeightMapParser.isHeightStackable(this._height);
    }

    public isTile(): boolean
    {
        return RoomHeightMapParser.isValidHeight(this._height);
    }

    public next(): boolean
    {
        if(!this._totalHeights) return false;

        this._totalHeights--;

        this._x         = this._wrapper.readByte();
        this._y         = this._wrapper.readByte();
        this._height    = this._wrapper.readShort();

        return true;
    }
    
    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._wrapper       = wrapper;
        this._totalHeights  = wrapper.readByte();

        return true;
    }

    public get x(): number
    {
        return this._x;
    }

    public get y(): number
    {
        return this._y;
    }
    
    public get height(): number
    {
        return this._height;
    }
}