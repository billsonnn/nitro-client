import { FurnitureData } from './FurnitureData';
import { FurnitureStackingHeightMap } from './FurnitureStackingHeightMap';
import { LegacyWallGeometry } from './LegacyWallGeometry';
import { RoomCamera } from './RoomCamera';
import { SelectedRoomObjectData } from './SelectedRoomObjectData';
import { TileObjectMap } from './TileObjectMap';

export class RoomInstanceData
{
    private _roomId: number;

    private _modelName: string;
    private _legacyGeometry: LegacyWallGeometry;
    private _tileObjectMap: TileObjectMap;
    private _roomCamera: RoomCamera;
    private _selectedObject: SelectedRoomObjectData;
    private _placedObject: SelectedRoomObjectData;
    private _furnitureStackingHeightMap: FurnitureStackingHeightMap;

    private _floorStack: Map<number, FurnitureData>;
    private _wallStack: Map<number, FurnitureData>;
    private _mouseButtonCursorOwners: string[];

    constructor(roomId: number)
    {
        this._roomId                        = roomId;

        this._modelName                     = null;
        this._legacyGeometry                = new LegacyWallGeometry();
        this._tileObjectMap                 = null;
        this._roomCamera                    = new RoomCamera();
        this._selectedObject                = null;
        this._placedObject                  = null;
        this._furnitureStackingHeightMap    = null;

        this._floorStack                    = new Map();
        this._wallStack                     = new Map();
        this._mouseButtonCursorOwners       = [];
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

    public setPlacedObject(data: SelectedRoomObjectData): void
    {
        if(this._placedObject)
        {
            this._placedObject.dispose();
        }

        this._placedObject = data;
    }

    public setFurnitureStackingHeightMap(heightMap: FurnitureStackingHeightMap): void
    {
        if(this._furnitureStackingHeightMap) this._furnitureStackingHeightMap.dispose();

        this._furnitureStackingHeightMap = heightMap;

        if(this._tileObjectMap) this._tileObjectMap.dispose();

        if(this._furnitureStackingHeightMap)
        {
            this._tileObjectMap = new TileObjectMap(this._furnitureStackingHeightMap.width, this._furnitureStackingHeightMap.height);
        }
    }

    public addPendingFurnitureFloor(data: FurnitureData): void
    {
        if(!data) return;

        this._floorStack.delete(data.id);
        this._floorStack.set(data.id, data);
    }

    public removePendingFunitureFloor(id: number): FurnitureData
    {
        const existing = this._floorStack.get(id);

        if(!existing) return null;

        this._floorStack.delete(id);

        return existing;
    }

    public getPendingFurnitureFloor(id: number): FurnitureData
    {
        const existing = this._floorStack.get(id);

        if(!existing) return null;

        this._floorStack.delete(id);

        return existing;
    }

    public getNextPendingFurnitureFloor(): FurnitureData
    {
        if(!this._floorStack.size) return null;

        const keys = this._floorStack.keys();

        return this.getPendingFurnitureFloor(keys.next().value as number);
    }

    public addPendingFurnitureWall(data: FurnitureData): void
    {
        if(!data) return;

        this._wallStack.delete(data.id);
        this._wallStack.set(data.id, data);
    }

    public removePendingFurnitureWall(id: number): FurnitureData
    {
        const existing = this._wallStack.get(id);

        if(!existing) return null;

        this._wallStack.delete(id);

        return existing;
    }

    public getPendingFurnitureWall(id: number): FurnitureData
    {
        const existing = this._wallStack.get(id);

        if(!existing) return null;

        this._wallStack.delete(id);

        return existing;
    }

    public getNextPendingFurnitureWall(): FurnitureData
    {
        if(!this._wallStack.size) return null;

        const keys = this._wallStack.keys();

        return this.getPendingFurnitureWall(keys.next().value as number);
    }

    public _Str_16810(k: string): boolean
    {
        const _local_2 = this._mouseButtonCursorOwners.indexOf(k);

        if(_local_2 === -1)
        {
            this._mouseButtonCursorOwners.push(k);

            return true;
        }

        return false;
    }

    public _Str_11959(k: string): boolean
    {
        const _local_2 = this._mouseButtonCursorOwners.indexOf(k);

        if(_local_2 > -1)
        {
            this._mouseButtonCursorOwners.splice(_local_2, 1);

            return true;
        }
        
        return false;
    }

    public _Str_22598(): boolean
    {
        return this._mouseButtonCursorOwners.length > 0;
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

    public get tileObjectMap(): TileObjectMap
    {
        return this._tileObjectMap;
    }

    public get roomCamera(): RoomCamera
    {
        return this._roomCamera;
    }

    public get selectedObject(): SelectedRoomObjectData
    {
        return this._selectedObject;
    }

    public get placedObject(): SelectedRoomObjectData
    {
        return this._placedObject;
    }

    public get furnitureStackingHeightMap(): FurnitureStackingHeightMap
    {
        return this._furnitureStackingHeightMap;
    }
}