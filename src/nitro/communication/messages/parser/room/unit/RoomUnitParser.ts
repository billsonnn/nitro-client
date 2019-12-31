import { IMessageDataWrapper } from '../../../../../../core/communication/messages/IMessageDataWrapper';
import { IMessageParser } from '../../../../../../core/communication/messages/IMessageParser';
import { RoomUnitDataParser } from './RoomUnitDataParser';

export class RoomUnitParser implements IMessageParser
{
    private _units: RoomUnitDataParser[];

    public flush(): boolean
    {
        this._units = [];

        return true;
    }
    
    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        let totalUnits = wrapper.readInt();

        while(totalUnits > 0)
        {
            const unit = new RoomUnitDataParser(wrapper);

            if(!unit) continue;

            this._units.push(unit);

            totalUnits--;
        }

        return true;
    }

    public get units(): RoomUnitDataParser[]
    {
        return this._units;
    }
}