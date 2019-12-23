import { IMessageDataWrapper } from '../../../../../core/communication/messages/IMessageDataWrapper';
import { IRoomObjectModel } from '../../../../../room/object/IRoomObjectModel';
import { RoomObjectModelKey } from '../../RoomObjectModelKey';
import { ObjectDataBase } from '../ObjectDataBase';
import { ObjectDataKey } from '../ObjectDataKey';

export class MapDataType extends ObjectDataBase
{
    public static FORMAT_KEY = ObjectDataKey.MAP_KEY;

    private static STATE: string    = 'state';
    private static RARITY: string   = 'rarity';

    private _data: { [index: string]: string };

    constructor()
    {
        super();

        this._data = {};
    }

    public parseWrapper(wrapper: IMessageDataWrapper): void
    {
        if(!wrapper) return;

        this._data = {};

        const totalSets = wrapper.readInt();

        if(totalSets) for(let i = 0; i < totalSets; i++) this._data[wrapper.readString()] = wrapper.readString();

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

        model.setValue(RoomObjectModelKey.FURNITURE_DATA_FORMAT, MapDataType.FORMAT_KEY);
        model.setValue(RoomObjectModelKey.FURNITURE_DATA, this._data);
    }

    public getLegacyString(): string
    {
        if(!this._data || !this._data.length) return '';

        const state = this._data[MapDataType.STATE];

        if(state === undefined || state === null) return '';

        return state;
    }

    public getValue(key: string): string
    {
        return this._data[key];
    }
}