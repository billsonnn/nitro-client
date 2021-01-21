import { Buffer } from 'buffer';

export class BinaryWriter
{
    private _buffer: Buffer;

    constructor()
    {
        this._buffer = Buffer.alloc(0);
    }

    public writeByte(byte: number): BinaryWriter
    {
        let buffer = Buffer.alloc(1);
        buffer[0] = byte;

        this._buffer = Buffer.concat([this._buffer, buffer]);
        return this;
    }

    public writeBytes(bytes: ArrayBuffer | Buffer): BinaryWriter
    {
        let buffer: Buffer = Buffer.from(bytes);

        this._buffer = Buffer.concat([this._buffer, buffer]);
        return this;
    }

    public writeShort(short: number): BinaryWriter
    {
        let buffer = Buffer.alloc(2);
        buffer.writeInt16BE(short, 0);

        this._buffer = Buffer.concat([this._buffer, buffer]);
        return this;
    }

    public writeInt(integer: number): BinaryWriter
    {
        let buffer = Buffer.alloc(4);
        buffer.writeInt32BE(integer, 0);

        this._buffer = Buffer.concat([this._buffer, buffer]);
        return this;
    }

    public writeString(string: string, includeLength?: boolean): BinaryWriter
    {
        let stringBuffer: Buffer = Buffer.from(string, 'utf8');

        if (includeLength) {
            let lengthBuffer: Buffer = Buffer.alloc(2);
            lengthBuffer.writeInt16BE(stringBuffer.length, 0);

            this._buffer = Buffer.concat([this._buffer, lengthBuffer, stringBuffer]);
        } else {
            this._buffer = Buffer.concat([this._buffer, stringBuffer]);
        }

        return this;
    }

    public getBuffer(): Buffer {
        return this._buffer;
    }

    public toString(encoding?: string)
    {
        return encoding ? this._buffer.toString(encoding) : this._buffer.toString();
    }
}