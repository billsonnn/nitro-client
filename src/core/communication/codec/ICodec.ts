import * as ByteBuffer from 'bytebuffer';
import { IMessageDataWrapper } from '../messages/IMessageDataWrapper';

export interface ICodec
{
    encode(header: number, messages: any[]): ByteBuffer;
    decode(buffer: ByteBuffer): IMessageDataWrapper[];
}