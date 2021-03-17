import { Component, Input } from '@angular/core';
import { ICatalogPageData } from 'nitro-renderer/src/nitro/communication/messages/parser/catalog/utils/ICatalogPageData';
import { CatalogService } from '../../services/catalog.service';

@Component({
    selector: 'nitro-catalog-navigation-set-component',
    templateUrl: './navigation-set.template.html'
})
export class CatalogNavigationSetComponent
{
    @Input()
    public catalogPage: ICatalogPageData = null;

    constructor(private _catalogService: CatalogService)
    {}
}
