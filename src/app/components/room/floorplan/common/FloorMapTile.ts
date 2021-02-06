export default class FloorMapTile
{
    public height: string;
    private _blocked: boolean;

    constructor(height: string, blocked: boolean)
    {
        this.height = height;
        this._blocked = blocked;
    }

    public get blocked(): boolean
    {
        return this._blocked;
    }
}