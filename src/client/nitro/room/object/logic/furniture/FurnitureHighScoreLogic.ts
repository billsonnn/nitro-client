import { RoomObjectWidgetRequestEvent } from '../../../events/RoomObjectWidgetRequestEvent';
import { RoomObjectVariable } from '../../RoomObjectVariable';
import { FurnitureLogic } from './FurnitureLogic';

export class FurnitureHighScoreLogic extends FurnitureLogic
{
    public tearDown(): void
    {
        if(this.object.model.getValue(RoomObjectVariable.FURNITURE_REAL_ROOM_OBJECT) === 1)
        {
            this.eventDispatcher.dispatchEvent(new RoomObjectWidgetRequestEvent(RoomObjectWidgetRequestEvent.HIDE_HIGH_SCORE_DISPLAY, this.object));
        }
        
        super.tearDown();
    }
}