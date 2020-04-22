import { RoomSpriteMouseEvent } from '../../../../../room/events/RoomSpriteMouseEvent';
import { IRoomGeometry } from '../../../../../room/utils/IRoomGeometry';
import { MouseEventType } from '../../../../ui/MouseEventType';
import { RoomObjectFurnitureActionEvent } from '../../../events/RoomObjectFurnitureActionEvent';
import { RoomObjectLogicType } from '../../RoomObjectLogicType';
import { FurnitureLogic } from './FurnitureLogic';

export class FurnitureOneWayDoorLogic extends FurnitureLogic
{
    public static TYPE: string = RoomObjectLogicType.FURNITURE_ONE_WAY_DOOR;

    public getEventTypes(): string[]
    {
        const types = [ RoomObjectFurnitureActionEvent.ENTER_ONEWAYDOOR ];

        return this.mergeTypes(super.getEventTypes(), types);
    }

    public mouseEvent(event: RoomSpriteMouseEvent, geometry: IRoomGeometry): void
    {
        if(!event || !geometry || !this.object) return;

        switch(event.type)
        {
            case MouseEventType.DOUBLE_CLICK:
                this.useObject();

                return;
        }

        super.mouseEvent(event, geometry);
    }

    public useObject(): void
    {
        if(!this.object) return;

        if(this.eventDispatcher) this.eventDispatcher.dispatchEvent(new RoomObjectFurnitureActionEvent(RoomObjectFurnitureActionEvent.ENTER_ONEWAYDOOR, this.object));
    }
}