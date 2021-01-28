import { Component, ComponentFactoryResolver, NgZone, ViewChild, ViewContainerRef } from '@angular/core';
import { ConversionTrackingWidget } from '../../../../../../client/nitro/ui/widget/ConversionTrackingWidget';
import { RoomDataParser } from '../../../../../../client/nitro/communication/messages/parser/room/data/RoomDataParser';
import { RoomWidgetZoomToggleMessage } from '../../messages/RoomWidgetZoomToggleMessage';

@Component({
    selector: 'nitro-room-tools-component',
    templateUrl: './main.template.html'
})
export class RoomToolsMainComponent extends ConversionTrackingWidget
{
    @ViewChild('componentContainer', { read: ViewContainerRef })
    public componentContainer: ViewContainerRef;

    // Widget
    private _open: boolean = false;

    // Roomtools
    private _roomEventViewVisible: boolean = false;

    // Shared
    private _roomData: RoomDataParser;
    private _formattedRoomOwner: string;

    public roomName: string;
    public roomOwner: string;
    public ranking: number;
    public tags: string[] = [];

    constructor(
        private _componentFactoryResolver: ComponentFactoryResolver,
        private _ngZone: NgZone
    )
    {
        super();
    }

    public loadRoomData(roomData: RoomDataParser, formattedRoomOwner: string)
    {
        this._ngZone.run(() =>
        {
            this._formattedRoomOwner = formattedRoomOwner;
            this._roomData = roomData;
            this.roomName = roomData.roomName;
            this.ranking = roomData.ranking;
            this.tags = roomData.tags;
        });
    }

    public toggle(): void
    {
        this._open = !this._open;
    }

    public get open(): boolean
    {
        return this._open;
    }

    public toggleRoomEventView(): void
    {
        this._roomEventViewVisible = !this._roomEventViewVisible;
    }

    public get roomEventViewVisible(): boolean
    {
        return this._roomEventViewVisible;
    }

    public get roomData(): RoomDataParser
    {
        return this._roomData;
    }

    public get formattedRoomOwner(): string
    {
        return this._formattedRoomOwner;
    }

    public toggleZoom(): void
    {
        this.messageListener.processWidgetMessage(new RoomWidgetZoomToggleMessage());
    }
}
