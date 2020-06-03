import { IEventDispatcher } from '../../../../../core/events/IEventDispatcher';
import { INitroWindowManager } from '../../../../window/INitroWindowManager';
import { DesktopLayoutManager } from '../../../DesktopLayoutManager';
import { IRoomWidgetHandler } from '../../../IRoomWidgetHandler';
import { ConversionTrackingWidget } from '../../ConversionTrackingWidget';
import { RoomWidgetTrophyUpdateEvent } from '../../events/RoomWidgetTrophyUpdateEvent';
import { ITrophyFurniWidget } from './ITrophyFurniWidget';
import { ITrophyView } from './ITrophyView';
import { TrophyView } from './TrophyView';

export class TrophyFurniWidget extends ConversionTrackingWidget implements ITrophyFurniWidget
{
    public static VIEW_NIKO_SILVER: number  = 10;
    public static VIEW_NIKO_GOLD:number     = 20;

    private _name: string;
    private _date: string;
    private _message: string;
    private _color: number;
    
    private _view: ITrophyView;
    private _viewType: number;

    constructor(handler: IRoomWidgetHandler, windowManager: INitroWindowManager, layoutManager: DesktopLayoutManager)
    {
        super(handler, windowManager, layoutManager);
    }

    public dispose(): void
    {
        if(this._view)
        {
            this._view.dispose();

            this._view = null;
        }

        super.dispose();
    }

    public registerUpdateEvents(eventDispatcher: IEventDispatcher): void
    {
        if(!eventDispatcher) return;

        eventDispatcher.addEventListener(RoomWidgetTrophyUpdateEvent.TROPHY_DATA, this.onRoomWidgetTrophyUpdateEvent.bind(this));

        super.registerUpdateEvents(eventDispatcher);
    }

    public unregisterUpdateEvents(eventDispatcher: IEventDispatcher): void
    {
        if(!eventDispatcher) return;

        eventDispatcher.removeEventListener(RoomWidgetTrophyUpdateEvent.TROPHY_DATA, this.onRoomWidgetTrophyUpdateEvent.bind(this));
    }

    private onRoomWidgetTrophyUpdateEvent(event: RoomWidgetTrophyUpdateEvent): void
    {
        if(!event) return;

        this._name      = event.name;
        this._date      = event.date;
        this._message   = event.message;
        this._color     = event.color;
        this._viewType  = event.viewType;

        this.render();
    }

    private render(): void
    {
        if(this._view) this._view.dispose();

        switch(this._viewType)
        {
            case TrophyFurniWidget.VIEW_NIKO_GOLD:
            case TrophyFurniWidget.VIEW_NIKO_SILVER:
                this._view = null;
                break;
            default:
                this._view = new TrophyView(this);
                break;
        }

        this._view.render();
    }

    public get name(): string
    {
        return this._name;
    }

    public get date(): string
    {
        return this._date;
    }

    public get message(): string
    {
        return this._message;
    }

    public get color(): number
    {
        return this._color;
    }
}