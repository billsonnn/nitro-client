import { Component } from '@angular/core';
import { Nitro } from '@nitrots/nitro-renderer/src/nitro/Nitro';
import { SessionService } from '../../../../security/services/session.service';

@Component({
    selector: 'nitro-hotelview-component',
    templateUrl: './hotelview.template.html'
})
export class HotelViewComponent
{
    private _background: string;
    private _backgroundColour: string;
    private _sun: string;
    private _drape: string;
    private _left: string;
    private _right: string;
    private _rightRepeat: string;

    constructor(
        private sessionService: SessionService)
    {
        this._background        = Nitro.instance.core.configuration.interpolate(Nitro.instance.getConfiguration('hotelview.images')['background']);
        this._backgroundColour  = Nitro.instance.getConfiguration('hotelview.images')['background.colour'];
        this._sun               = Nitro.instance.core.configuration.interpolate(Nitro.instance.getConfiguration('hotelview.images')['sun']);
        this._drape             = Nitro.instance.core.configuration.interpolate(Nitro.instance.getConfiguration('hotelview.images')['drape']);
        this._left              = Nitro.instance.core.configuration.interpolate(Nitro.instance.getConfiguration('hotelview.images')['left']);
        this._right             = Nitro.instance.core.configuration.interpolate(Nitro.instance.getConfiguration('hotelview.images')['right']);
        this._rightRepeat       = Nitro.instance.core.configuration.interpolate(Nitro.instance.getConfiguration('hotelview.images')['right.repeat']);
    }

    public get figure(): string
    {
        return this.sessionService.figure;
    }

    public get background(): string
    {
        return (this._background || null);
    }

    public get backgroundColour(): string
    {
        return (this._backgroundColour || null);
    }

    public get sun(): string
    {
        return (this._sun || null);
    }

    public get drape(): string
    {
        return (this._drape || null);
    }

    public get left(): string
    {
        return (this._left || null);
    }

    public get right(): string
    {
        return (this._right || null);
    }

    public get rightRepeat(): string
    {
        return (this._rightRepeat || null);
    }
}
