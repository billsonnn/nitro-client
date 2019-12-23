import { RoomObjectMouseEvent } from '../../../../../room/events/RoomObjectMouseEvent';
import { IRoomObjectSprite } from '../../../../../room/object/visualization/IRoomObjectSprite';
import { ObjectLogicType } from '../ObjectLogicType';
import { FurnitureLogic } from './FurnitureLogic';

export class FurnitureDiceLogic extends FurnitureLogic
{
    public static TYPE: string = ObjectLogicType.FURNITURE_DICE;

    public mouseEvent(event: RoomObjectMouseEvent): void
    {
        const collision = event.collision as IRoomObjectSprite;

        switch(event.type)
        {
            case RoomObjectMouseEvent.DOUBLE_CLICK:
                //if(collision.tag === 'activate' || this.object.state === 0 || this.object.state === 100) return Nitro.networkManager.processOutgoing(new ItemDiceActivateComposer(this.object.id));

                //else if(collision.tag === 'deactivate') return Nitro.networkManager.processOutgoing(new ItemDiceDeactivateComposer(this.object.id));

                return;
        }

        super.mouseEvent(event);
    }
}