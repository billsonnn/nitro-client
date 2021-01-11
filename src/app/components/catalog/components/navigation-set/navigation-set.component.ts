import { Component, Input } from '@angular/core';
import { CatalogPageData } from '../../../../../client/nitro/communication/messages/parser/catalog/utils/CatalogPageData';
import { CatalogService } from '../../services/catalog.service';

@Component({
	selector: 'nitro-catalog-navigation-set-component',
    templateUrl: './navigation-set.template.html'
})
export class CatalogNavigationSetComponent
{
    @Input()
    public catalogPage: CatalogPageData = null;

    constructor(private _catalogService: CatalogService) {}
}