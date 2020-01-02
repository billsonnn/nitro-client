import { RoomObjectMouseEvent } from '../../../../../room/events/RoomObjectMouseEvent';
import { RoomObjectSprite } from '../../../../../room/object/visualization/RoomObjectSprite';
import { ObjectLogicType } from '../ObjectLogicType';
import { FurnitureLogic } from './FurnitureLogic';

export class FurnitureCounterClockLogic extends FurnitureLogic
{
    public static TYPE: string = ObjectLogicType.FURNITURE_COUNTER_CLOCK;

    public mouseEvent(event: RoomObjectMouseEvent): void
    {
        if(event.collision instanceof RoomObjectSprite)
        {
            if(event.collision.ignoreMouse) return;

             switch(event.type)
            {
                case RoomObjectMouseEvent.DOUBLE_CLICK:
                    switch(event.collision.tag)
                    {
                        case 'start_stop':
                            //Nitro.networkManager.processOutgoing(new ItemMultiStateComposer(this.object.id, 1));
                            return;
                        case 'reset':
                            //Nitro.networkManager.processOutgoing(new ItemMultiStateComposer(this.object.id, 2));
                            return;
                    }
                    break;
            }
        }

        super.mouseEvent(event);
    }

    public useObject(): void
    {
        //return Nitro.networkManager.processOutgoing(new ItemMultiStateComposer(this.object.id, 1));
    }
}