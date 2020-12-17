import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CatalogPageParser } from '../../../../../client/nitro/communication/messages/parser/catalog/CatalogPageParser';
import { CatalogPageOfferData } from '../../../../../client/nitro/communication/messages/parser/catalog/utils/CatalogPageOfferData';
import { CatalogService } from '../../services/catalog.service';

@Component({
    selector: 'nitro-catalog-purchase-component',
    templateUrl: './purchase.template.html'
})
export class CatalogPurchaseComponent implements OnChanges
{
    @Input()
    public activePage: CatalogPageParser = null;

    @Input()
    public activeOffer: CatalogPageOfferData = null;

    @Input()
    public quantityEnabled: boolean = false;

    @Input()
    public vertical: boolean = false;

    public quantity: number = 1;

    constructor(private _catalogService: CatalogService) {}

    public ngOnChanges(changes: SimpleChanges): void
    {
        const prev = changes.activeOffer.previousValue;
        const next = changes.activeOffer.currentValue;

        if(next && (next !== prev)) this.resetOffer();
    }

    private resetOffer(): void
    {
        this.quantity = 1;
    }

    public purchase(): void
    {
        this._catalogService.component && this._catalogService.component.confirmPurchase(this.activePage, this.activeOffer, this.quantity, this.extra);
    }

    public increase(): void
    {
        this.quantity++;
    }

    public decrease(): void
    {
        this.quantity--;

        if(this.quantity < 1) this.quantity = 1;
    }

    public get costCredits(): number
    {
        return (this.activeOffer.priceCredits * this.quantity);
    }

    public get costPoints(): number
    {
        return (this.activeOffer.priceActivityPoints * this.quantity);
    }

    public get pointsType(): number
    {
        return this.activeOffer.priceActivityPointsType;
    }

    public get extra(): string
    {
        return (this.activeOffer.products[0] && this.activeOffer.products[0].extraParam);
    }
}