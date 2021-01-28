import { IRoomWidgetHandler } from '../../../../../client/nitro/ui/IRoomWidgetHandler';
import { IRoomWidgetHandlerContainer } from '../../../../../client/nitro/ui/IRoomWidgetHandlerContainer';
import { RoomWidgetMessage } from '../../../../../client/nitro/ui/widget/messages/RoomWidgetMessage';
import { RoomWidgetUpdateEvent } from '../../../../../client/nitro/ui/widget/events/RoomWidgetUpdateEvent';
import { NitroEvent } from '../../../../../client/core/events/NitroEvent';
import { RoomEngineTriggerWidgetEvent } from '../../../../../client/nitro/room/events/RoomEngineTriggerWidgetEvent';
import { RoomWidgetEnum } from '../../../../../client/nitro/ui/widget/enums/RoomWidgetEnum';
import { RoomWidgetFurniToWidgetMessage } from '../messages/RoomWidgetFurniToWidgetMessage';
import { RoomObjectVariable } from '../../../../../client/nitro/room/object/RoomObjectVariable';
import { RoomWidgetTrophyUpdateEvent } from '../events/RoomWidgetTrophyUpdateEvent';


export class FurnitureTrophyWidgetHandler implements IRoomWidgetHandler
{
    private static INTERNALLINK: string = 'internalLink';

    private _container: IRoomWidgetHandlerContainer = null;

    public dispose(): void
    {
        this._container = null;
    }

    public processWidgetMessage(message: RoomWidgetMessage): RoomWidgetUpdateEvent
    {

        if(!message || !this._container) return;

        if(message.type != RoomWidgetFurniToWidgetMessage.REQUEST_TROPHY) return;

        const rwtwMessage = <RoomWidgetFurniToWidgetMessage>message;

        const trophy = this._container.roomEngine.getRoomObject(rwtwMessage.roomId, rwtwMessage.objectId, rwtwMessage.category);

        if(!trophy || !trophy.model) return;

        const model = trophy.model;

        const color = <string>model.getValue(RoomObjectVariable.FURNITURE_COLOR);
        let data = <string>model.getValue(RoomObjectVariable.FURNITURE_DATA);
        let _local_7 = <number>model.getValue(RoomObjectVariable.FURNITURE_EXTRAS);
        if(!_local_7)
        {
            _local_7 = 0;
        }
        const ownerName = data.substring(0, data.indexOf('\t'));
        data = data.substring((ownerName.length + 1), data.length);
        const trophyDate = data.substring(0, data.indexOf('\t'));
        const trophyText = data.substr(trophyDate.length + 1, data.length);

        this._container.events.dispatchEvent(new RoomWidgetTrophyUpdateEvent(RoomWidgetTrophyUpdateEvent.TROPHY_DATA, ownerName, trophyDate, trophyText, Number.parseInt(color), _local_7));
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
        return [ RoomWidgetFurniToWidgetMessage.REQUEST_TROPHY ];
    }

    public get eventTypes(): string[]
    {
        return [ RoomWidgetFurniToWidgetMessage.REQUEST_TROPHY ];
    }
}
