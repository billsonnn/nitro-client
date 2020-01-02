import { RoomObjectMouseEvent } from '../../../../../room/events/RoomObjectMouseEvent';
import { RoomObjectSprite } from '../../../../../room/object/visualization/RoomObjectSprite';
import { ObjectLogicType } from '../ObjectLogicType';
import { FurnitureLogic } from './FurnitureLogic';

export class FurnitureMultiStateLogic extends FurnitureLogic
{
    public static TYPE: string = ObjectLogicType.FURNITURE_MULTISTATE;

    public mouseEvent(event: RoomObjectMouseEvent): void
    {
        if(event.collision instanceof RoomObjectSprite)
        {
            if(event.collision.ignoreMouse) return;

            switch(event.type)
            {
                case RoomObjectMouseEvent.MOUSE_MOVE:
                    document.body.style.cursor = 'pointer';
                    break;
            }
        }

        super.mouseEvent(event);
    }
}