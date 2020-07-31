import { IMessageDataWrapper } from '../../../../../core/communication/messages/IMessageDataWrapper';
import { IRoomObjectModel } from '../../../../../room/object/IRoomObjectModel';
import { RoomObjectVariable } from '../../RoomObjectVariable';
import { ObjectDataBase } from '../ObjectDataBase';
import { ObjectDataKey } from '../ObjectDataKey';

export class StringDataType extends ObjectDataBase
{
    public static FORMAT_KEY = ObjectDataKey.STRING_KEY;

    private static STATE: number = 0;
    
    private _data: string[];

    constructor()
    {
        super();

        this._data = [];
    }

    public parseWrapper(wrapper: IMessageDataWrapper): void
    {
        if(!wrapper) return;

        this._data = [];

        const totalStrings = wrapper.readInt();

        if(totalStrings) for(let i = 0; i < totalStrings; i++) this._data.push(wrapper.readString());

        super.parseWrapper(wrapper);
    }

    public initializeFromRoomObjectModel(model: IRoomObjectModel): void
    {
        super.initializeFromRoomObjectModel(model);

        this._data = model.getValue(RoomObjectVariable.FURNITURE_DATA);
    }

    public writeRoomObjectModel(model: IRoomObjectModel): void
    {
        super.writeRoomObjectModel(model);

        model.setValue(RoomObjectVariable.FURNITURE_DATA_FORMAT, StringDataType.FORMAT_KEY);
        model.setValue(RoomObjectVariable.FURNITURE_DATA, this._data);
    }

    public getLegacyString(): string
    {
        if(!this._data || !this._data.length) return '';

        return this._data[StringDataType.STATE];
    }

    public getValue(index: number): string
    {
        return this._data[index] || '';
    }
}