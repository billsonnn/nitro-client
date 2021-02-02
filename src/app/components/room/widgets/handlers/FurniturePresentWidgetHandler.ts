import { NitroEvent } from '../../../../../client/core/events/NitroEvent';
import { Nitro } from '../../../../../client/nitro/Nitro';
import { RoomObjectCategory } from '../../../../../client/nitro/room/object/RoomObjectCategory';
import { RoomObjectVariable } from '../../../../../client/nitro/room/object/RoomObjectVariable';
import { IRoomWidgetHandler } from '../../../../../client/nitro/ui/IRoomWidgetHandler';
import { IRoomWidgetHandlerContainer } from '../../../../../client/nitro/ui/IRoomWidgetHandlerContainer';
import { RoomWidgetEnum } from '../../../../../client/nitro/ui/widget/enums/RoomWidgetEnum';
import { RoomWidgetUpdateEvent } from '../../../../../client/nitro/ui/widget/events/RoomWidgetUpdateEvent';
import { RoomWidgetMessage } from '../../../../../client/nitro/ui/widget/messages/RoomWidgetMessage';
import * as sorting from '../../../../../utils/sorting';
import { RoomObjectItem } from '../events/RoomObjectItem';
import { RoomWidgetChooserContentEvent } from '../events/RoomWidgetChooserContentEvent';
import { RoomWidgetRequestWidgetMessage } from '../messages/RoomWidgetRequestWidgetMessage';
import { RoomWidgetRoomObjectMessage } from '../messages/RoomWidgetRoomObjectMessage';
import { RoomWidgetFurniToWidgetMessage } from '../messages/RoomWidgetFurniToWidgetMessage';
import { RoomWidgetPresentOpenMessage } from '../messages/RoomWidgetPresentOpenMessage';

export class FurniturePresentWidgetHandler implements IRoomWidgetHandler
{
    private _isDisposed: boolean = false;
    private _container: IRoomWidgetHandlerContainer = null;

    private _objectId: number = null;

    public dispose(): void
    {
        this._isDisposed = true;
        this._container = null;
    }

    public processWidgetMessage(k: RoomWidgetMessage): RoomWidgetUpdateEvent
    {
        debugger;
        if(!k) return null;

        switch(k.type)
        {
            case RoomWidgetFurniToWidgetMessage.REQUEST_PRESENT: {
                const widgetMessage = <RoomWidgetFurniToWidgetMessage>k;
                if(!widgetMessage) return;

                const roomObject = this._container.roomEngine.getRoomObject(widgetMessage.roomId, widgetMessage.objectId, widgetMessage.category);
                if(!roomObject) return;

                const model = roomObject.model;
                if(!model) return;

                this._objectId = widgetMessage.objectId;

                let data = model.getValue(RoomObjectVariable.FURNITURE_DATA);
                if(!data) data = '';

                const purchaserName = model.getValue(RoomObjectVariable.FURNITURE_PURCHASER_NAME);
                const purchaserFigure = model.getValue(RoomObjectVariable.FURNITURE_PURCHASER_FIGURE);
                const typeId = model.getValue(RoomObjectVariable.FURNITURE_TYPE_ID);
                const extras = model.getValue(RoomObjectVariable.FURNITURE_EXTRAS);

                console.log({purchaserName, purchaserFigure, typeId, extras});

            }
            break;
        }

        return null;
    }

    public processEvent(event: NitroEvent): void
    {
        debugger;
    }

    public update(): void
    {
    }


    public get disposed(): boolean
    {
        return this._isDisposed;
    }

    public get type(): string
    {
        return RoomWidgetEnum.FURNI_PRESENT_WIDGET;
    }

    public set container(k: IRoomWidgetHandlerContainer)
    {
        this._container = k;
    }

    public get messageTypes(): string[]
    {
        return [
            RoomWidgetFurniToWidgetMessage.REQUEST_PRESENT,
            RoomWidgetPresentOpenMessage.RWPOM_OPEN_PRESENT
        ];
    }

    public get eventTypes(): string[]
    {
        return [];
    }
}
