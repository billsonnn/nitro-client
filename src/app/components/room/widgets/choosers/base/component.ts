import { Options } from '@angular-slider/ngx-slider';
import { Component, NgZone } from '@angular/core';
import { ConversionTrackingWidget } from '../../../../../../client/nitro/ui/widget/ConversionTrackingWidget';
import { RoomWidgetRoomObjectMessage } from '../../messages/RoomWidgetRoomObjectMessage';
import { RoomWidgetFurniItem } from '../../events/RoomWidgetFurniItem';
@Component({
    selector: 'nitro-room-chooser-base-component',
    templateUrl: './template.html'
})
export class ChooserWidgetBaseComponent extends ConversionTrackingWidget
{

    protected _visible: boolean       = false;
    public _items: RoomWidgetFurniItem[] = [];

    constructor(
        protected _ngZone: NgZone)
    {
        super();
    }

    public choose(id: number, category: number): void
    {
        this.messageListener.processWidgetMessage(new RoomWidgetRoomObjectMessage(RoomWidgetRoomObjectMessage.SELECT_OBJECT, id, category));
    }

    public open(furniId: number, height: number): void
    {
        this._ngZone.run(() =>
        {
            this._visible   = true;
        });
    }

    public hide(): void
    {
        this._ngZone.run(() =>
        {
            this._visible   = false;
        });
    }


    public get visible(): boolean
    {
        return this._visible;
    }

    public set visible(flag: boolean)
    {
        this._visible = flag;
    }

    public populate(items: RoomWidgetFurniItem[]): void
    {
        this._items = items;
    }
}
