import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
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
            <div class="row">
                <div class="col-12">
                    <span>{{ ('widget.custom.stack.height.text') | translate }}</span>
                    <form class="form-inline" [formGroup]="form">
                        <div class="form-group">
                            <input type="range" class="form-control-range" formControlName="heightRange" [min]="minHeight" [max]="maxHeight" [step]="maxStep">
                            <input type="text" class="form-control form-control-sm" formControlName="height" (keydown.enter)="setHeight()">
                        </div>
                    </form>
                </div>
            </div>
            <div class="row">
                <div class="col-12 justify-space-between">
                    <button type="button" class="btn btn-primary">{{ 'furniture.above.stack' | translate }}</button>
                    <button type="button" class="btn btn-primary">{{ 'furniture.floor.level' | translate }}</button>
                </div>
            </div>
        </div>
    </div>`
})
export class CustomStackHeightComponent extends ConversionTrackingWidget implements OnInit, OnDestroy
{
    private static SLIDER_RANGE: number = 10;
    private static MAX_HEIGHT: number = 40;

    private _visible: boolean = false;
    private _furniId: number = -1;
    private _height: number = 0;

    private _lastHeightRange: number = 0;
    private _lastHeight: number = 0;

    private _form: FormGroup;
    private _subscription: Subscription;

    constructor(
        private _formBuilder: FormBuilder,
        private _ngZone: NgZone)
    {
        super();
    }

    public ngOnInit(): void
    {
        this._form = this._formBuilder.group({
            heightRange: [ null ],
            height: [ null ]
        });

        this._subscription = this._form.valueChanges.subscribe(this.onChanges.bind(this));
    }

    public ngOnDestroy(): void
    {
        if(this._subscription) this._subscription.unsubscribe();
    }

    private onChanges(values: any): void
    {
        const heightRange   = parseFloat(values.heightRange);
        const height        = parseFloat(values.height);

        if(this._lastHeightRange !== heightRange) this.setHeight(heightRange);
        else if(this._lastHeight !== height) this.setHeight(height);

        this._lastHeightRange = heightRange;
        this._lastHeight = height;
    }

    public open(furniId: number, height: number): void
    {
        this._ngZone.run(() =>
        {
            this._furniId   = furniId;
            this._height    = Math.min(height, CustomStackHeightComponent.MAX_HEIGHT);
            this._visible   = true;

            this._form.controls.heightRange.setValue(this._height);
        });
    }

    public update(furniId: number, height: number): void
    {
        this._ngZone.run(() =>
        {
            if(this._furniId === furniId)
            {
                
            }
        });
    }

    public hide(): void
    {
        this._ngZone.run(() =>
        {
            this._visible = false;
        });
    }

    private setHeight(height: number): void
    {
        if(height === null) return;

        this._height = height;

        this._form.controls.heightRange.setValue(height, { emitEvent: false });
        this._form.controls.height.setValue(height, { emitEvent: false });

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

    public get form(): FormGroup
    {
        return this._form;
    }

    public get minHeight(): number
    {
        return 0;
    }

    public get maxHeight(): number
    {
        return 10;
    }

    public get maxStep(): number
    {
        return 0;
    }
}