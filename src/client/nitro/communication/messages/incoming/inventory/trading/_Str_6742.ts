import { IMessageEvent } from '../../../../../../core/communication/messages/IMessageEvent';
import { MessageEvent } from '../../../../../../core/communication/messages/MessageEvent';
import { _Str_9219 } from '../../../parser/inventory/trading/_Str_9219';
import { _Str_6342 } from './_Str_6342';

export class _Str_6742 extends MessageEvent implements IMessageEvent
{
    constructor(callBack: Function)
    {
        super(callBack, _Str_9219);
    }

    public get _Str_15162(): number
    {
        return this.getParser()._Str_15162;
    }

    public get _Str_18215(): number
    {
        return this.getParser()._Str_18215;
    }

    public get _Str_14946(): number
    {
        return this.getParser()._Str_14946;
    }

    public get _Str_13801(): number
    {
        return this.getParser()._Str_13801;
    }

    public get _Str_15709(): number
    {
        return this.getParser()._Str_15709;
    }

    public get _Str_9138(): number
    {
        return this.getParser()._Str_9138;
    }

    public get _Str_17841(): _Str_6342[]
    {
        return this.getParser()._Str_17841;
    }

    public get _Str_17465(): _Str_6342[]
    {
        return this.getParser()._Str_17465;
    }

    public getParser(): _Str_9219
    {
        return this.parser as _Str_9219;
    }
}