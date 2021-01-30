
import com.sulake.habbo.room.IStuffData;
import com.sulake.core.communication.messages.IMessageDataWrapper;
import com.sulake.habbo.room.object.RoomObjectVariableEnum;
import com.sulake.room.object.IRoomObjectModel;
import com.sulake.room.object.IRoomObjectModelController;
import adobe
import { IStuffData } from './IStuffData';
import { IMessageDataWrapper } from '../../../../core/communication/messages/IMessageDataWrapper';
import { IRoomObjectModel } from '../../../../room/object/IRoomObjectModel';
import { IRoomObjectModelController } from '../../../../room/object/IRoomObjectModelController';
import { RoomObjectVariable } from '../RoomObjectVariable';

.serialization.json.JSONDecoder;

public class StuffDataBase implements IStuffData
{
    private _flags: number;
    private _uniqueSerialNumber: number = 0;
    private _uniqueSeriesSize: number = 0;


    public set flags(k: number): void
    {
        this._flags = k;
    }

    public initializeFromIncomingMessage(packet: IMessageDataWrapper): void
    {
        if ((this._flags & StuffDataFlagsEnum._Str_17042) > 0)
        {
            this._uniqueSerialNumber = packet.readInt();
            this._uniqueSeriesSize = packet.readInt();
        }
    }

    public initializeFromRoomObjectModel(k: IRoomObjectModel): void
    {
        this._uniqueSerialNumber = k.getNumber(RoomObjectVariable.FURNITURE_UNIQUE_SERIAL_NUMBER);
        this._uniqueSeriesSize = k.getNumber(RoomObjectVariable.FURNITURE_UNIQUE_EDITION_SIZE);
    }

    public writeRoomObjectModel(k: IRoomObjectModelController):void
    {
        k.setNumber(RoomObjectVariable.FURNITURE_UNIQUE_SERIAL_NUMBER, this._uniqueSerialNumber);
        k.setNumber(RoomObjectVariable.FURNITURE_UNIQUE_EDITION_SIZE, this._uniqueSeriesSize);
    }

    public get uniqueSerialNumber(): number
    {
        return this._uniqueSerialNumber;
    }

    public get _Str_5330(): number
    {
        return this._uniqueSeriesSize;
    }

    public set uniqueSerialNumber(k: number): void
    {
        this._uniqueSerialNumber = k;
    }

    public set _Str_5330(k: number): void
    {
        this._uniqueSeriesSize = k;
    }

    public getLegacyString(): string
    {
        return '';
    }

    public compare(k: IStuffData): boolean
    {
        return false;
    }

    public get rarityLevel(): number
    {
        return -1;
    }

    public get state(): number
    {
        var k: number = Number(this.getLegacyString());
        return (isNaN(k)) ? -1 : k;
    }

    public getJSONValue(key: string): string
    {
        console.error('StuffDataBase.ts getJSONValue(key: string) not implemented!');
        return '';
        // let value: string;
        // try
        // {
        //     let jsonObj = JSON.parse(this.getLegacyString());
        //     return jsonObj.key
        //     value = new JsonDecoder(this.getLegacyString(), true).getValue()[key];
        //     return value;
        // }
        // catch(error: Error)
        // {
        //     return '';
        // }
    }
}
