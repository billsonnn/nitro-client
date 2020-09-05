import { transition, trigger, useAnimation } from '@angular/animations';
import { AfterViewInit, Component, ElementRef, Input, NgZone, ViewChild } from '@angular/core';
import { bounceIn } from 'ng-animate';
import { Toast, ToastPackage, ToastrService } from 'ngx-toastr';
import { CatalogPageOfferData } from '../../../../client/nitro/communication/messages/parser/catalog/utils/CatalogPageOfferData';
import { Nitro } from '../../../../client/nitro/Nitro';
import { RoomEngineAnimateIconEvent } from '../../../../client/nitro/room/events/RoomEngineAnimateIconEvent';
import { RoomPreviewer } from '../../../../client/nitro/room/preview/RoomPreviewer';
import { Vector3d } from '../../../../client/room/utils/Vector3d';
  
@Component({
    selector: '[nitro-toast-confirm-purchase-component]',
    template: `
    <div [@animation]="animation" class="card nitro-alert nitro-toast-confirm-purchase-component" [draggable] dragHandle=".card-header" [style.display]="state.value === 'inactive' ? 'none' : ''">
        <div *ngIf="isLoading" class="loading-overlay"></div>
        <div class="card-header">
            <div class="header-title">{{ title }}</div>
            <div class="header-close" (click)="remove()"><i class="fas fa-times"></i></div>
        </div>
        <div class="d-flex card-body">
            <div class="d-flex justify-content-center align-items-center product-preview">
                <img #productImage [src]="" />
            </div>
            <div class="d-flex flex-grow-1 flex-column justify-content-center">
                <div class="offer-name">{{ offer.localizationId }}</div>
                <div class="offer-quantity" *ngIf="quantity">X {{ quantity }}</div>
                <div class="badge badge-secondary" *ngIf="costCredits"><i class="icon icon-currency--1"></i> {{ costCredits }}</div>
                <div class="badge badge-secondary" *ngIf="costPoints"><i class="icon icon-currency-{{ pointsType }}"></i> {{ costPoints }}</div>
            </div>
        </div>
        <div class="card-footer">
            <div class="button-container btn-group">
                <button type="button" class="btn btn-primary" (click)="confirm()">Confirm</button>
                <button *ngIf="options.closeButton" type="button" class="btn btn-primary" (click)="remove()">Cancel</button>
            </div>
        </div>
    </div>`,
    animations: [
        trigger('animation', [
            transition('* => *',
                useAnimation(bounceIn,
                {
                    params: { timing: 0.5, delay: 0 }
                })
            )
        ])
    ]
})
export class ConfirmPurchaseToastComponent extends Toast implements AfterViewInit
{
    @ViewChild('productImage')
    public productImage: ElementRef<HTMLImageElement>;

    @Input()
    public roomPreviewer: RoomPreviewer = null;

    @Input()
    public offer: CatalogPageOfferData = null;

    @Input()
    public costCredits: number = 0;

    @Input()
    public costPoints: number = 0;

    @Input()
    public pointsType: number = -1;

    @Input()
    public quantity: number = 1;

    public animation: any;
    public isLoading: boolean = false;
    
    constructor(
        protected toastrService: ToastrService,
        public toastPackage: ToastPackage,
        public ngZone: NgZone)
    {
        super(toastrService, toastPackage, ngZone);
    }

    public ngAfterViewInit(): void
    {
        this.refresh();
    }

    public refresh(): void
    {
        this.refreshImage();
    }

    private refreshImage(): void
    {
        this.ngZone.runOutsideAngular(() =>
        {
            if(!this.roomPreviewer) return;

            const element = this.productImageElement;

            if(!element) return;
            
            const image = this.roomPreviewer.getRoomObjectImage(new Vector3d(180), 64, null);

            if(image && image.data)
            {
                const base64 = Nitro.instance.renderer.extract.base64(image.data);

                if(base64)
                {
                    element.src = base64;
                }
            }
        });
    }

    public confirm(): void
    {
        this.toastPackage.triggerAction('CONFIRM');
    }

    public completePurchase(): void
    {        
        this.ngZone.runOutsideAngular(() =>
        {
            const element = (this.productImageElement.cloneNode() as HTMLImageElement);

            element.className           = 'toolbar-icon-animation';
            element.style.visibility    = 'hidden';

            this.productImageElement.parentElement.appendChild(element);

            const bounds = element.getBoundingClientRect();
            
            Nitro.instance.roomEngine.events.dispatchEvent(new RoomEngineAnimateIconEvent(this.roomPreviewer.roomId, 'inventory', element, bounds.x, bounds.y));
        });
    }

    public get productImageElement(): HTMLImageElement
    {
        return ((this.productImage && this.productImage.nativeElement) || null);
    }
}