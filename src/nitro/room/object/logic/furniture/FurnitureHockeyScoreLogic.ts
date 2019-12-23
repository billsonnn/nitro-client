import { RoomObjectMouseEvent } from '../../../../../room/events/RoomObjectMouseEvent';
import { IRoomObjectSprite } from '../../../../../room/object/visualization/IRoomObjectSprite';
import { ObjectLogicType } from '../ObjectLogicType';
import { FurnitureLogic } from './FurnitureLogic';

export class FurnitureHockeyScoreLogic extends FurnitureLogic
{
    public static TYPE: string = ObjectLogicType.FURNITURE_HOCKEY_SCORE;

    public mouseEvent(event: RoomObjectMouseEvent): void
    {
        const collision = event.collision as IRoomObjectSprite;

        switch(event.type)
        {
            case RoomObjectMouseEvent.DOUBLE_CLICK:
                switch(collision.tag)
                {
                    //case 'off': return Nitro.networkManager.processOutgoing(new ItemMultiStateComposer(this.object.id, 3));
                }
                break;
            case RoomObjectMouseEvent.CLICK:
                switch(collision.tag)
                {
                    //case 'inc': return Nitro.networkManager.processOutgoing(new ItemMultiStateComposer(this.object.id, 2));
                    //case 'dec': return Nitro.networkManager.processOutgoing(new ItemMultiStateComposer(this.object.id, 1));
                }
                break;
        }

        super.mouseEvent(event);
    }

    public useObject(): void
    {
        //Nitro.networkManager.processOutgoing(new ItemMultiStateComposer(this.object.id, 3));
    }
}