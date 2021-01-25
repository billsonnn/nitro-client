import { Component, ElementRef, Input, NgZone, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { CatalogClubOfferData } from '../../../../../client/nitro/communication/messages/parser/catalog/utils/CatalogClubOfferData';
import { ToolbarIconEnum } from '../../../../../client/nitro/enums/ToolbarIconEnum';
import { NitroToolbarAnimateIconEvent } from '../../../../../client/nitro/events/NitroToolbarAnimateIconEvent';
import { Nitro } from '../../../../../client/nitro/Nitro';
import { TextureUtils } from '../../../../../client/room/utils/TextureUtils';
import { CatalogService } from '../../services/catalog.service';

@Component({
    selector: 'nitro-catalog-confirm-vip-subscription-component',
    templateUrl: './confirm-vip-subscription.template.html'
})
export class CatalogConfirmVipSubscriptionComponent implements OnChanges
{

    @Input()
    public subscription: CatalogClubOfferData = null;

    @ViewChild('imageElement')
    public imageElement: ElementRef<HTMLDivElement>;

    private _imageUrl: string = '';

    constructor(
        private _catalogService: CatalogService,
        private _ngZone: NgZone
    )
    {}

    public ngOnChanges(changes: SimpleChanges): void
    {
        // const prev = changes.offer.previousValue;
        // const next = changes.offer.currentValue;
        //
        // if(next && (prev !== next)) this.refresh();
    }

    public getSubscriptionText(): string
    {
        let text = Nitro.instance.localization.getValue('catalog.vip.buy.confirm.end_date');
        text = text.replace('%month%', this.subscription.month.toString());
        text = text.replace('%day%', this.subscription.day.toString());
        text = text.replace('%year%', this.subscription.year.toString());
        return text;
    }

    public getSubscriptionHeader(): string
    {
        const purse = this._catalogService.purse;

        const local3 = (purse.clubDays > 0 || purse.clubPeriods > 0) ? 'extension.' : 'subscription.';

        const local4 = this.subscription.months == 0 ? 'days' : 'months';
        
        const local5 = 'catalog.vip.buy.confirm.' +local3 + local4;

        let text = Nitro.instance.localization.getValue(local5);

        const daysOrMonths = this.subscription.months == 0 ? this.subscription.extraDays : this.subscription.months;

        text = text.replace('%NUM_' + local4.toUpperCase() + '%', (this.subscription.months == 0) ? this.subscription.extraDays.toString() : this.subscription.months.toString());

        return text;
    }

    public getCurrencyUrl(type: number): string
    {
        const url = Nitro.instance.getConfiguration<string>('currency.asset.icon.url');

        return url.replace('%type%', type.toString());
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

            const object = roomPreviewer.getRoomPreviewObject();

            if(object)
            {
                const texture   = object.visualization.getImage(0xFF0000, -1);
                const element   = TextureUtils.generateImage(texture);

                if(element)
                {
                    this._imageUrl = element.src;
                }
            }
        });
    }

    public purchase(): void
    {
        //this._catalogService.purchase(this.page, this.offer, this.quantity, this.extra);
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
                this.imageElement.nativeElement.appendChild(element);
            }

            const bounds = element.getBoundingClientRect();

            const event = new NitroToolbarAnimateIconEvent(element, bounds.x, bounds.y);

            event.iconName = ToolbarIconEnum.INVENTORY;

            Nitro.instance.roomEngine.events.dispatchEvent(event);
        });
    }

    public get imageUrl(): string
    {
        return this._imageUrl;
    }
}
