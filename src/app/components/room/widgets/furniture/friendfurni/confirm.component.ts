import { Component, Input, NgZone } from '@angular/core';
import { ConversionTrackingWidget } from '../../../../../../client/nitro/ui/widget/ConversionTrackingWidget';


@Component({
    templateUrl: './confirm.template.html'
})
export class FriendsFurniConfirmWidget extends ConversionTrackingWidget
{
    protected _visible: boolean                         = false;


    constructor(
        protected _ngZone: NgZone)
    {
        super();
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


}
