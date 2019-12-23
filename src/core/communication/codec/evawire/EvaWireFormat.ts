import * as ByteBuffer from 'bytebuffer';
import { IMessageDataWrapper } from '../../messages/IMessageDataWrapper';
import { Byte } from '../Byte';
import { ICodec } from '../ICodec';
import { Short } from '../Short';
import { EvaWireDataWrapper } from './EvaWireDataWrapper';

export class EvaWireFormat implements ICodec
{
    public encode(header: number, messages: any[]): ByteBuffer
    {
        const buffer = new ByteBuffer();

        buffer.writeInt(0).writeShort(header);

        for(let value of messages)
        {
            let type: string = typeof value;

            if(type === 'object')
            {
                if(value === null)              type = 'null';
                else if(value instanceof Byte)  type = 'byte';
                else if(value instanceof Short) type = 'short';
            }

            switch(type)
            {
                case 'null':
                    buffer.writeShort(0);
                    break;
                case 'byte':
                    buffer.writeByte(value.value);
                    break;
                case 'short':
                    buffer.writeShort(value.value);
                    break;
                case 'number':
                    buffer.writeInt(value);
                    break;
                case 'boolean':
                    buffer.writeByte(value ? 1 : 0);
                    break;
                case 'string':
                    if(!value) buffer.writeShort(0);
                    else buffer.writeShort(value.length).writeString(value);
                    break;
            }
        }

        buffer.writeInt(buffer.offset - 4, 0);

        return buffer.slice(0, buffer.offset);
    }

    public decode(buffer: ByteBuffer): IMessageDataWrapper[]
    {
        if(!buffer) return null;

        const dataWrapper: IMessageDataWrapper[] = [];

        while(true)
        {
            if(buffer.remaining() < 6) return dataWrapper;

            const length = buffer.readInt();

            if(length < 2) return dataWrapper;

            if(buffer.remaining() < length)
            {
                buffer.offset -= 4;

                return dataWrapper;
            }

            const extracted = buffer.readBytes(length);

            dataWrapper.push(new EvaWireDataWrapper(extracted.readShort(), extracted));
        }
    }
}