import { Component, OnInit } from '@angular/core';
import { MarketplaceOfferItem } from '../../../../../../../client/nitro/communication/messages/parser/catalog/utils/MarketplaceOfferItem';
import { Nitro } from '../../../../../../../client/nitro/Nitro';
import { CatalogLayout } from '../../../../CatalogLayout';


@Component({
    templateUrl: './marketplace.template.html',
    styleUrls: ['./index.scss']
})
export class CatalogLayoutMarketplaceMarketplaceComponent extends CatalogLayout implements OnInit
{
    public static CODE: string = 'marketplace';

    public readonly SORT_TYPES_VALUE = [1, 2];
    public readonly SORT_TYPES_ACTIVITY = [3, 4, 5, 6];
    public readonly SORT_TYPES_ADVANCED = [1, 2, 3, 4, 5, 6];

    public view: string = 'activity';

    public sortType: number = 3; // first item of SORT_TYPES_ACTIVITY

    public ngOnInit(): void
    {
        this.searchOffers();
    }

    public selectView(view: string)
    {
        this.view = view;
        switch(view)
        {
            case 'activity':
                this.sortType = this.SORT_TYPES_ACTIVITY[0];
                break;
            case 'value':
                this.sortType = this.SORT_TYPES_VALUE[0];
                break;
            case 'advanced':
                this.sortType = this.SORT_TYPES_ADVANCED[0];
                break;
        }
    }

    public onSortChanged(option: number)
    {
        this._ngZone.run(() => this.sortType = option);
        this.searchOffers();
    }

    private searchOffers(): void
    {
        const min = -1;
        const max = -1;
        const query = '';
        const type = this.sortType;

        this._marketService.requestOffers(min, max, query, type);
    }

    public get marketOffers(): MarketplaceOfferItem[]
    {
        return this._marketService.publicOffers;
    }

    public get totalOffersFound(): number
    {
        return this._marketService.totalOffersFound;
    }

    public get foundText(): string
    {
        return Nitro.instance.localization.getValueWithParameter('catalog.marketplace.items_found', 'count', this.totalOffersFound.toString());
    }

    public get hasOffers(): boolean
    {
        return this.marketOffers && this.marketOffers.length > 0;
    }




}
