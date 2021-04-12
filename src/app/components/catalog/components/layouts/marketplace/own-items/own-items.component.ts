import { Component } from '@angular/core';
import { CatalogLayout } from '../../../../CatalogLayout';


@Component({
    templateUrl: './own-items.template.html'
})
export class CatalogLayoutMarketplaceOwnItemsComponent extends CatalogLayout
{
    public static CODE: string = 'marketplace_own_items';
}
