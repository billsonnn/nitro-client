import { RoomObjectUpdateMessage } from '../../../../../room/messages/RoomObjectUpdateMessage';
import { RoomObjectLogicBase } from '../../../../../room/object/logic/RoomObjectLogicBase';
import { ObjectTileCursorUpdateMessage } from '../../../messages/ObjectTileCursorUpdateMessage';

export class TileCursorLogic extends RoomObjectLogicBase
{
    private static CURSOR_VISIBLE_STATE: number = 0;
    private static CURSOR_HIDDEN_STATE: number  = 1;

    public processUpdateMessage(message: RoomObjectUpdateMessage): void
    {
        if(!(message instanceof ObjectTileCursorUpdateMessage)) return;

        if(!message.position)
        {
            this.object.setState(TileCursorLogic.CURSOR_HIDDEN_STATE);
            
            return;
        }
        
        this.object.setState(TileCursorLogic.CURSOR_VISIBLE_STATE);
        
        this.object.setPosition(message.position);
    }
}