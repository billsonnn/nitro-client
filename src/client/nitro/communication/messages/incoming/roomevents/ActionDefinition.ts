import { IMessageDataWrapper } from '../../../../../core/communication/messages/IMessageDataWrapper';
import { Triggerable } from './Triggerable';

export class ActionDefinition extends Triggerable
{
    private _type: number;
    private _delayInPulses: number;
    private _conflictingTriggers: number[];

    constructor(wrapper: IMessageDataWrapper)
    {
        super(wrapper);

        this._conflictingTriggers   = [];
        this._type                  = wrapper.readInt();
        this._delayInPulses         = wrapper.readInt();

        let count = wrapper.readInt();

        while(count > 0)
        {
            this._conflictingTriggers.push(wrapper.readInt());

            count--;
        }
    }

    public get type(): number
    {
        return this._type;
    }

    public get code(): number
    {
        return this._type;
    }

    public get _Str_25459(): number
    {
        return this._delayInPulses;
    }

    public get _Str_22128(): number[]
    {
        return this._conflictingTriggers;
    }
}