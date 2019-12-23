import { IMessageDataWrapper } from '../../../../../core/communication/messages/IMessageDataWrapper';
import { IRoomObjectModel } from '../../../../../room/object/IRoomObjectModel';
import { RoomObjectModelKey } from '../../RoomObjectModelKey';
import { IObjectData } from '../IObjectData';
import { ObjectDataBase } from '../ObjectDataBase';
import { ObjectDataKey } from '../ObjectDataKey';

export class LegacyDataType extends ObjectDataBase implements IObjectData
{
    public static FORMAT_KEY = ObjectDataKey.LEGACY_KEY;
    
    private _data: string;

    constructor()
    {
        super();

        this._data = '';
    }

    public parseWrapper(wrapper: IMessageDataWrapper): void
    {
        if(!wrapper) return;

        this._data = wrapper.readString();

        super.parseWrapper(wrapper);
    }

    public initializeFromRoomObjectModel(model: IRoomObjectModel): void
    {
        super.initializeFromRoomObjectModel(model);

        this._data = model.getValue(RoomObjectModelKey.FURNITURE_DATA);
    }

    public writeRoomObjectModel(model: IRoomObjectModel): void
    {
        super.writeRoomObjectModel(model);

        model.setValue(RoomObjectModelKey.FURNITURE_DATA_FORMAT, LegacyDataType.FORMAT_KEY);
        model.setValue(RoomObjectModelKey.FURNITURE_DATA, this._data);
    }

    public getLegacyString(): string
    {
        return this._data;
    }

    public setString(data: string): void
    {
        this._data = data;
    }
}