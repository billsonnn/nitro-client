import { Achievement } from '../../../../client/nitro/communication/messages/incoming/inventory/achievements/Achievement';

export class Category
{ 
    private _name: string;

    private _achievements: Achievement[];

    public constructor(name: string, achievements: Achievement[])
    { 
        this._name = name;
        this._achievements = achievements;
    }

    public set name(name: string)
    { 
        this._name = name;
    }

    public get name(): string
    { 
        return this._name;
    }

    public set achievements(achievements: Achievement[])
    { 
        this._achievements = achievements;
    }

    public get achievements(): Achievement[]
    {
        return this._achievements;
    }
}