import { Options } from '@angular-slider/ngx-slider';
import { Component, NgZone } from '@angular/core';
import { FurnitureStackHeightComposer } from '../../../../../../client/nitro/communication/messages/outgoing/room/furniture/logic/FurnitureStackHeightComposer';
import { ConversionTrackingWidget } from '../../../../../../client/nitro/ui/widget/ConversionTrackingWidget';
import { FurnitureCustomStackHeightWidgetHandler } from '../../handlers/FurnitureCustomStackHeightWidgetHandler';

@Component({
	selector: 'nitro-room-furniture-customstackheight-component',
    template: `
    <div *ngIf="visible" [bringToTop] [draggable] dragHandle=".card-header" class="card nitro-room-furniture-customstackheight-component">
        <div *ngIf="isLoading" class="card-loading-overlay"></div>
        <div class="card-header-container">
            <div class="card-header-overlay"></div>
            <div class="card-header">
                <div class="header-title">{{ ('widget.custom.stack.height.title') | translate }}</div>
                <div class="header-close" (click)="hide()"><i class="fas fa-times"></i></div>
            </div>
        </div>
        <div class="card-body">
            <div class="d-flex">
                <div class="m-2 custom-slider">
                    <ngx-slider name="heightRange" [options]="sliderOptions" [(ngModel)]="heightRange" (mouseup)="onHeightChange()"></ngx-slider>
                </div>
                <div class="p-2 flex-grow-1">
                    <p class="text-justify">{{ ('widget.custom.stack.height.text') | translate }}</p>
                    <input name="heightInput" type="number" class="form-control form-control-sm" [(ngModel)]="heightInput" [min]="minHeight" [max]="maxHeight" (keydown.enter)="onHeightChange()">
                    <button type="button" class="btn btn-green" (click)="placeAboveStack()">{{ 'furniture.above.stack' | translate }}</button>
                    <button type="button" class="btn btn-green" (click)="placeAtFloor()">{{ 'furniture.floor.level' | translate }}</button>
                </div>
            </div>
        </div>
    </div>`
})
export class CustomStackHeightComponent extends ConversionTrackingWidget
{
    private static MAX_HEIGHT: number       = 40;
    private static MAX_RANGE_HEIGHT: number = 10;
    private static STEP_VALUE: number       = 0.01;

    private _visible: boolean       = false;
    private _furniId: number        = -1;
    private _height: number         = 0;
    private _heightRange: string    = '0';
    private _heightInput: string    = '0';

    constructor(
        private _ngZone: NgZone)
    {
        super();
    }

    public open(furniId: number, height: number): void
    {
        this._ngZone.run(() =>
        {
            this._furniId   = furniId;
            this._height    = height;
            this._visible   = true;

            this.setHeight(height, true);
        });
    }

    public update(furniId: number, height: number): void
    {
        this._ngZone.run(() => ((this._furniId === furniId) && this.setHeight(height, true)));
    }

    public hide(): void
    {
        this._ngZone.run(() =>
        {
            this._visible   = false;
            this._furniId   = -1;
            this._height    = 0;
        });
    }

    public onHeightChange(): void
    {
        let stringValue = this._heightInput;
        let numberValue = 0;

        if((stringValue === null) || (stringValue === '')) numberValue = this._height;
        else numberValue = parseFloat(stringValue);

        this.setHeight(numberValue);
    }

    private setHeight(height: number, fromServer: boolean = false): void
    {
        height = Math.abs(height);
        
        if(!fromServer) ((height > CustomStackHeightComponent.MAX_HEIGHT) && (height = CustomStackHeightComponent.MAX_HEIGHT));

        this._height = parseFloat(height.toFixed(2));

        this._heightRange   = this._height.toString();
        this._heightInput   = this._height.toString();

        if(!fromServer) this.sendUpdate((this._height * 100));
    }

    public placeAboveStack(): void
    {
        this.sendUpdate(-100);
    }

    public placeAtFloor(): void
    {
        this.sendUpdate(0);
    }

    private sendUpdate(height: number): void
    {
        this.widgetHandler.container.connection.send(new FurnitureStackHeightComposer(this._furniId, ~~(height)));
    }

    public get handler(): FurnitureCustomStackHeightWidgetHandler
    {
        return (this.widgetHandler as FurnitureCustomStackHeightWidgetHandler);
    }

    public get visible(): boolean
    {
        return this._visible;
    }

    public set visible(flag: boolean)
    {
        this._visible = flag;
    }

    public get furniId(): number
    {
        return this._furniId;
    }

    public get height(): number
    {
        return this._height;
    }

    public get heightInput(): string
    {
        return this._heightInput;
    }

    public set heightInput(value: string)
    {
        //@ts-ignore
        if((value === null) || (value === '') || isNaN(value)) return;

        this._heightInput = value;
    }

    public get heightRange(): string
    {
        return this._heightRange;
    }

    public set heightRange(value: string)
    {
        this._heightRange = value;

        this.heightInput = this.heightRange;
    }

    public get minHeight(): number
    {
        return 0;
    }

    public get maxHeight(): number
    {
        return CustomStackHeightComponent.MAX_HEIGHT;
    }

    public get sliderOptions(): Options
    {
        return {
            floor: 0,
            ceil: CustomStackHeightComponent.MAX_RANGE_HEIGHT,
            step: CustomStackHeightComponent.STEP_VALUE,
            hidePointerLabels: true,
            hideLimitLabels: true,
            vertical: true
        };
    }
}