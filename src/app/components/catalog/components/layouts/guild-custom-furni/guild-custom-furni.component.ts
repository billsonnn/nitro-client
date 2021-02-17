import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { CatalogGroupData } from '../../../../../../client/nitro/communication/messages/parser/catalog/utils/CatalogGroupData';
import { CatalogPageOfferData } from '../../../../../../client/nitro/communication/messages/parser/catalog/utils/CatalogPageOfferData';
import { CatalogProductOfferData } from '../../../../../../client/nitro/communication/messages/parser/catalog/utils/CatalogProductOfferData';
import { Nitro } from '../../../../../../client/nitro/Nitro';
import { StringDataType } from '../../../../../../client/nitro/room/object/data/type/StringDataType';
import { IFurnitureData } from '../../../../../../client/nitro/session/furniture/IFurnitureData';
import { CatalogLayout } from '../../../CatalogLayout';
import { ProductTypeEnum } from '../../../enums/ProductTypeEnum';
import { CatalogService } from '../../../services/catalog.service';

@Component({
    templateUrl: './guild-custom-furni.template.html'
})
export class CatalogLayoutGuildCustomFurniComponent extends CatalogLayout implements OnInit, OnDestroy
{
    public static CODE: string = 'guild_custom_furni';

    private _groups: CatalogGroupData[] = [];
    private _selectedGroupId: string = null;
    private _selectedGroup: CatalogGroupData = null;

    private _lastOfferSelected: CatalogPageOfferData = null;
    
    constructor(
        protected _catalogService: CatalogService,
        protected _ngZone: NgZone)
    {
        super(_catalogService, _ngZone);
        _catalogService.registerGroupFurniTemplate(this);
    }

    ngOnInit(): void
    {
        this._catalogService.requestGroups();
    }

    ngOnDestroy(): void
    {
        this._catalogService.component.previewStuffData = null;
    }

    public selectOffer(offer: CatalogPageOfferData): void
    {
        if(!offer)
        {
            this._catalogService.component.selectOffer(null);
            return;
        }

        this._lastOfferSelected = offer;

        let productData = [];
        productData.push('0');
        productData.push(this.selectedGroupId);
        productData.push(this._selectedGroup.badge);
        productData.push(this.selectedGroupColorA);
        productData.push(this.selectedGroupColorB);

        let stringDataType = new StringDataType();
        stringDataType.setValue(productData);

        if(this._catalogService.component)
        {
            this._catalogService.component.previewStuffData = stringDataType;
            this._catalogService.component.selectOffer(offer);
        }
    }

    public getFirstProduct(offer: CatalogPageOfferData): CatalogProductOfferData
    {
        return ((offer && offer.products[0]) || null);
    }

    public hasMultipleProducts(offer: CatalogPageOfferData): boolean
    {
        return (offer.products.length > 1);
    }

    public offerName(offer: CatalogPageOfferData): string
    {
        let key = '';

        const product = this.getFirstProduct(offer);

        if(product)
        {
            switch(product.productType)
            {
                case ProductTypeEnum.FLOOR:
                    key = 'roomItem.name.' + product.furniClassId;
                    break;
                case ProductTypeEnum.WALL:
                    key = 'wallItem.name.' + product.furniClassId;
                    break;
            }
        }

        if(key === '') return key;

        return Nitro.instance.getLocalization(key);
    }

    public getProductFurniData(product: CatalogProductOfferData): IFurnitureData
    {
        if(!product) return null;

        return this._catalogService.getFurnitureDataForProductOffer(product);
    }

    public offerImage(offer: CatalogPageOfferData): string
    {
        if(!offer) return '';

        const product = offer.products[0];

        if(!product) return '';

        const furniData = this.getProductFurniData(product);

        if(!furniData) return '';

        switch(product.productType)
        {
            case ProductTypeEnum.FLOOR:
                return this._catalogService.getFurnitureDataIconUrl(furniData);
            case ProductTypeEnum.WALL:
                return this._catalogService.getFurnitureDataIconUrl(furniData);
        }

        return '';
    }

    public offerCount(offer: CatalogPageOfferData): number
    {
        if(!this.hasMultipleProducts(offer))
        {
            const product = this.getFirstProduct(offer);

            if(product) return product.productCount;
        }

        return 1;
    }
    
    public get groups(): CatalogGroupData[]
    {
        return this._groups;
    }

    public set groups(groups: CatalogGroupData[])
    {
        this._groups = groups;

        if(groups.length > 0)
        {
            this._ngZone.run(() => {
                this.selectedGroupId = groups[0].id.toString();
            });
        }
    }

    public get selectedGroup(): CatalogGroupData
    {
        return this._selectedGroup;
    }

    public get selectedGroupId(): string
    {
        return this._selectedGroupId;
    }

    public set selectedGroupId(groupId: string)
    {
        this._selectedGroupId = groupId;
        this._selectedGroup = this.groups.filter((group) => group.id.toString() === groupId)[0];
        this.selectOffer(null);
        this.selectOffer(this._lastOfferSelected);
    }

    public get selectedGroupColorA(): string
    {
        if(!this._selectedGroup) return 'fff';
        
        return this._selectedGroup.colorA;
    }

    public get selectedGroupColorB(): string
    {
        if(!this._selectedGroup) return 'fff';
        
        return this._selectedGroup.colorB;
    }
}
