import { Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { HighScoreDataType } from '../../../../../../client/nitro/room/object/data/type/HighScoreDataType';
import { ConversionTrackingWidget } from '../../../../../../client/nitro/ui/widget/ConversionTrackingWidget';
import { FurnitureHighScoreWidgetHandler } from '../../handlers/FurnitureHighScoreWidgetHandler';

@Component({
    selector: 'nitro-room-furniture-highscore-component',
    templateUrl: './highscore.template.html'
})
export class HighscoreComponent extends ConversionTrackingWidget
{
    @ViewChild('activeView')
    public view: ElementRef<HTMLDivElement> = null;

    private _visible: boolean   = false;
    private _objectId: number   = -1;
    private _roomId: number     = -1;

    public topValue: number = 0;
    public leftValue: number = 0;

    constructor(
        private _ngZone: NgZone)
    {
        super();
    }

    public open(objectId: number, roomId: number, stuffData: HighScoreDataType): void
    {
        this._ngZone.run(() =>
        {
            this._objectId  = objectId;
            this._roomId    = roomId;
            this._visible   = true;
        });
    }

    public updatePoint(x: number, y: number): void
    {
        if(!this._visible) return;

        this._ngZone.run(() =>
        {
            const element = ((this.view && this.view.nativeElement) || null);

            if(!element) return;

            this.leftValue = (x - (element.offsetWidth / 2));
            this.topValue = (y - (element.offsetHeight + 60));
        });
    }

    public hide(): void
    {
        this._ngZone.run(() =>
        {
            this._visible   = false;
            this._objectId  = -1;
            this._roomId    = -1;
        });
    }

    public get handler(): FurnitureHighScoreWidgetHandler
    {
        return (this.widgetHandler as FurnitureHighScoreWidgetHandler);
    }

    public get visible(): boolean
    {
        return this._visible;
    }

    public set visible(flag: boolean)
    {
        this._visible = flag;
    }

    public get objectId(): number
    {
        return this._objectId;
    }

    public get roomId(): number
    {
        return this._roomId;
    }
}
