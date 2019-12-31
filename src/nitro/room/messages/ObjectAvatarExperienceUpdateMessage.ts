import { ObjectUpdateStateMessage } from './ObjectUpdateStateMessage';

export class ObjectAvatarExperienceUpdateMessage extends ObjectUpdateStateMessage
{
    private _gainedExperience: number;

    constructor(amount: number)
    {
        super();

        this._gainedExperience = amount;
    }

    public get gainedExperience(): number
    {
        return this._gainedExperience;
    }
}