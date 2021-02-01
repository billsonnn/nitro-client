import { Component, ComponentFactoryResolver, NgZone, ViewChild, ViewContainerRef } from '@angular/core';
import { ConversionTrackingWidget } from '../../../../../../client/nitro/ui/widget/ConversionTrackingWidget';
import { RoomDataParser } from '../../../../../../client/nitro/communication/messages/parser/room/data/RoomDataParser';
import { RoomWidgetZoomToggleMessage } from '../../messages/RoomWidgetZoomToggleMessage';
import { NavigatorDataService } from '../../../../navigator/services/navigator-data.service';
import { NavigatorService } from '../../../../navigator/services/navigator.service';
import { FurnitureCreditWidgetHandler } from '../../handlers/FurnitureCreditWidgetHandler';
import { RoomToolsWidgetHandler } from '../../handlers/RoomToolsWidgetHandler';

@Component({
    selector: 'nitro-room-tools-component',
    templateUrl: './main.template.html'
})
export class RoomToolsMainComponent extends ConversionTrackingWidget
{
    @ViewChild('componentContainer', { read: ViewContainerRef })
    public componentContainer: ViewContainerRef;

    // Widget
    private _open: boolean = true;

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
        private _ngZone: NgZone,
        private _navigatorDataService: NavigatorDataService,
        private _navigatorService: NavigatorService
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

    public _Str_22970(data: RoomDataParser): void
    {
        const visitedRooms = this._navigatorDataService.getVisitedRooms();
        for(const visitedRoom of visitedRooms)
        {
            if(visitedRoom.roomId == data.roomId)
            {
                return;
            }
        }

        this._navigatorDataService.addRoomToVisitedRooms(data);

    }

    public _Str_23696(k: number): void
    {
        this._navigatorDataService.setCurrentIndexToRoomId(k);
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

    public get shareRoomViewVisible(): boolean
    {
        return true;
    }

    public toggleRoomShareVisible(): void
    {

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
        this.widgetHandler.processWidgetMessage(new RoomWidgetZoomToggleMessage());
    }

    public canGo(direction: string): boolean
    {
        switch(direction)
        {
            case 'back':
                return this._navigatorDataService.canGoBack();
            case 'forward':
                return this._navigatorDataService.canGoForward();
        }

        return false;
    }

    public goInDirection(direction: string): void
    {
        if(!this.canGo(direction)) return;

        let roomId: number = null;
        switch(direction)
        {
            case 'back': {
                roomId = this._navigatorDataService.getPreviousRoomId();
            }
                break;
            case 'forward': {
                roomId = this._navigatorDataService.getNextRoomId();
            }

                break;
        }

        if(!roomId) return;

        this._navigatorService.goToPrivateRoom(roomId);
    }

    public isLikeable(): boolean
    {
        return this._navigatorService.canRate;
    }

    public get handler(): RoomToolsWidgetHandler
    {
        return (this.widgetHandler as RoomToolsWidgetHandler);
    }

    public likeRoom(): void
    {
        this.handler.rateRoom();
    }
}
