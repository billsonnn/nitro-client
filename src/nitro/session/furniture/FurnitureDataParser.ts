import { NitroManager } from '../../../core/common/NitroManager';
import { FurnitureData } from './FurnitureData';
import { FurnitureType } from './FurnitureType';
import { IFurnitureData } from './IFurnitureData';

export class FurnitureDataParser extends NitroManager
{
    public static FURNITURE_DATA_READY: string = 'FDP_FURNITURE_DATA_READY';
    public static FURNITURE_DATA_ERROR: string = 'FDP_FURNITURE_DATA_ERROR';

    private _floorItems: Map<number, FurnitureData>;
    private _wallItems: Map<number, FurnitureData>;

    constructor(floorItems: Map<number, FurnitureData>, wallItems: Map<number, FurnitureData>)
    {
        super();

        this._floorItems    = floorItems;
        this._wallItems     = wallItems;
    }

    public loadFurnitureData(url: string): void
    {
        if(!url) return;

        const request = new XMLHttpRequest();

        request.addEventListener('loadend', this.onFurnitureDataLoaded.bind(this, request));
        request.addEventListener('error', this.onFurnitureDataError.bind(this, request));

        request.open('GET', url);

        request.send();
    }

    private onFurnitureDataLoaded(request: XMLHttpRequest): void
    {
        if(!request) return;

        request.removeEventListener('loadend', this.onFurnitureDataLoaded.bind(this, request));
        request.removeEventListener('error', this.onFurnitureDataError.bind(this, request));

        if(request.responseText)
        {
            const data = JSON.parse(request.responseText);

            if(data.floorItems) this.parseFloorItems(data.floorItems);
            if(data.wallItems) this.parseWallItems(data.wallItems);
        }

        this.dispatchFurnitureDataEvent(FurnitureDataParser.FURNITURE_DATA_READY);
    }

    private onFurnitureDataError(request: XMLHttpRequest): void
    {
        if(!request)

        request.removeEventListener('loadend', this.onFurnitureDataLoaded.bind(this, request));
        request.removeEventListener('error', this.onFurnitureDataError.bind(this, request));

        this.dispatchFurnitureDataEvent(FurnitureDataParser.FURNITURE_DATA_ERROR);
    }

    private parseFloorItems(data: IFurnitureData[]): void
    {
        if(!data || !data.length) return;

        for(let furniture of data)
        {
            if(!furniture) continue;

            this._floorItems.set(furniture.id, new FurnitureData(FurnitureType.FLOOR, furniture));
        }
    }

    private parseWallItems(data: IFurnitureData[]): void
    {
        if(!data || !data.length) return;

        for(let furniture of data)
        {
            if(!furniture) continue;

            this._wallItems.set(furniture.id, new FurnitureData(FurnitureType.WALL, furniture));
        }
    }

    private dispatchFurnitureDataEvent(type: string): void
    {
        this.events && this.events.dispatchEvent(new Event(type));
    }
}