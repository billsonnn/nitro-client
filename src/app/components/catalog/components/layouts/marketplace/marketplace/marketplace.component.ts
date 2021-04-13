import { Component, NgZone, OnInit } from '@angular/core';
import { CatalogLayout } from '../../../../CatalogLayout';
import { CatalogService } from '../../../../services/catalog.service';
import { MarketplaceService } from '../../../../services/marketplace.service';
import { MarketplaceRequestOwnItemsComposer } from '../../../../../../../client/nitro/communication/messages/outgoing/catalog/marketplace/MarketplaceRequestOwnItemsComposer';
import { Nitro } from '../../../../../../../client/nitro/Nitro';
import { MarketplaceOfferData } from '../../../../../../../client/nitro/communication/messages/parser/catalog/utils/MarketplaceOfferData';


@Component({
    templateUrl: './marketplace.template.html'
})
export class CatalogLayoutMarketplaceMarketplaceComponent extends CatalogLayout implements OnInit
{
    public static CODE: string = 'marketplace';

    public readonly SORT_TYPES_VALUE = [1, 2];
    public readonly SORT_TYPES_ACTIVITY = [3, 4, 5, 6];
    public readonly SORT_TYPES_ADVANCED = [1, 2, 3, 4, 5, 6];

    public view: string = 'activity';

    public ngOnInit(): void
    {

    }

    public selectView(view: string)
    {
        this.view = view;
    }


}
