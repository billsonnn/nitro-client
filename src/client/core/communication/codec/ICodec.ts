import * as ByteBuffer from 'bytebuffer';
import { IConnection } from '../connections/IConnection';
import { IMessageDataWrapper } from '../messages/IMessageDataWrapper';

export interface ICodec
{
    encode(header: number, messages: any[]): ByteBuffer;
    decode(connection: IConnection): IMessageDataWrapper[];
}