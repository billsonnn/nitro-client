import { Component, Input } from '@angular/core';
import { ICatalogPageData } from '../../common/ICatalogPageData';
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
