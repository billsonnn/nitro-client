import { ObjectUpdateStateMessage } from './ObjectUpdateStateMessage';

export class ObjectAvatarExpressionUpdateMessage extends ObjectUpdateStateMessage
{
    private _expressionType: number;

    constructor(expressionType: number = 0)
    {
        super();

        this._expressionType = expressionType;
    }

    public get expressionType(): number
    {
        return this._expressionType;
    }
}