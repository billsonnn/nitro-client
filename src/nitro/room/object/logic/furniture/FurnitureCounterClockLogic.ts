import { RoomObjectMouseEvent } from '../../../../../room/events/RoomObjectMouseEvent';
import { IRoomObjectSprite } from '../../../../../room/object/visualization/IRoomObjectSprite';
import { ObjectLogicType } from '../ObjectLogicType';
import { FurnitureLogic } from './FurnitureLogic';

export class FurnitureCounterClockLogic extends FurnitureLogic
{
    public static TYPE: string = ObjectLogicType.FURNITURE_COUNTER_CLOCK;

    public mouseEvent(event: RoomObjectMouseEvent): void
    {
        const collision = event.collision as IRoomObjectSprite;

        switch(event.type)
        {
            case RoomObjectMouseEvent.DOUBLE_CLICK:
                switch(collision.tag)
                {
                    //case 'start_stop': return Nitro.networkManager.processOutgoing(new ItemMultiStateComposer(this.object.id, 1));
                    //case 'reset': return Nitro.networkManager.processOutgoing(new ItemMultiStateComposer(this.object.id, 2));
                }
                break;
        }

        super.mouseEvent(event);
    }

    public useObject(): void
    {
        //return Nitro.networkManager.processOutgoing(new ItemMultiStateComposer(this.object.id, 1));
    }
}