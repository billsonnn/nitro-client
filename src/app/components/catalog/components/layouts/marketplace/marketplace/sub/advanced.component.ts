import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CatalogLayout } from '../../../../../CatalogLayout';
import { Nitro } from '../../../../../../../../client/nitro/Nitro';

@Component({
    template: `
        <div class="rounded bg-secondary">

            <p>{{ 'catalog.marketplace.search_name' | translate }}</p>
            <input type="text" class="form-control" [(ngModel)]="searchQuery" />
            <p>{{ 'catalog.marketplace.search_price' | translate }}</p>
            <input type="number" class="form-control" [(ngModel)]="searchPriceBetweenStart" />
            <input type="number" class="form-control" [(ngModel)]="searchPriceBetweenEnd" />
            <select class="form-control" (change)="onOptionSelect($event)">
                <option [selected]="filter.value == sortType" [value]="filter.value"
                        *ngFor="let filter of getFilters()">{{ filter.name }}</option>
            </select>
            <button type="button" (click)="search()" class="btn btn-primary">{{ 'search' | translate }}</button>
        </div>`,
    selector: '[nitro-marketplace-sub-advanced]',
})
export class CatalogLayoutMarketplaceMarketplaceSubAdvancedComponent
{
    @Input()
    public sortTypes: number[];


    @Output()
    public sortChanged = new EventEmitter<number>();

    public sortType: number = 0;

    public searchQuery: string = '';
    public searchPriceBetweenStart: number = null;
    public searchPriceBetweenEnd: number = null;

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

    public search(): void
    {

    }

}



interface IFilter {
    name: string,
    value: number
}

