import { RoomObjectUpdateMessage } from '../../../room/messages/RoomObjectUpdateMessage';

export class ObjectAdUpdateMessage extends RoomObjectUpdateMessage
{
    public static IMAGE_LOADED: string          = 'image_loaded';
    public static IMAGE_LOADING_FAILED: string  = 'image_loading_failed';
    
    private _type: string;

    constructor(type: string)
    {
        super(null);

        this._type = type;
    }

    public get type(): string
    {
        return this._type;
    }
}