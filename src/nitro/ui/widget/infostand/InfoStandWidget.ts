import { IEventDispatcher } from '../../../../core/events/IEventDispatcher';
import { INitroWindowManager } from '../../../window/INitroWindowManager';
import { DesktopLayoutManager } from '../../DesktopLayoutManager';
import { InfoStandWidgetHandler } from '../../handler/InfoStandWidgetHandler';
import { IRoomWidgetHandler } from '../../IRoomWidgetHandler';
import { ConversionTrackingWidget } from '../ConversionTrackingWidget';
import { RoomWidgetRoomObjectUpdateEvent } from '../events/RoomWidgetRoomObjectUpdateEvent';
import { RoomWidgetRoomObjectMessage } from '../messages/RoomWidgetRoomObjectMessage';

export class InfoStandWidget extends ConversionTrackingWidget
{
    private _mainContainer: HTMLElement;

    constructor(widgetHandler: IRoomWidgetHandler, windowManager: INitroWindowManager, layoutManager: DesktopLayoutManager)
    {
        super(widgetHandler, windowManager, layoutManager);

        const view = {
        };

        this._mainContainer = this.windowManager.renderElement(this.getTemplate(), view);

        this._mainContainer.style.visibility = 'hidden';

        this.handler.widget = this;
    }

    public dispose(): void
    {
        if(this.disposed) return;
        
        super.dispose();
    }

    public registerUpdateEvents(eventDispatcher: IEventDispatcher): void
    {
        if(!eventDispatcher) return;

        eventDispatcher.addEventListener(RoomWidgetRoomObjectUpdateEvent.OBJECT_SELECTED, this.objectSelectedHandler.bind(this));
        eventDispatcher.addEventListener(RoomWidgetRoomObjectUpdateEvent.OBJECT_DESELECTED, this.objectDeselectedHandler.bind(this));
        
        super.registerUpdateEvents(eventDispatcher);
    }

    public unregisterUpdateEvents(eventDispatcher: IEventDispatcher): void
    {
        if(!eventDispatcher) return;

        eventDispatcher.removeEventListener(RoomWidgetRoomObjectUpdateEvent.OBJECT_SELECTED, this.objectSelectedHandler.bind(this));
        eventDispatcher.removeEventListener(RoomWidgetRoomObjectUpdateEvent.OBJECT_DESELECTED, this.objectDeselectedHandler.bind(this));

        super.unregisterUpdateEvents(eventDispatcher);
    }

    private objectSelectedHandler(k: RoomWidgetRoomObjectUpdateEvent): void
    {
        this.messageListener.processWidgetMessage(new RoomWidgetRoomObjectMessage(RoomWidgetRoomObjectMessage.GET_OBJECT_INFO, k.id, k.category));
    }

    private objectDeselectedHandler(k: RoomWidgetRoomObjectUpdateEvent): void
    {
        // this.close();

        // if (this._updateTimer)
        // {
        //     this._updateTimer.stop();
        // }
    }

    private getTemplate(): string
    {
        return `
        <div class="nitro-widget-infostand">
            INFOSTAND!!
        </div>`;
    }

    public get handler(): InfoStandWidgetHandler
    {
        return (this.widgetHandler as InfoStandWidgetHandler);
    }

    public get mainWindow(): HTMLElement
    {
        return this._mainContainer;
    }
}