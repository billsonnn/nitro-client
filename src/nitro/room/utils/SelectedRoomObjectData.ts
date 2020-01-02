export class SelectedRoomObjectData
{
    private _id: number;
    private _category: number;
    private _operation: string;

    public dispose(): void
    {
        return;
    }

    public get id(): number
    {
        return this._id;
    }

    public get category(): number
    {
        return this._category;
    }

    public get operation(): string
    {
        return this._operation;
    }
}