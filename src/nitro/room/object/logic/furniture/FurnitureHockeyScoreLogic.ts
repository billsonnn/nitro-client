import { RoomObjectMouseEvent } from '../../../../../room/events/RoomObjectMouseEvent';
import { RoomObjectSprite } from '../../../../../room/object/visualization/RoomObjectSprite';
import { ObjectLogicType } from '../ObjectLogicType';
import { FurnitureLogic } from './FurnitureLogic';

export class FurnitureHockeyScoreLogic extends FurnitureLogic
{
    public static TYPE: string = ObjectLogicType.FURNITURE_HOCKEY_SCORE;

    public mouseEvent(event: RoomObjectMouseEvent): void
    {
        if(event.collision instanceof RoomObjectSprite)
        {
            switch(event.type)
            {
                case RoomObjectMouseEvent.DOUBLE_CLICK:
                    switch(event.collision.tag)
                    {
                        case 'off':
                            //Nitro.networkManager.processOutgoing(new ItemMultiStateComposer(this.object.id, 3));
                            return;
                    }
                    break;
                case RoomObjectMouseEvent.CLICK:
                    switch(event.collision.tag)
                    {
                        case 'inc':
                            //Nitro.networkManager.processOutgoing(new ItemMultiStateComposer(this.object.id, 2));
                            return;
                        case 'dec':
                            //Nitro.networkManager.processOutgoing(new ItemMultiStateComposer(this.object.id, 1));
                            return;
                    }
                    break;
            }
        }

        super.mouseEvent(event);
    }

    public useObject(): void
    {
        //Nitro.networkManager.processOutgoing(new ItemMultiStateComposer(this.object.id, 3));
    }
}