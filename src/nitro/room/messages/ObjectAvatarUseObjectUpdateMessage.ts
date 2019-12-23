import { ObjectUpdateStateMessage } from './ObjectUpdateStateMessage';

export class ObjectAvatarUseObjectUpdateMessage extends ObjectUpdateStateMessage
{
    private _itemType: number;

    constructor(itemType: number)
    {
        super();

        this._itemType = itemType;
    }

    public get itemType(): number
    {
        return this._itemType;
    }
}