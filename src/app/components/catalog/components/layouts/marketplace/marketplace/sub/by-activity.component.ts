import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { CatalogLayout } from '../../../../../CatalogLayout';
import { Nitro } from '../../../../../../../../client/nitro/Nitro';

@Component({
    template: `
        <div class="rounded bg-secondary">

            <p class="text-center">{{ 'catalog.marketplace.sort_order' | translate }}</p>
            <select class="form-control"  (change)="onOptionSelect($event)">
                <option [selected]="filter.value == sortType" [value]="filter.value" *ngFor="let filter of getFilters()">{{ filter.name }}</option>
            </select>
        </div>`,
    selector: '[nitro-marketplace-sub-activity]',
})
export class CatalogLayoutMarketplaceMarketplaceSubActivityComponent implements OnInit
{
    @Input()
    public sortTypes: number[];




    @Output()
    public sortChanged = new EventEmitter<number>();

    public sortType: number = 0;

    public getFilters(): IFilter[]
    {
        const filters = [];

        for(const type of this.sortTypes)
        {
            const name = this.translateKey(`catalog.marketplace.sort.${type}`);
            filters.push({
                name,
                value: type
            });
        }

        return filters;
    }

    public ngOnInit(): void
    {
        this.sortType = this.sortTypes[0];
        //this.sortChanged.emit(this.sortType);
    }

    private translateKey(key: string): string
    {
        return Nitro.instance.localization.getValue(key);
    }

    public onOptionSelect(event)
    {
        const value = parseInt(event.target.value);
        this.sortType = value;
        this.sortChanged.emit(value);
    }


}

interface IFilter {
    name: string,
    value: number
}


