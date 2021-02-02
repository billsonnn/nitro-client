import { Options } from '@angular-slider/ngx-slider';
import { Component, NgZone } from '@angular/core';
import { ConversionTrackingWidget } from '../../../../../../client/nitro/ui/widget/ConversionTrackingWidget';
import { FurnitureDimmerWidgetHandler } from '../../handlers/FurnitureDimmerWidgetHandler';


@Component({
    selector: 'nitro-room-furniture-backgroundcolor-component',
    templateUrl: './backgroundcolor.template.html'
})
export class BackgroundColorFurniWidget extends ConversionTrackingWidget
{
    private _visible: boolean       = false;
    private _furniId: number;
    private _saturation: number;
    private _hue: number;
    private _lightness: number;

    constructor(
        private _ngZone: NgZone)
    {
        super();
    }

    public open(objectId: number, hue: number, sat: number, light: number): void
    {
        debugger;
        this._ngZone.run(() =>
        {
            this._furniId = objectId;
            this._hue = Math.max(hue, 0);
            this._saturation = Math.max(sat, 0);
            this._lightness = Math.max(light, 0);
            this._visible = true;
        });
    }


    public get handler(): FurnitureDimmerWidgetHandler
    {
        return (this.widgetHandler as FurnitureDimmerWidgetHandler);
    }

    public hide(): void
    {
        this._visible = false;
    }
    public get visible(): boolean
    {
        return this._visible;
    }

    public set visible(flag: boolean)
    {
        this._visible = flag;
    }


    public onSliderChange(): void
    {
    }





    public get delaySliderOptions(): Options
    {
        return {
            floor:75,
            ceil:255,
            step:1,
            hidePointerLabels: true,
            hideLimitLabels: true,
        };
    }
}

