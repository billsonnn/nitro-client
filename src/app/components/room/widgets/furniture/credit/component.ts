import { Component, NgZone } from '@angular/core';
import { IEventDispatcher } from '../../../../../../client/core/events/IEventDispatcher';
import { ConversionTrackingWidget } from '../../../../../../client/nitro/ui/widget/ConversionTrackingWidget';
import { RoomWidgetUpdateEvent } from '../../../../../../client/nitro/ui/widget/events/RoomWidgetUpdateEvent';
import { RoomWidgetCreditFurniUpdateEvent } from '../../events/RoomWidgetCreditFurniUpdateEvent';
import { FurnitureCreditWidgetHandler } from '../../handlers/FurnitureCreditWidgetHandler';
import { RoomWidgetCreditFurniRedeemMessage } from '../../messages/RoomWidgetCreditFurniRedeemMessage';

@Component({
    selector: 'nitro-room-furniture-credit-compontent',
    templateUrl: './credit.template.html'
})
export class FurnitureWidgetCreditComponent extends ConversionTrackingWidget
{
    private _objectId: number   = -1;
    private _visible: boolean   = false;
    private _value: string      = '0';

    constructor(
        private _ngZone: NgZone)
    {
        super();

        this.onRoomWidgetCreditFurniUpdateEvent = this.onRoomWidgetCreditFurniUpdateEvent.bind(this);
    }

    public registerUpdateEvents(eventDispatcher: IEventDispatcher): void
    {
        if(!eventDispatcher) return;

        eventDispatcher.addEventListener(RoomWidgetCreditFurniUpdateEvent.RWCFUE_CREDIT_FURNI_UPDATE, this.onRoomWidgetCreditFurniUpdateEvent);

        super.registerUpdateEvents(eventDispatcher);
    }

    public unregisterUpdateEvents(eventDispatcher: IEventDispatcher): void
    {
        if(!eventDispatcher) return;

        eventDispatcher.removeEventListener(RoomWidgetCreditFurniUpdateEvent.RWCFUE_CREDIT_FURNI_UPDATE, this.onRoomWidgetCreditFurniUpdateEvent);

        super.unregisterUpdateEvents(eventDispatcher);
    }

    private onRoomWidgetCreditFurniUpdateEvent(event: RoomWidgetUpdateEvent): void
    {
        if(!event) return;

        const creditEvent = <RoomWidgetCreditFurniUpdateEvent> event;

        if(!creditEvent) return;

        this._objectId  = creditEvent.objectId;

        this._ngZone.run(() =>
        {
            this._visible   = true;
            this._value     = creditEvent.value.toString();
        });
    }

    public sendRedeem(): void
    {
        if(this._objectId == -1) return;

        this.messageListener.processWidgetMessage(new RoomWidgetCreditFurniRedeemMessage(RoomWidgetCreditFurniRedeemMessage.RWFCRM_REDEEM, this._objectId));
        this.hide();
    }

    public hide(): void
    {
        this._visible = false;
    }

    public get handler(): FurnitureCreditWidgetHandler
    {
        return (this.widgetHandler as FurnitureCreditWidgetHandler);
    }

    public get visible(): boolean
    {
        return this._visible;
    }

    public set visible(flag: boolean)
    {
        this._visible = flag;
    }

    public get value(): string
    {
        return this._value;
    }
}