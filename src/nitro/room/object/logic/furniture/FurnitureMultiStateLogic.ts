import { RoomObjectMouseEvent } from '../../../../../room/events/RoomObjectMouseEvent';
import { IRoomObjectSprite } from '../../../../../room/object/visualization/IRoomObjectSprite';
import { ObjectLogicType } from '../ObjectLogicType';
import { FurnitureLogic } from './FurnitureLogic';

export class FurnitureMultiStateLogic extends FurnitureLogic
{
    public static TYPE: string = ObjectLogicType.FURNITURE_MULTISTATE;

    public mouseEvent(event: RoomObjectMouseEvent): void
    {
        const collision = event.collision as IRoomObjectSprite;

        if(collision.ignoreMouse) return;

        switch(event.type)
        {
            case RoomObjectMouseEvent.MOUSE_MOVE:
                document.body.style.cursor = 'pointer';
                break;
        }

        super.mouseEvent(event);
    }

    public useObject(): void
    {
        //Nitro.networkManager.processOutgoing(new ItemMultiStateComposer(this.object.id));
    }
}