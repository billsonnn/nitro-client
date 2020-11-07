import { Component, Input } from '@angular/core';
import { CatalogPageData } from '../../../../client/nitro/communication/messages/parser/catalog/utils/CatalogPageData';

@Component({
	selector: '[nitro-catalog-navigation-component]',
    template: `
    <div class="nitro-catalog-navigation-component">
        <perfect-scrollbar style="max-height: 435px;">
            <div class="scroll-container">
                <nitro-catalog-navigation-set-component *ngIf="catalogPage" [catalogPage]="catalogPage" [activePage]="activePage"></nitro-catalog-navigation-set-component>
            </div>
        </perfect-scrollbar>
    </div>`
})
export class CatalogNavigationComponent
{
    @Input()
    public catalogPage: CatalogPageData = null;

    @Input()
    public activePage: CatalogPageData = null;
}