import { RoomObjectUpdateMessage } from '../../../room/messages/RoomObjectUpdateMessage';

export class ObjectUpdateStateMessage extends RoomObjectUpdateMessage
{
    constructor()
    {
        super(null);
    }
}