import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Nitro } from '@nitrots/nitro-renderer/src/nitro/Nitro';

@Component({
    template: `
        <div>
            <div class="row mb-1">
                <div class="col-7">
                    <input type="text" class="form-control form-control-sm mb-1" [(ngModel)]="searchQuery" [placeholder]="'catalog.marketplace.search_name' | translate" />
                </div>
                <div class="col-5">
                    <div class="mt-2">{{ 'catalog.marketplace.search_price' | translate }}</div>
                </div>
            </div>
            <div class="row mb-2">
                <div class="col-7">
                    <select class="form-control form-control-sm w-100" (change)="onOptionSelect($event)">
                        <option [selected]="filter.value == sortType" [value]="filter.value" *ngFor="let filter of getFilters()">{{ filter.name }}</option>
                    </select>
                </div>
                <div class="col-5">
                    <div class="input-group">
                        <input type="number" placeholder="0" class="form-control form-control-sm mb-1" [(ngModel)]="searchPriceBetweenStart" />
                        <input type="number" placeholder="0" class="form-control form-control-sm" [(ngModel)]="searchPriceBetweenEnd" />
                    </div>
                </div>
            </div>
            <button (click)="search()" class="btn btn-secondary btn-block btn-sm">{{ 'generic.search' | translate }}</button>
        </div>
        `,
    selector: '[nitro-marketplace-sub-advanced]',
})
export class CatalogLayoutMarketplaceMarketplaceSubAdvancedComponent
{
    @Input()
    public sortTypes: number[];


    public sortType: number = 0;

    public searchQuery: string = '';
    public searchPriceBetweenStart: number = null;
    public searchPriceBetweenEnd: number = null;

    @Output()
    public onSearch = new EventEmitter<IMarketplaceSearchOptions>();

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
    }

    private translateKey(key: string): string
    {
        return Nitro.instance.localization.getValue(key);
    }

    public onOptionSelect(event)
    {
        const value = parseInt(event.target.value);
        this.sortType = value;
    }

    public search(): void
    {
        const options: IMarketplaceSearchOptions = {
            minPrice: this.searchPriceBetweenStart,
            maxPrice: this.searchPriceBetweenEnd,
            query: this.searchQuery,
            type: this.sortType
        };

        this.onSearch.emit(options);
    }

}

export interface IMarketplaceSearchOptions {
    query: string;
    type: number;
    minPrice: number;
    maxPrice: number;
}

interface IFilter {
    name: string,
    value: number
}
