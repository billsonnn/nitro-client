export class UserToolUser
{

    private _id: number;
    private _username: string;

    constructor(id: number, username: string)
    {
        this._id = id;
        this._username = username;
    }

    get id(): number
    {
        return this._id;
    }

    get username(): string
    {
        return this._username;
    }
}
