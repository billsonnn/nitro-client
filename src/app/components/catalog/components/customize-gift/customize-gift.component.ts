import { AfterViewInit, Component, ElementRef, Input, NgZone, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { CatalogPageParser } from '../../../../../client/nitro/communication/messages/parser/catalog/CatalogPageParser';
import { CatalogPageOfferData } from '../../../../../client/nitro/communication/messages/parser/catalog/utils/CatalogPageOfferData';
import { ToolbarIconEnum } from '../../../../../client/nitro/enums/ToolbarIconEnum';
import { NitroToolbarAnimateIconEvent } from '../../../../../client/nitro/events/NitroToolbarAnimateIconEvent';
import { Nitro } from '../../../../../client/nitro/Nitro';
import { TextureUtils } from '../../../../../client/room/utils/TextureUtils';
import { CatalogService } from '../../services/catalog.service';
import { Vector3d } from '../../../../../client/room/utils/Vector3d';
import { IGetImageListener } from '../../../../../client/nitro/room/IGetImageListener';

@Component({
    selector: 'nitro-catalog-customize-gift-component',
    templateUrl: './customize-gift.template.html'
})
export class CatalogCustomizeGiftComponent implements IGetImageListener
{
    @Input()
    public visible:boolean = false;

    private _ribbonIndex: number;
    private _boxIndex: number;
    private _stuffTypes: number[];
    private _defaultStuffType: number;
    private _boxTypes: number[];
    private _ribbonTypes: number[];
    private _selectedTypeId: number;

    public boxImage: string;

    constructor(
        private _catalogService: CatalogService,
        private _ngZone: NgZone
    )
    {
        _catalogService.giftsLoaded.subscribe((item) =>
        {
            const configuration = this._catalogService.giftWrapperConfiguration;
            const defaultStuffTypes = configuration.defaultStuffTypes;

            if(defaultStuffTypes.length > 0)
            {
                const local11 = Math.floor((Math.random() * defaultStuffTypes.length));
                this._defaultStuffType = defaultStuffTypes[local11];
            }

            this._stuffTypes = configuration.stuffTypes;
            this._boxTypes = configuration.boxTypes;
            this._ribbonTypes = configuration.ribbonTypes;
            this._selectedTypeId = this._stuffTypes[0];
            this._ribbonIndex = this._ribbonTypes[0];
            this._boxIndex = 0;

            this._Str_3190();
        });
    }

    private _Str_3190(): void
    {
        if(this._ribbonIndex < 0)
        {
            this._ribbonIndex = (this._ribbonTypes.length - 1);
        }

        if(this._ribbonIndex > (this._ribbonTypes.length - 1))
        {
            this._ribbonIndex = 0;
        }

        if(this._boxIndex < 0)
        {
            this._boxIndex = (this._boxTypes.length - 1);
        }

        if(this._boxIndex > (this._boxTypes.length - 1))
        {
            this._boxIndex = 0;
        }

        this._boxIndex = 1;
        const k = this._boxTypes[this._boxIndex];
        if(k == 8)
        {
            // see _Str_13980
            this._ribbonIndex = 10;

            if(this._ribbonIndex > (this._ribbonTypes.length - 1))
            {
                this._ribbonIndex = 0;
            }
        }

        this._ribbonIndex = 1;
        const local2 = ((k * 1000) + this._ribbonTypes[this._ribbonIndex]);

        let local3 = local2.toString();
        let local4 = this._selectedTypeId;
        const local5 = this._Str_18066();
        if(local5)
        {
            local4 = this._defaultStuffType;
            local3 = '';
        }

        const local6 = Nitro.instance.roomEngine.getFurnitureFloorImage(local4, new Vector3d(180), 64, this, 0, local3);
        if(local6)
        {
            const image = local6.getImage();

            if(image) this.boxImage = image.src;
        }

    }


    private  _Str_18066():boolean
    {
        return this._boxTypes[this._boxIndex] == this._defaultStuffType;
    }

    imageFailed(id: number): void
    {
    }

    imageReady(id: number, texture: PIXI.Texture, image?: HTMLImageElement): void
    {

    }





}
