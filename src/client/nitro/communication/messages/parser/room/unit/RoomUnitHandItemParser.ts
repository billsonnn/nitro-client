import { IMessageDataWrapper } from '../../../../../../core/communication/messages/IMessageDataWrapper';
import { IMessageParser } from '../../../../../../core/communication/messages/IMessageParser';

export class RoomUnitHandItemParser implements IMessageParser
{
    private _unitId: number;
    private _handId: number;

    public flush(): boolean
    {
        this._unitId    = null;
        this._handId    = 0;

        return true;
    }
    
    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._unitId    = wrapper.readInt();
        this._handId    = wrapper.readInt();

        return true;
    }

    public get unitId(): number
    {
        return this._unitId;
    }

    public get handId(): number
    {
        return this._handId;
    }
}