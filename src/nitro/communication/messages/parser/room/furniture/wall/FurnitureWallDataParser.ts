import { IMessageDataWrapper } from '../../../../../../../core/communication/messages/IMessageDataWrapper';
import { IObjectData } from '../../../../../../room/object/data/IObjectData';
import { FurnitureDataParser } from '../FurnitureDataParser';

export class FurnitureWallDataParser
{
    private _itemId: number;
    private _spriteId: number;
    private _wallPosition: string;
    private _stuffData: IObjectData;
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
        this._wallPosition  = null;
        this._stuffData     = null;
        this._someInt       = 0;
        this._canToggle     = false;
        this._userId        = 0;
        this._username      = null;

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._itemId        = parseInt(wrapper.readString());
        this._spriteId      = wrapper.readInt();
        this._wallPosition  = wrapper.readString();
        this._stuffData     = FurnitureDataParser.parseWallStuffData(wrapper);
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

    public get wallPosition(): string
    {
        return this._wallPosition;
    }

    public get stuffData(): IObjectData
    {
        return this._stuffData;
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