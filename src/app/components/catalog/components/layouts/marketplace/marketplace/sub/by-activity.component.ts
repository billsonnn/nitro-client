import { Component, Input, OnInit } from '@angular/core';
import { CatalogLayout } from '../../../../../CatalogLayout';
import { Nitro } from '../../../../../../../../client/nitro/Nitro';

@Component({
    template: `
        <div class="rounded bg-secondary">

            <p class="text-center">{{ 'catalog.marketplace.sort_order' | translate }}</p>

            <select class="form-control">
                <option *ngFor="let filter of getFilters()">{{ filter }}</option>
            </select>
        </div>`,
    selector: '[nitro-marketplace-sub-activity]',
})
export class CatalogLayoutMarketplaceMarketplaceSubActivityComponent
{
    @Input()
    public sortTypes: number[];

    public getFilters(): string[]
    {
        const filters = [];

        for(const type of this.sortTypes)
        {
            filters.push(this.translateKey(`catalog.marketplace.sort.${type}`));
        }

        return filters;
    }

    private translateKey(key: string): string
    {
        return Nitro.instance.localization.getValue(key);
    }


}


