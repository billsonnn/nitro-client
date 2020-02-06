import { FurnitureData } from './FurnitureData';
import { FurnitureStackingHeightMap } from './FurnitureStackingHeightMap';
import { LegacyWallGeometry } from './LegacyWallGeometry';
import { RoomCamera } from './RoomCamera';
import { SelectedRoomObjectData } from './SelectedRoomObjectData';

export class RoomInstanceData
{
    private _roomId: number;

    private _modelName: string;
    private _legacyGeometry: LegacyWallGeometry;
    private _roomCamera: RoomCamera;
    private _selectedObject: SelectedRoomObjectData;
    private _furnitureStackingHeightMap: FurnitureStackingHeightMap;

    private _furnitureStack: Map<number, FurnitureData>;

    constructor(roomId: number)
    {
        this._roomId                        = roomId;

        this._modelName                     = null;
        this._legacyGeometry                = new LegacyWallGeometry();
        this._roomCamera                    = new RoomCamera();
        this._selectedObject                = null;
        this._furnitureStackingHeightMap    = null;

        this._furnitureStack                = new Map();
    }

    public dispose(): void
    {
        return;
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

    public setFurnitureStackingHeightMap(heightMap: FurnitureStackingHeightMap): void
    {
        this._furnitureStackingHeightMap = heightMap;
    }

    public addPendingFurniture(data: FurnitureData): void
    {
        if(!data) return;

        this._furnitureStack.set(data.id, data);
    }

    public getPendingFurniture(id: number): FurnitureData
    {
        const existing = this._furnitureStack.get(id);

        if(!existing) return null;

        this._furnitureStack.delete(id);

        return existing;
    }

    public getNextPendingFurniture(): FurnitureData
    {
        if(!this._furnitureStack.size) return null;

        return this.getPendingFurniture(this._furnitureStack.keys().next().value as number);
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

    public get roomCamera(): RoomCamera
    {
        return this._roomCamera;
    }

    public get selectedObject(): SelectedRoomObjectData
    {
        return this._selectedObject;
    }

    public get furnitureStackingHeightMap(): FurnitureStackingHeightMap
    {
        return this._furnitureStackingHeightMap;
    }
}