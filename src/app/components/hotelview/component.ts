import { Component } from '@angular/core';
import { Nitro } from '../../../client/nitro/Nitro';
import { SessionService } from '../../security/services/session.service';

@Component({
    selector: 'nitro-hotelview-component',
    template: `
    <div class="nitro-hotelview-component" [ngStyle]="{background: backgroundColour}">
        <div [ngStyle]="{backgroundImage: 'url('+background+')'}" class="background position-absolute"></div>
        <img [src]="sun" class="sun position-absolute">
        <img [src]="drape" class="drape position-absolute">
        <img [src]="left" class="left position-absolute">
        <img [src]="rightRepeat" class="rightRepeat position-absolute">
        <img [src]="right" class="right position-absolute">
    </div>`
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
        const assetUrl = Nitro.instance.getConfiguration('asset.url');

        this._background = Nitro.instance.getConfiguration('hotelview.images')['background'].replace('%asset.url%', assetUrl);

        this._backgroundColour = Nitro.instance.getConfiguration('hotelview.images')['background.colour'];
        
        this._sun = Nitro.instance.getConfiguration('hotelview.images')['sun'].replace('%asset.url%',assetUrl);

        this._drape = Nitro.instance.getConfiguration('hotelview.images')['drape'].replace('%asset.url%', assetUrl);
        
        this._left = Nitro.instance.getConfiguration('hotelview.images')['left'].replace('%asset.url%', assetUrl);
        
        this._right = Nitro.instance.getConfiguration('hotelview.images')['right'].replace('%asset.url%', assetUrl);
        
        this._rightRepeat = Nitro.instance.getConfiguration('hotelview.images')['right.repeat'].replace('%asset.url%', assetUrl);
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