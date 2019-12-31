import { ObjectUpdateStateMessage } from './ObjectUpdateStateMessage';

export class ObjectAvatarGuideStatusUpdateMessage extends ObjectUpdateStateMessage
{
    private _guideStatus: number;

    constructor(value: number)
    {
        super();

        this._guideStatus = value;
    }

    public get guideStatus(): number
    {
        return this._guideStatus;
    }
}