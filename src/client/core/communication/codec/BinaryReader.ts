import { Buffer } from 'buffer';

export class BinaryReader
{
    private _position: number;
    private _buffer: Buffer;

    constructor(buffer: ArrayBuffer|Buffer)
    {
        this._position = 0;
        this._buffer = Buffer.from(buffer);
    }

    public readByte(): number
    {
        return this._buffer[this._position++];
    }

    public readBytes(length: number): BinaryReader
    {
        let buffer: BinaryReader = new BinaryReader(this._buffer.slice(this._position, this._position + length));
        this._position += length;

        return buffer;
    }

    public readShort(): number
    {
        let short = this._buffer.readInt16BE(this._position);
        this._position += 2;

        return short;
    }

    public readInt(): number
    {
        let int = this._buffer.readInt32BE(this._position);
        this._position += 4;

        return int;
    }

    public remaining(): number
    {
        return this._buffer.length - this._position;
    }

    public toString(encoding?: string)
    {
        return encoding ? this._buffer.toString(encoding) : this._buffer.toString();
    }
}