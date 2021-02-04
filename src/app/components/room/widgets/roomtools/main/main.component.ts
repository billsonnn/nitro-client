import { animate, style, transition, trigger } from '@angular/animations';
import { Component, ComponentFactoryResolver, NgZone, OnDestroy, ViewChild, ViewContainerRef } from '@angular/core';
import { RoomDataParser } from '../../../../../../client/nitro/communication/messages/parser/room/data/RoomDataParser';
import { ConversionTrackingWidget } from '../../../../../../client/nitro/ui/widget/ConversionTrackingWidget';
import { SettingsService } from '../../../../../core/settings/service';
import { NavigatorDataService } from '../../../../navigator/services/navigator-data.service';
import { NavigatorService } from '../../../../navigator/services/navigator.service';
import { RoomToolsWidgetHandler } from '../../handlers/RoomToolsWidgetHandler';
import { RoomWidgetZoomToggleMessage } from '../../messages/RoomWidgetZoomToggleMessage';

@Component({
    selector: 'nitro-room-tools-component',
    templateUrl: './main.template.html',
    animations: [
        trigger(
            'inOutAnimation',
            [
                transition(
                    ':enter',
                    [
                        style({ opacity: 0 }),
                        animate('.3s ease-out',
                            style({ opacity: 1 }))
                    ]
                ),
                transition(
                    ':leave',
                    [
                        style({ opacity: 1 }),
                        animate('.3s ease-in',
                            style({ opacity: 0 }))
                    ]
                )
            ]
        )
    ]
})
export class RoomToolsMainComponent extends ConversionTrackingWidget implements OnDestroy
{
    @ViewChild('componentContainer', { read: ViewContainerRef })
    public componentContainer: ViewContainerRef;

    private _lastRoomId: number = -1;
    private _roomData: RoomDataParser = null;

    private _roomOptionsVisible: boolean = false;
    private _roomNameVisible: boolean = false;
    private _roomToolsVisible: boolean = false;

    private _roomNameTimeout: ReturnType<typeof setTimeout> = null;

    constructor(
        private _componentFactoryResolver: ComponentFactoryResolver,
        private _ngZone: NgZone,
        private _navigatorDataService: NavigatorDataService,
        private _settingsService: SettingsService,
        private _navigatorService: NavigatorService
    )
    {
        super();

        this.toggleRoomTools = this.toggleRoomTools.bind(this);
    }

    public ngOnDestroy(): void
    {
        this.stopRoomNameTimeout();
    }

    public loadRoomData(roomData: RoomDataParser)
    {
        if(!roomData) return;

        this._ngZone.run(() =>
        {
            this._roomData = roomData;

            if(this._lastRoomId !== this._roomData.roomId)
            {
                this._lastRoomId = this._roomData.roomId;

                setTimeout(() => this.showRoomName(), 1);
            }
        });
    }

    public _Str_22970(data: RoomDataParser): void
    {
        const visitedRooms = this._navigatorDataService.getVisitedRooms();

        if(!visitedRooms) return;

        for(const visitedRoom of visitedRooms)
        {
            if(!visitedRoom) continue;

            if(visitedRoom.roomId === data.roomId) return;
        }

        this._navigatorDataService.addRoomToVisitedRooms(data);
    }

    public _Str_23696(k: number): void
    {
        this._navigatorDataService.setCurrentIndexToRoomId(k);
    }

    public likeRoom(): void
    {
        this.handler.rateRoom();
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

    public toggleChatHistory(): void
    {
        this._settingsService.toggleChatHistory();
    }

    public toggleZoom(): void
    {
        this.widgetHandler.processWidgetMessage(new RoomWidgetZoomToggleMessage());
    }

    public toggleRoomOptions(): void
    {
        this._roomOptionsVisible = !this._roomOptionsVisible;

        if(this._roomOptionsVisible) this.showRoomName();
    }

    public showRoomName(): void
    {
        this._roomNameVisible = true;

        this.stopRoomNameTimeout();

        this._roomNameTimeout = setTimeout(() =>
        {
            this.stopRoomNameTimeout();

            this._roomNameVisible = false;
        }, 5000);
    }

    private stopRoomNameTimeout(): void
    {
        if(!this._roomNameTimeout) return;

        clearTimeout(this._roomNameTimeout);

        this._roomNameTimeout = null;
    }

    public toggleRoomTools(): void
    {
        this._roomToolsVisible = !this._roomToolsVisible;
    }

    public get handler(): RoomToolsWidgetHandler
    {
        return (this.widgetHandler as RoomToolsWidgetHandler);
    }

    public get roomOptionsVisible(): boolean
    {
        return this._roomOptionsVisible;
    }

    public get roomNameVisible(): boolean
    {
        return this._roomNameVisible;
    }

    public get roomToolsVisible(): boolean
    {
        return this._roomToolsVisible;
    }

    public set roomToolsVisible(flag: boolean)
    {
        this._roomToolsVisible = flag;
    }

    public get roomData(): RoomDataParser
    {
        return this._roomData;
    }

    public get canRate(): boolean
    {
        return this._navigatorService.canRate;
    }
}
