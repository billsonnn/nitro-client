import { LegacyWallGeometry } from './LegacyWallGeometry';

export class RoomInstanceData
{
    private _roomId: number;

    private _modelName: string;
    private _legacyGeometry: LegacyWallGeometry;

    constructor(roomId: number)
    {
        this._roomId            = roomId;

        this._modelName         = null;
        this._legacyGeometry    = new LegacyWallGeometry();
    }

    public dispose(): void
    {
        return;
    }

    public get roomId(): number
    {
        return this._roomId;
    }

    public get modelName(): string
    {
        return this._modelName;
    }

    public get legacyGeometry(): LegacyWallGeometry
    {
        return this._legacyGeometry;
    }
}