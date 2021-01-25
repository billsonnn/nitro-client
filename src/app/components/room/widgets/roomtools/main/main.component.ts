import { AfterViewInit, Component, ComponentFactoryResolver, NgZone, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ConversionTrackingWidget } from '../../../../../../client/nitro/ui/widget/ConversionTrackingWidget';

@Component({
    selector: 'nitro-room-tools-component',
    templateUrl: './main.template.html'
})
export class RoomToolsMainComponent extends ConversionTrackingWidget implements OnInit, OnDestroy, AfterViewInit
{
    @ViewChild('componentContainer', { read: ViewContainerRef })
    public componentContainer: ViewContainerRef;

    private _open: boolean = false;

    public roomName: string = null;
    public roomOwner: string = null;

    constructor(
        private _componentFactoryResolver: ComponentFactoryResolver,
        private _ngZone: NgZone
    )
    {
        super();
    }

    ngOnDestroy(): void
    {

    }

    ngAfterViewInit(): void
    {

    }

    ngOnInit(): void
    {

    }

    public loadRoomData(roomId: number, roomName: string, roomOwner: string)
    {
        this._ngZone.run(() =>
        {
            this.roomName = roomName;
            this.roomOwner = roomOwner;
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
}
