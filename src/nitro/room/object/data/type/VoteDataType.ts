import { IMessageDataWrapper } from '../../../../../core/communication/messages/IMessageDataWrapper';
import { IRoomObjectModel } from '../../../../../room/object/IRoomObjectModel';
import { RoomObjectModelKey } from '../../RoomObjectModelKey';
import { ObjectDataBase } from '../ObjectDataBase';
import { ObjectDataKey } from '../ObjectDataKey';

export class VoteDataType extends ObjectDataBase
{
    public static FORMAT_KEY = ObjectDataKey.VOTE_KEY;

    private _state: string;
    private _result: number;

    constructor()
    {
        super();

        this._state     = '';
        this._result    = 0;
    }

    public parseWrapper(wrapper: IMessageDataWrapper): void
    {
        if(!wrapper) return;

        this._state     = wrapper.readString();
        this._result    = wrapper.readInt();

        super.parseWrapper(wrapper);
    }

    public writeRoomObjectModel(model: IRoomObjectModel): void
    {
        super.writeRoomObjectModel(model);

        model.setValue(RoomObjectModelKey.FURNITURE_DATA_FORMAT, VoteDataType.FORMAT_KEY);

        const data: { [index: string]: string } = {};

        data['S'] = this._state;
        data['R'] = this._result.toString();

        model.setValue(RoomObjectModelKey.FURNITURE_DATA, data);
    }

    public getLegacyString(): string
    {
        return this._state;
    }
    
    public setString(state: string)
    {
        this._state = state;
    }

    public get result(): number
    {
        return this._result;
    }
}