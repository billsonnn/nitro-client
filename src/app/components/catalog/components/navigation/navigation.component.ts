import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CatalogPageData } from '../../../../../client/nitro/communication/messages/parser/catalog/utils/CatalogPageData';
import { Nitro } from '../../../../../client/nitro/Nitro';
import { IFurnitureData } from '../../../../../client/nitro/session/furniture/IFurnitureData';
import { IFurnitureDataListener } from '../../../../../client/nitro/session/furniture/IFurnitureDataListener';
import { CatalogService } from '../../services/catalog.service';

@Component({
    selector: '[nitro-catalog-navigation-component]',
    templateUrl: './navigation.template.html'
})
export class CatalogNavigationComponent implements OnInit, OnDestroy, IFurnitureDataListener
{
    public searchControl: FormControl = new FormControl();

    private _subscription: Subscription;

    constructor(private _catalogService: CatalogService)
    {}

    public ngOnInit(): void
    {
        this.subscribe();
    }

    public ngOnDestroy(): void
    {
        this.unsubscribe();
    }

    private subscribe(): void
    {
        this.unsubscribe();

        this._subscription = this.searchControl.valueChanges.pipe(
            distinctUntilChanged(),
            debounceTime(500)
        ).subscribe(value => this.search(value));
    }

    private unsubscribe(): void
    {
        if(!this._subscription) return;

        this._subscription.unsubscribe();

        this._subscription = null;
    }

    private search(value: string): void
    {
        if(!value || !value.length) return;

        value = value.toLocaleLowerCase();

        const furnitureData = Nitro.instance.sessionDataManager.getAllFurnitureData(this);

        if(!furnitureData) return;

        const foundFurniture: IFurnitureData[] = [];

        for(const furniture of furnitureData)
        {
            const hasOffer      = this._catalogService.getOfferPages(furniture.purchaseOfferId);
            const hasRentOffer  = this._catalogService.getOfferPages(furniture.rentOfferId);

            if(!hasOffer && !hasRentOffer) continue;

            const searchValue = [ furniture.className, furniture.name, furniture.description ].join(' ').toLocaleLowerCase();

            if(searchValue.indexOf(value) === -1) continue;

            foundFurniture.push(furniture);

            if(foundFurniture.length === 200) break;
        }

        this._catalogService.component.handleSearchResults(foundFurniture);
    }

    public loadFurnitureData(): void
    {

    }

    public get catalogPage(): CatalogPageData
    {
        return ((this._catalogService.component && this._catalogService.component.activeTab) || null);
    }
}
