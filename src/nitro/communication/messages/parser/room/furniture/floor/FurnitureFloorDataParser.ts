import { IMessageDataWrapper } from '../../../../../../../core/communication/messages/IMessageDataWrapper';
import { Direction } from '../../../../../../../room/utils/Direction';
import { IObjectData } from '../../../../../../room/object/data/IObjectData';
import { FurnitureDataParser } from '../FurnitureDataParser';

export class FurnitureFloorDataParser
{
    private _itemId: number;
    private _spriteId: number;
    private _x: number;
    private _y: number;
    private _direction: number;
    private _z: number;
    private _stackHeight: number;
    private _type: number;
    private _data: IObjectData;
    private _someInt: number;
    private _canToggle: boolean;
    private _userId: number;
    private _username: string;

    constructor(wrapper: IMessageDataWrapper)
    {
        if(!wrapper) throw new Error('invalid_wrapper');

        this.flush();
        this.parse(wrapper);
    }

    public flush(): boolean
    {
        this._itemId        = 0;
        this._spriteId      = 0;
        this._x             = 0;
        this._y             = 0;
        this._direction     = Direction.NORTH;
        this._z             = 0;
        this._stackHeight   = 0;
        this._type          = 0;
        this._data          = null;
        this._someInt       = 0;
        this._canToggle     = false;
        this._userId        = 0;
        this._username      = null;

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._itemId        = wrapper.readInt();
        this._spriteId      = wrapper.readInt();
        this._x             = wrapper.readInt();
        this._y             = wrapper.readInt();
        this._direction     = wrapper.readInt();
        this._z             = parseFloat(wrapper.readString());
        this._stackHeight   = parseFloat(wrapper.readString());
        this._type          = wrapper.readInt();
        this._data          = FurnitureDataParser.parseObjectData(wrapper);
        this._someInt       = wrapper.readInt();
        this._canToggle     = wrapper.readInt() === 1;
        this._userId        = wrapper.readInt();
        this._username      = null;

        return true;
    }

    public get itemId(): number
    {
        return this._itemId;
    }

    public get spriteId(): number
    {
        return this._spriteId;
    }

    public get x(): number
    {
        return this._x;
    }

    public get y(): number
    {
        return this._y;
    }

    public get direction(): number
    {
        return this._direction;
    }

    public get z(): number
    {
        return this._z;
    }

    public get stackHeight(): number
    {
        return this._stackHeight;
    }

    public get type(): number
    {
        return this._type;
    }

    public get data(): IObjectData
    {
        return this._data;
    }

    public get someInt(): number
    {
        return this._someInt;
    }

    public get canToggle(): boolean
    {
        return this._canToggle;
    }

    public get userId(): number
    {
        return this._userId;
    }

    public get username(): string
    {
        return this._username;
    }

    public set username(username: string)
    {
        this._username = username;
    }
}