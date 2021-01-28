import { Achievement } from '../../../../client/nitro/communication/messages/incoming/inventory/achievements/Achievement';

export class AchievementCategory
{
    private _name: string;
    private _achievements: Achievement[];

    constructor(name: string)
    {
        this._name          = name;
        this._achievements  = [];
    }

    public get name(): string
    {
        return this._name;
    }

    public set name(name: string)
    {
        this._name = name;
    }

    public get achievements(): Achievement[]
    {
        return this._achievements;
    }

    public set achievements(achievements: Achievement[])
    {
        this._achievements = achievements;
    }
}