﻿import { IMessageEvent } from '../../../../../../core/communication/messages/IMessageEvent';
import { MessageEvent } from '../../../../../../core/communication/messages/MessageEvent';
import { TradingAcceptParser } from '../../../parser/inventory/trading/TradingAcceptParser';

export class TradingAcceptEvent extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, TradingAcceptParser);
    }

    public get _Str_4963(): number
    {
        return this.getParser()._Str_4963;
    }

    public get _Str_15794(): boolean
    {
        return this.getParser()._Str_15794;
    }

    public getParser(): TradingAcceptParser
    {
        return this.parser as TradingAcceptParser;
    }
}