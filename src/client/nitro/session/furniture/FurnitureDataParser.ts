import { EventDispatcher } from '../../../core/events/EventDispatcher';
import { NitroEvent } from '../../../core/events/NitroEvent';
import { INitroLocalizationManager } from '../../localization/INitroLocalizationManager';
import { FurnitureData } from './FurnitureData';
import { FurnitureType } from './FurnitureType';
import { IFurnitureData } from './IFurnitureData';

export class FurnitureDataParser extends EventDispatcher
{
    public static FURNITURE_DATA_READY: string = 'FDP_FURNITURE_DATA_READY';
    public static FURNITURE_DATA_ERROR: string = 'FDP_FURNITURE_DATA_ERROR';

    private _floorItems: Map<number, IFurnitureData>;
    private _wallItems: Map<number, IFurnitureData>;
    private _localization: INitroLocalizationManager;

    constructor(floorItems: Map<number, IFurnitureData>, wallItems: Map<number, IFurnitureData>, localization: INitroLocalizationManager)
    {
        super();

        this._floorItems    = floorItems;
        this._wallItems     = wallItems;
        this._localization  = localization;
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

            if(data.floorItems)
            {
                this.parseFloorItems(data.floorItems);
            }

            if(data.wallItems) this.parseWallItems(data.wallItems);
        }

        this.dispatchEvent(new NitroEvent(FurnitureDataParser.FURNITURE_DATA_READY));
    }

    private onFurnitureDataError(request: XMLHttpRequest): void
    {
        if(!request)

            request.removeEventListener('loadend', this.onFurnitureDataLoaded.bind(this, request));
        request.removeEventListener('error', this.onFurnitureDataError.bind(this, request));

        this.dispatchEvent(new NitroEvent(FurnitureDataParser.FURNITURE_DATA_ERROR));
    }

    private parseFloorItems(data: IFurnitureData[]): void
    {
        if(!data || !data.length) return;

        for(const furniture of data)
        {
            if(!furniture) continue;

            const furnitureData = new FurnitureData(FurnitureType.FLOOR, furniture.id, furniture.className, furniture.name, furniture.description, furniture.furniLine, furniture.colors, furniture.dimensions, furniture.canStandOn, furniture.canSitOn, furniture.canLayOn, furniture.offerId, furniture.adUrl, furniture.excludeDynamic, furniture.specialType, furniture.customParams);

            this._floorItems.set(furnitureData.id, furnitureData);

            this.updateLocalizations(furnitureData);
        }
    }

    private parseWallItems(data: IFurnitureData[]): void
    {
        if(!data || !data.length) return;

        for(const furniture of data)
        {
            if(!furniture) continue;

            const furnitureData = new FurnitureData(FurnitureType.WALL, furniture.id, furniture.className, furniture.name, furniture.description, furniture.furniLine, furniture.colors, furniture.dimensions, furniture.canStandOn, furniture.canSitOn, furniture.canLayOn, furniture.offerId, furniture.adUrl, furniture.excludeDynamic, furniture.specialType, furniture.customParams);

            this._wallItems.set(furnitureData.id, furnitureData);

            this.updateLocalizations(furnitureData);
        }
    }

    private updateLocalizations(furniture: FurnitureData): void
    {
        if(!this._localization) return;

        switch(furniture.type)
        {
            case FurnitureType.FLOOR:
                this._localization.setValue(('roomItem.name.' + furniture.id), furniture.name);
                this._localization.setValue(('roomItem.desc.' + furniture.id), furniture.description);
                return;
            case FurnitureType.WALL:
                this._localization.setValue(('wallItem.name.' + furniture.id), furniture.name);
                this._localization.setValue(('wallItem.desc.' + furniture.id), furniture.description);
                return;
        }
    }
}