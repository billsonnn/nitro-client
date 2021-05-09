import { NitroEvent } from 'nitro-renderer/src/core/events/NitroEvent';
import { RoomObjectVariable } from 'nitro-renderer/src/nitro/room/object/RoomObjectVariable';
import { IRoomWidgetHandler } from 'nitro-renderer/src/nitro/ui/IRoomWidgetHandler';
import { RoomWidgetEnum } from 'nitro-renderer/src/nitro/ui/widget/enums/RoomWidgetEnum';
import { RoomWidgetUpdateEvent } from 'nitro-renderer/src/nitro/ui/widget/events/RoomWidgetUpdateEvent';
import { RoomWidgetMessage } from 'nitro-renderer/src/nitro/ui/widget/messages/RoomWidgetMessage';
import { IRoomWidgetManager } from '../../IRoomWidgetManager';
import { RoomWidgetTrophyUpdateEvent } from '../events/RoomWidgetTrophyUpdateEvent';
import { RoomWidgetFurniToWidgetMessage } from '../messages/RoomWidgetFurniToWidgetMessage';

export class FurnitureTrophyWidgetHandler implements IRoomWidgetHandler
{
    private _container: IRoomWidgetManager = null;

    public dispose(): void
    {
        this._container = null;
    }

    public processWidgetMessage(message: RoomWidgetMessage): RoomWidgetUpdateEvent
    {
        if(!message || !this.container) return null;

        switch(message.type)
        {
            case RoomWidgetFurniToWidgetMessage.REQUEST_TROPHY: {
                const trophyMessage = (message as RoomWidgetFurniToWidgetMessage);

                const roomObject = this._container.roomEngine.getRoomObject(trophyMessage.roomId, trophyMessage.objectId, trophyMessage.category);

                if(roomObject)
                {
                    let data  = roomObject.model.getValue<string>(RoomObjectVariable.FURNITURE_DATA);
                    let extra = roomObject.model.getValue<string>(RoomObjectVariable.FURNITURE_EXTRAS);

                    if(!extra) extra = '0';

                    const color     = roomObject.model.getValue<string>(RoomObjectVariable.FURNITURE_COLOR);
                    const ownerName = data.substring(0, data.indexOf('\t'));

                    data = data.substring((ownerName.length + 1), data.length);

                    const trophyDate    = data.substring(0, data.indexOf('\t'));
                    const trophyText    = data.substr((trophyDate.length + 1), data.length);

                    this._container.events.dispatchEvent(new RoomWidgetTrophyUpdateEvent(RoomWidgetTrophyUpdateEvent.TROPHY_DATA, ownerName, trophyDate, trophyText, parseInt(color), parseInt(extra)));
                }

                break;
            }
        }

        return null;
    }

    public processEvent(event: NitroEvent): void
    {
        return;
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

    public get container(): IRoomWidgetManager
    {
        return this._container;
    }

    public set container(container: IRoomWidgetManager)
    {
        this._container = container;
    }

    public get messageTypes(): string[]
    {
        return [ RoomWidgetFurniToWidgetMessage.REQUEST_TROPHY ];
    }

    public get eventTypes(): string[]
    {
        return [ ];
    }
}
