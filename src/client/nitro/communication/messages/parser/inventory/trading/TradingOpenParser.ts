﻿import { IMessageDataWrapper } from '../../../../../../core/communication/messages/IMessageDataWrapper';
import { IMessageParser } from '../../../../../../core/communication/messages/IMessageParser';

export class TradingOpenParser implements IMessageParser
{
    private _userId: number;
    private _userCanTrade: boolean;
    private _otherUserId: number;
    private _otherUserCanTrade: boolean;

    public flush(): boolean
    {
        this._userId            = -1;
        this._userCanTrade      = false;
        this._otherUserId       = -1;
        this._otherUserCanTrade = false;

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;
        
        this._userId            = wrapper.readInt();
        this._userCanTrade      = (wrapper.readInt() === 1);
        this._otherUserId       = wrapper.readInt();
        this._otherUserCanTrade = (wrapper.readInt() === 1);

        return true;
    }

    public get _Str_4963(): number
    {
        return this._userId;
    }

    public get _Str_16764(): boolean
    {
        return this._userCanTrade;
    }

    public get _Str_17613(): number
    {
        return this._otherUserId;
    }

    public get _Str_13374(): boolean
    {
        return this._otherUserCanTrade;
    }
}