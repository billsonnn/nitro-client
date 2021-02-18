import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { CatalogPageData } from '../../../../../client/nitro/communication/messages/parser/catalog/utils/CatalogPageData';
import { CatalogService } from '../../services/catalog.service';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, tap } from 'rxjs/operators';
import { Nitro } from '../../../../../client/nitro/Nitro';
import { IFurnitureDataListener } from '../../../../../client/nitro/session/furniture/IFurnitureDataListener';
import { IFurnitureData } from '../../../../../client/nitro/session/furniture/IFurnitureData';

@Component({
    selector: '[nitro-catalog-navigation-component]',
    templateUrl: './navigation.template.html'
})
export class CatalogNavigationComponent implements AfterViewInit, IFurnitureDataListener
{

    @ViewChild('searchInput') searchInput: ElementRef;

    constructor(private _catalogService: CatalogService)
    {
    }

    public get catalogPage(): CatalogPageData
    {
        return ((this._catalogService.component && this._catalogService.component.activeTab) || null);
    }

    ngAfterViewInit()
    {
        fromEvent(this.searchInput.nativeElement, 'keyup')
            .pipe(
                filter(Boolean),
                debounceTime(1000),
                distinctUntilChanged(),
                tap((text) =>
                {
                    this.doSearch();
                })
            )
            .subscribe();
    }

    private doSearch()
    {
        if(!this.searchInput.nativeElement.value || this.searchInput.nativeElement.value.trim().length < 3) return;

        const searchValue = this.searchInput.nativeElement.value.toLowerCase();

        const furnitureData = Nitro.instance.sessionDataManager.getAllFurnitureData(this);

        const foundFurni: IFurnitureData[] = [];

        for(const furni of furnitureData)
        {
            const searchProperties = [furni.className, furni.description, furni.name].join(' ').toLowerCase();

            const isPurchasable =  this._catalogService.hasOffer(furni.purchaseOfferId, true);
            const isRentable = this._catalogService.hasOffer(furni.rentOfferId, true);

            if(!isPurchasable && !isRentable) continue;

            if(foundFurni.length < 200 && searchProperties.indexOf(searchValue) >= 0)
            {
                foundFurni.push(furni);
            }
        }

        console.log({ foundFurni });

    }

    loadFurnitureData(): void
    {
    }
}
