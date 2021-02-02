import { RoomObjectUpdateMessage } from '../../../room/messages/RoomObjectUpdateMessage';

export class ObjectModelDataUpdateMessage extends RoomObjectUpdateMessage
{
    private _numberKey: string;
    private _numberValue:number;

    constructor(numberKey: string, numberValue: number)
    {
        super(null, null);

        this._numberKey = numberKey;
        this._numberValue = numberValue;
    }

}
