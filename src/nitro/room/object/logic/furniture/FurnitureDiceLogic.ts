import { RoomObjectMouseEvent } from '../../../../../room/events/RoomObjectMouseEvent';
import { RoomObjectSprite } from '../../../../../room/object/visualization/RoomObjectSprite';
import { RoomObjectFurnitureActionEvent } from '../../../events/RoomObjectFurnitureActionEvent';
import { ObjectLogicType } from '../ObjectLogicType';
import { FurnitureLogic } from './FurnitureLogic';

export class FurnitureDiceLogic extends FurnitureLogic
{
    public static TYPE: string = ObjectLogicType.FURNITURE_DICE;

    public mouseEvent(event: RoomObjectMouseEvent): void
    {
        if(event.collision instanceof RoomObjectSprite)
        {
            let action: RoomObjectFurnitureActionEvent = null;

            switch(event.type)
            {
                case RoomObjectMouseEvent.DOUBLE_CLICK:
                    if(event.collision.tag === 'activate' || this.object.state === 0 || this.object.state === 100)
                    {
                        action = new RoomObjectFurnitureActionEvent(RoomObjectFurnitureActionEvent.DICE_ACTIVATE, this.object);
                    }
                    
                    else if(event.collision.tag === 'deactivate')
                    {
                        action = new RoomObjectFurnitureActionEvent(RoomObjectFurnitureActionEvent.DICE_OFF, this.object);
                    }

                    if(action && this.eventHandler) this.eventHandler.handleRoomObjectEvent(action);

                    return;
            }
        }

        super.mouseEvent(event);
    }
}