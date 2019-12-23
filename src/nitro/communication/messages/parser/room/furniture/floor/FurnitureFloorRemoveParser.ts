import { IMessageDataWrapper } from '../../../../../../../core/communication/messages/IMessageDataWrapper';
import { IMessageParser } from '../../../../../../../core/communication/messages/IMessageParser';

export class FurnitureFloorRemoveParser implements IMessageParser
{
    private _itemId: number;
    private _animateRemoval: boolean;
    private _userId: number;
    private _someInt: number;

    public flush(): boolean
    {
        this._itemId            = 0;
        this._animateRemoval    = true;
        this._userId            = 0;
        this._someInt           = 0;

        return true;
    }
    
    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._itemId            = parseInt(wrapper.readString());
        this._animateRemoval    = wrapper.readBoolean() === false ? true : false;
        this._userId            = wrapper.readInt();
        this._someInt           = wrapper.readInt();

        return true;
    }

    public get itemId(): number
    {
        return this._itemId;
    }

    public get animateRemoval(): boolean
    {
        return this._animateRemoval;
    }

    public get userId(): number
    {
        return this._userId;
    }

    public get someInt(): number
    {
        return this._someInt;
    }
}