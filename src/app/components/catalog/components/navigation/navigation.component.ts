import { Component } from '@angular/core';
import { CatalogPageData } from '../../../../../client/nitro/communication/messages/parser/catalog/utils/CatalogPageData';
import { CatalogService } from '../../services/catalog.service';

@Component({
    selector: '[nitro-catalog-navigation-component]',
    templateUrl: './navigation.template.html'
})
export class CatalogNavigationComponent
{
    constructor(private _catalogService: CatalogService) 
    {}

    public get catalogPage(): CatalogPageData
    {
        return ((this._catalogService.component && this._catalogService.component.activeTab) || null);
    }
}