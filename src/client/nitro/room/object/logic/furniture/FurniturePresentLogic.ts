import { FurnitureLogic } from './FurnitureLogic';
import { RoomObjectWidgetRequestEvent } from '../../../events/RoomObjectWidgetRequestEvent';
import { IAssetData } from '../../../../../core/asset/interfaces';
import { RoomSpriteMouseEvent } from '../../../../../room/events/RoomSpriteMouseEvent';
import { IRoomGeometry } from '../../../../../room/utils/IRoomGeometry';
import { MouseEventType } from '../../../../ui/MouseEventType';
import { RoomObjectUpdateMessage } from '../../../../../room/messages/RoomObjectUpdateMessage';
import { RoomObjectFurnitureActionEvent } from '../../../events/RoomObjectFurnitureActionEvent';
import {ObjectDataUpdateMessage} from "../../../messages/ObjectDataUpdateMessage";
import {ObjectItemDataUpdateMessage} from "../../../messages/ObjectItemDataUpdateMessage";

export class FurniturePresentLogic extends FurnitureLogic
{
    public getEventTypes(): string[]
    {
        const types = [
            RoomObjectWidgetRequestEvent.PRESENT
        ];

        return this.mergeTypes(super.getEventTypes(), types);
    }

    public initialize(asset: IAssetData): void
    {
        super.initialize(asset);

    }

    public processUpdateMessage(message: RoomObjectUpdateMessage): void
    {
        super.processUpdateMessage(message);

        const dataUpdate = <ObjectDataUpdateMessage>message;

        if(dataUpdate && dataUpdate.data)
        {
            dataUpdate.data.writeRoomObjectModel(this.object.model);
        }

        const modelUpdate =<ObjectItemDataUpdateMessage>message;

    }

    public mouseEvent(event: RoomSpriteMouseEvent, geometry: IRoomGeometry): void
    {
        if(!event || !geometry || !this.object) return;

        switch(event.type)
        {
            case MouseEventType.ROLL_OVER:
                this.eventDispatcher.dispatchEvent(new RoomObjectFurnitureActionEvent(RoomObjectFurnitureActionEvent.MOUSE_BUTTON, this.object));
                break;
            case MouseEventType.ROLL_OUT:
                this.eventDispatcher.dispatchEvent(new RoomObjectFurnitureActionEvent(RoomObjectFurnitureActionEvent.MOUSE_ARROW, this.object));
                break;
            case MouseEventType.DOUBLE_CLICK:
                this.useObject();
                return;
            default:
                super.mouseEvent(event, geometry);
        }
    }

    public useObject(): void
    {
        (this.object && this.eventDispatcher && this.eventDispatcher.dispatchEvent(new RoomObjectWidgetRequestEvent(RoomObjectWidgetRequestEvent.PRESENT, this.object)));
    }
}
