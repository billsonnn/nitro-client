import { IEventDispatcher } from '../../../../core/events/IEventDispatcher';
import { INitroWindowManager } from '../../../window/INitroWindowManager';
import { DesktopLayoutManager } from '../../DesktopLayoutManager';
import { IRoomWidgetHandler } from '../../IRoomWidgetHandler';
import { ConversionTrackingWidget } from '../ConversionTrackingWidget';
import { RoomWidgetRoomViewUpdateEvent } from '../events/RoomWidgetRoomViewUpdateEvent';

export class RoomChatWidget extends ConversionTrackingWidget
{
    constructor(handler: IRoomWidgetHandler, windowManager: INitroWindowManager, layoutManager: DesktopLayoutManager)
    {
        super(handler, windowManager, layoutManager);
    }

    public dispose(): void
    {
        super.dispose();
    }

    public registerUpdateEvents(eventDispatcher: IEventDispatcher): void
    {
        if(!eventDispatcher) return;

        eventDispatcher.addEventListener(RoomWidgetRoomViewUpdateEvent.SIZE_CHANGED, this.onRoomWidgetRoomViewUpdateEvent.bind(this));
        eventDispatcher.addEventListener(RoomWidgetRoomViewUpdateEvent.POSITION_CHANGED, this.onRoomWidgetRoomViewUpdateEvent.bind(this));
        eventDispatcher.addEventListener(RoomWidgetRoomViewUpdateEvent.SCALE_CHANGED, this.onRoomWidgetRoomViewUpdateEvent.bind(this));

        super.registerUpdateEvents(eventDispatcher);
    }

    public unregisterUpdateEvents(eventDispatcher: IEventDispatcher): void
    {
        if(!eventDispatcher) return;

        eventDispatcher.removeEventListener(RoomWidgetRoomViewUpdateEvent.SIZE_CHANGED, this.onRoomWidgetRoomViewUpdateEvent.bind(this));
        eventDispatcher.removeEventListener(RoomWidgetRoomViewUpdateEvent.POSITION_CHANGED, this.onRoomWidgetRoomViewUpdateEvent.bind(this));
        eventDispatcher.removeEventListener(RoomWidgetRoomViewUpdateEvent.SCALE_CHANGED, this.onRoomWidgetRoomViewUpdateEvent.bind(this));
    }

    private onRoomWidgetRoomViewUpdateEvent(event: RoomWidgetRoomViewUpdateEvent): void
    {
        switch(event.type)
        {
            case RoomWidgetRoomViewUpdateEvent.SIZE_CHANGED:
                return;
            case RoomWidgetRoomViewUpdateEvent.POSITION_CHANGED:
                return;
            case RoomWidgetRoomViewUpdateEvent.SCALE_CHANGED:
                return;
        }
    }

    public get mainWindow(): HTMLElement
    {
        return null;
    }
}