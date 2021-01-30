import { IMessageDataWrapper } from '../../../../core/communication/messages/IMessageDataWrapper';
import { IRoomObjectModel } from '../../../../room/object/IRoomObjectModel';
import { IRoomObjectModelController } from '../../../../room/object/IRoomObjectModelController';

export interface IStuffData
{
    // Properties
    flags: number;
    uniqueSerialNumber: number;
    _Str_5330: number;
    rarityLevel: number;

    // Methods
    initializeFromIncomingMessage(_arg_1:IMessageDataWrapper): void;
    initializeFromRoomObjectModel(_arg_1:IRoomObjectModel): void;
    writeRoomObjectModel(_arg_1: IRoomObjectModelController): void;
    getLegacyString(): string;
    getJSONValue(_arg_1: string): string;
    compare(_arg_1: IStuffData): boolean;
}
