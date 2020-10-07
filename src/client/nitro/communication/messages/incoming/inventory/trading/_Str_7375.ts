import { IMessageEvent } from '../../../../../../core/communication/messages/IMessageEvent';
import { MessageEvent } from '../../../../../../core/communication/messages/MessageEvent';
import { _Str_9589 } from '../../../parser/inventory/trading/_Str_9589';

export class _Str_7375 extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, _Str_9589);
    }

    public get _Str_4963(): number
    {
        return this.getParser()._Str_4963;
    }

    public get _Str_16764(): boolean
    {
        return this.getParser()._Str_16764;
    }

    public get _Str_17613(): number
    {
        return this.getParser()._Str_17613;
    }

    public get _Str_13374(): boolean
    {
        return this.getParser()._Str_13374;
    }

    public getParser(): _Str_9589
    {
        return this.parser as _Str_9589;
    }
}