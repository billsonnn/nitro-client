import { LegacyWallGeometry } from './LegacyWallGeometry';
import { SelectedRoomObjectData } from './SelectedRoomObjectData';

export class RoomInstanceData
{
    private _roomId: number;

    private _modelName: string;
    private _legacyGeometry: LegacyWallGeometry;
    private _selectedObject: SelectedRoomObjectData;

    constructor(roomId: number)
    {
        this._roomId            = roomId;

        this._modelName         = null;
        this._legacyGeometry    = new LegacyWallGeometry();
        this._selectedObject    = null;
    }

    public setModelName(name: string): void
    {
        this._modelName = name;
    }

    public setSelectedObject(data: SelectedRoomObjectData): void
    {
        if(this._selectedObject)
        {
            this._selectedObject.dispose();
        }

        this._selectedObject = data;
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

    public get selectedObject(): SelectedRoomObjectData
    {
        return this._selectedObject;
    }
}