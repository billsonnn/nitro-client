import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { IMessageEvent } from '../../../../client/core/communication/messages/IMessageEvent';
import { FurnitureListAddOrUpdateEvent } from '../../../../client/nitro/communication/messages/incoming/inventory/furni/FurnitureListAddOrUpdateEvent';
import { FurnitureListEvent } from '../../../../client/nitro/communication/messages/incoming/inventory/furni/FurnitureListEvent';
import { FurnitureListInvalidateEvent } from '../../../../client/nitro/communication/messages/incoming/inventory/furni/FurnitureListInvalidateEvent';
import { FurnitureListRemovedEvent } from '../../../../client/nitro/communication/messages/incoming/inventory/furni/FurnitureListRemovedEvent';
import { FurniturePostItPlacedEvent } from '../../../../client/nitro/communication/messages/incoming/inventory/furni/FurniturePostItPlacedEvent';
import { Nitro } from '../../../../client/nitro/Nitro';

@Injectable()
export class InventoryService implements OnDestroy
{
    private _messages: IMessageEvent[];

    constructor(
        private toastrService: ToastrService,
        private ngZone: NgZone)
    {
        this.registerMessages();
    }

    public ngOnDestroy(): void
    {
        this.unregisterMessages();
    }

    private registerMessages(): void
    {
        if(this._messages) this.unregisterMessages();

        this._messages = [
            new FurnitureListAddOrUpdateEvent(this.onFurnitureListAddOrUpdateEvent.bind(this)),
            new FurnitureListEvent(this.onFurnitureListEvent.bind(this)),
            new FurnitureListInvalidateEvent(this.onFurnitureListInvalidateEvent.bind(this)),
            new FurnitureListRemovedEvent(this.onFurnitureListRemovedEvent.bind(this)),
            new FurniturePostItPlacedEvent(this.onFurniturePostItPlacedEvent.bind(this))
        ];

        for(let message of this._messages) Nitro.instance.communication.registerMessageEvent(message);
    }

    private unregisterMessages(): void
    {
        if(this._messages && this._messages.length)
        {
            for(let message of this._messages) Nitro.instance.communication.removeMessageEvent(message);
        }
    }

    private onFurnitureListAddOrUpdateEvent(event: FurnitureListAddOrUpdateEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        console.log(parser);
    }

    private onFurnitureListEvent(event: FurnitureListEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        console.log(parser);
    }

    private onFurnitureListInvalidateEvent(event: FurnitureListInvalidateEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        console.log(parser);
    }

    private onFurnitureListRemovedEvent(event: FurnitureListRemovedEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        console.log(parser);
    }

    private onFurniturePostItPlacedEvent(event: FurnitureListAddOrUpdateEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        console.log(parser);
    }
}