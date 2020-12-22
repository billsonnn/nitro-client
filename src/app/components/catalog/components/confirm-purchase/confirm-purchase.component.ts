import { Component, ElementRef, Input, NgZone, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { CatalogPageParser } from '../../../../../client/nitro/communication/messages/parser/catalog/CatalogPageParser';
import { CatalogPageOfferData } from '../../../../../client/nitro/communication/messages/parser/catalog/utils/CatalogPageOfferData';
import { ToolbarIconEnum } from '../../../../../client/nitro/enums/ToolbarIconEnum';
import { NitroToolbarAnimateIconEvent } from '../../../../../client/nitro/events/NitroToolbarAnimateIconEvent';
import { Nitro } from '../../../../../client/nitro/Nitro';
import { Vector3d } from '../../../../../client/room/utils/Vector3d';
import { CatalogService } from '../../services/catalog.service';
  
@Component({
    selector: 'nitro-catalog-confirm-purchase-component',
    templateUrl: './confirm-purchase.template.html'
})
export class CatalogConfirmPurchaseComponent implements OnChanges
{
    @Input()
    public page: CatalogPageParser = null;

    @Input()
    public offer: CatalogPageOfferData = null;

    @Input()
    public quantity: number = 1;

    @Input()
    public extra: string = null;

    @Input()
    public completed: boolean = false;

    @ViewChild('imageElement')
    public imageElement: ElementRef<HTMLDivElement>;;

    private _imageUrl: string = '';

    constructor(
        private _catalogService: CatalogService,
        private _ngZone: NgZone
    ) {}

    public ngOnChanges(changes: SimpleChanges): void
    {
        const prev = changes.offer.previousValue;
        const next = changes.offer.currentValue;

        if(next && (prev !== next)) this.refresh();
    }

    public hide(): void
    {
        (this._catalogService.component && this._catalogService.component.hidePurchaseConfirmation());
    }

    public refresh(): void
    {
        this.refreshImage();
    }

    private refreshImage(): void
    {
        this._ngZone.runOutsideAngular(() =>
        {
            this._imageUrl = '';

            const roomPreviewer = (this._catalogService.component && this._catalogService.component.roomPreviewer);

            if(!roomPreviewer) return;
            
            const image     = roomPreviewer.getRoomObjectImage(new Vector3d(180), 64, null);
            const element   = image.getImage();

            if(element)
            {
                this._imageUrl = element.src;
            }
        });
    }

    public purchase(): void
    {
        this._catalogService.purchase(this.page, this.offer, this.quantity, this.extra);
    }

    private completePurchase(): void
    {        
        this._ngZone.runOutsideAngular(() =>
        {
            const element = new HTMLImageElement();

            element.className           = 'toolbar-icon-animation';
            element.src                 = this._imageUrl;
            element.style.visibility    = 'hidden';

            if(this.imageElement)
            {
                console.log('fkin tru')
                this.imageElement.nativeElement.appendChild(element);
            }

            const bounds = element.getBoundingClientRect();

            const event = new NitroToolbarAnimateIconEvent(element, bounds.x, bounds.y);

            event.iconName = ToolbarIconEnum.INVENTORY;
            
            Nitro.instance.roomEngine.events.dispatchEvent(event);
        });
    }

    public get costCredits(): number
    {
        return (this.offer.priceCredits * this.quantity);
    }

    public get costPoints(): number
    {
        return (this.offer.priceActivityPoints * this.quantity);
    }

    public get pointsType(): number
    {
        return this.offer.priceActivityPointsType;
    }

    public get imageUrl(): string
    {
        return this._imageUrl;
    }
}