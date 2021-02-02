import { Component, Input, NgZone } from '@angular/core';
import { ConversionTrackingWidget } from '../../../../../../client/nitro/ui/widget/ConversionTrackingWidget';
import { IRoomWidgetHandler } from '../../../../../../client/nitro/ui/IRoomWidgetHandler';
import { LoveLockStartConfirmComposer } from '../../../../../../client/nitro/communication/messages/outgoing/room/furniture/logic/LoveLockStartConfirmComposer';
import { Nitro } from '../../../../../../client/nitro/Nitro';


@Component({
    templateUrl: './confirm.template.html'
})
export class FriendsFurniConfirmWidget extends ConversionTrackingWidget
{
    protected _visible: boolean                         = false;
    private _furniId: number = -1;


    constructor(
        protected _ngZone: NgZone)
    {
        super();
    }


    public open(furniId: number, start: boolean): void
    {
        if(this._visible && this._furniId != -1)
        {
            this.sendStart(this._furniId, false);
        }

        this._ngZone.run(() =>
        {
            this._furniId = furniId;
            this._visible = true;
        });

    }

    public handleButton(button: string): void
    {
        switch(button)
        {
            case 'confirm':
                this.sendStart(this._furniId, true);
                this.hide();
                break;
            case 'cancel':
                this.sendStart(this._furniId, false);
                this.hide();
                break;
        }
    }

    private sendStart(furniId: number, start: boolean): void
    {
        Nitro.instance.communication.connection.send(new LoveLockStartConfirmComposer(furniId, start));
    }

    public hide(): void
    {
        this._visible = false;
        this._furniId = -1;
    }

    public get visible(): boolean
    {
        return this._visible;
    }

}
