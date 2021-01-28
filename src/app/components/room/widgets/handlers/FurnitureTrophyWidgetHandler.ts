import { IRoomWidgetHandler } from '../../../../../client/nitro/ui/IRoomWidgetHandler';
import { IRoomWidgetHandlerContainer } from '../../../../../client/nitro/ui/IRoomWidgetHandlerContainer';
import { RoomWidgetMessage } from '../../../../../client/nitro/ui/widget/messages/RoomWidgetMessage';
import { RoomWidgetUpdateEvent } from '../../../../../client/nitro/ui/widget/events/RoomWidgetUpdateEvent';
import { NitroEvent } from '../../../../../client/core/events/NitroEvent';
import { RoomEngineTriggerWidgetEvent } from '../../../../../client/nitro/room/events/RoomEngineTriggerWidgetEvent';
import {RoomWidgetEnum} from '../../../../../client/nitro/ui/widget/enums/RoomWidgetEnum';


export class FurnitureTrophyWidgetHandler implements IRoomWidgetHandler
{
    private static INTERNALLINK: string = 'internalLink';

    private _container: IRoomWidgetHandlerContainer = null;

    public dispose(): void
    {
        this._container = null;
    }

    public processWidgetMessage(k: RoomWidgetMessage): RoomWidgetUpdateEvent
    {
        return null;
    }

    public processEvent(event: NitroEvent): void
    {
        if(!event) return;

        let widgetEvent: RoomEngineTriggerWidgetEvent = null;

        // switch(event.type)
        // {
        //     case RoomEngineTriggerWidgetEvent.REQUEST_TROPHY:
        //         widgetEvent = (event as RoomEngineTriggerWidgetEvent);
        //
        //         if(widgetEvent && this._container.roomEngine)
        //         {
        //             const roomObject = this._container.roomEngine.getRoomObject(widgetEvent.roomId, widgetEvent.objectId, widgetEvent.category);
        //
        //             if(roomObject && roomObject.model)
        //             {
        //                 let link = roomObject.model.getValue<{ [index: string]: string }>(RoomObjectVariable.FURNITURE_DATA)[FurnitureInternalLinkHandler.INTERNALLINK];
        //
        //                 if(!link || (link === '') || (link.length === 0))
        //                 {
        //                     link = roomObject.model.getValue<string>(RoomObjectVariable.FURNITURE_INTERNAL_LINK);
        //                 }
        //
        //                 if(!link || (link.length === 0)) return;
        //
        //                 Nitro.instance.createLinkEvent(link);
        //             }
        //         }
        //
        //         return;
        // }
    }

    public update(): void
    {
    }

    public get disposed(): boolean
    {
        return !!this._container;
    }

    public get type(): string
    {
        return RoomWidgetEnum.FURNI_TROPHY_WIDGET;
    }

    public get container(): IRoomWidgetHandlerContainer
    {
        return this._container;
    }

    public set container(container: IRoomWidgetHandlerContainer)
    {
        this._container = container;
    }

    public get messageTypes(): string[]
    {
        return [];
    }

    public get eventTypes(): string[]
    {
        return [ RoomEngineTriggerWidgetEvent.REQUEST_TROPHY ];
    }
}
