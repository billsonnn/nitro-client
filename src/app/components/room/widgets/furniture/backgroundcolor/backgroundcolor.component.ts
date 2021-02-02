import { Options } from '@angular-slider/ngx-slider';
import { Component, NgZone } from '@angular/core';
import { ConversionTrackingWidget } from '../../../../../../client/nitro/ui/widget/ConversionTrackingWidget';
import { FurnitureDimmerWidgetHandler } from '../../handlers/FurnitureDimmerWidgetHandler';
import { ColorConverter } from '../../../../../../client/room/utils/ColorConverter';
import { FurnitureBackgroundColorWidgetHandler } from '../../handlers/FurnitureBackgroundColorWidgetHandler';
import { ApplyTonerComposer } from '../../../../../../client/nitro/communication/messages/outgoing/room/furniture/toner/ApplyTonerComposer';
import { FurnitureMultiStateComposer } from '../../../../../../client/nitro/communication/messages/outgoing/room/furniture/logic/FurnitureMultiStateComposer';


@Component({
    selector: 'nitro-room-furniture-backgroundcolor-component',
    templateUrl: './backgroundcolor.template.html'
})
export class BackgroundColorFurniWidget extends ConversionTrackingWidget
{
    private _visible: boolean       = false;
    private _furniId: number;
    public saturation: number;
    public hue: number;
    public lightness: number;
    public rgbColor: string = '';

    constructor(
        private _ngZone: NgZone)
    {
        super();
    }

    public open(objectId: number, hue: number, sat: number, light: number): void
    {
        this._ngZone.run(() =>
        {
            this._furniId = objectId;
            this.hue = Math.max(hue, 0);
            this.saturation = Math.max(sat, 0);
            this.lightness = Math.max(light, 0);
            this._visible = true;
            this.onSliderChange();
        });
    }


    public get handler(): FurnitureBackgroundColorWidgetHandler
    {
        return (this.widgetHandler as FurnitureBackgroundColorWidgetHandler);
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
        const color = ColorConverter._Str_13949(((((this.hue & 0xFF) << 16) + ((this.saturation & 0xFF) << 8)) + (this.lightness & 0xFF)));

        const r = (color >> 16 & 0xFF);
        const g = (color >> 8 & 0xFF);
        const b = (color & 0xFF);


        this.rgbColor = `rgb(${r}, ${g}, ${b})`;
    }

    public handleButton(button: string): void
    {
        switch(button)
        {
            case 'apply':
                this.handler.container.connection.send(new ApplyTonerComposer(this._furniId, this.hue, this.saturation, this.lightness));
                break;
            case 'on_off':
                this.handler.container.connection.send(new FurnitureMultiStateComposer(this._furniId));
                break;
        }
    }

    public get delaySliderOptions(): Options
    {
        return {
            floor:0,
            ceil:255,
            step:1,
            hidePointerLabels: true,
            hideLimitLabels: true,
        };
    }
}

