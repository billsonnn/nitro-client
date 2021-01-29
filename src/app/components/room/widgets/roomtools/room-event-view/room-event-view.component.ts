import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ConversionTrackingWidget } from '../../../../../../client/nitro/ui/widget/ConversionTrackingWidget';
import { RoomDataParser } from '../../../../../../client/nitro/communication/messages/parser/room/data/RoomDataParser';

@Component({
    selector: 'nitro-room-event-view-component',
    templateUrl: './room-event-view.template.html'
})
export class RoomEventViewComponent extends ConversionTrackingWidget
{
    @Input()
    roomData: RoomDataParser;

    @Input()
    @Output()
    isVisible: boolean;

    @Output()
    roomEventViewClosed: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor()
    {
        super();
    }

    public close()
    {
        this.roomEventViewClosed.emit(true);
    }
}
