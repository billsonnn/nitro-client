export class BinaryWriter
{
    private _buffer: Uint8Array;

    constructor()
    {
        this._buffer = new Uint8Array();
    }

    public writeByte(byte: number): BinaryWriter
    {
        let buffer = new Uint8Array(1);
        buffer[0] = byte;

        this.appendArray(buffer);
        return this;
    }

    public writeBytes(bytes: ArrayBuffer): BinaryWriter
    {
        let buffer = new Uint8Array(bytes);

        this.appendArray(buffer);
        return this;
    }

    public writeShort(short: number): BinaryWriter
    {
        let buffer = new Uint8Array(2);
        buffer[0] = short >> 8;
        buffer[1] = short & 0xFF;

        this.appendArray(buffer);
        return this;
    }

    public writeInt(integer: number): BinaryWriter
    {
        let buffer = new Uint8Array(4);
        buffer[0] = integer >> 24;
        buffer[1] = integer >> 16;
        buffer[2] = integer >> 8;
        buffer[3] = integer & 0xFF;

        this.appendArray(buffer);
        return this;
    }

    public writeString(string: string, includeLength?: boolean): BinaryWriter
    {
        let stringBuffer = new TextEncoder().encode(string);

        if (includeLength) {
            this.writeShort(stringBuffer.length);
            this.appendArray(stringBuffer);
        } else {
            this.appendArray(stringBuffer);
        }

        return this;
    }

    public getBuffer(): ArrayBuffer {
        return this._buffer.buffer;
    }

    public toString(encoding?: string)
    {
        return new TextDecoder(encoding).decode(this._buffer);
    }

    private appendArray(array: Uint8Array) {
        let combinedArray = new Uint8Array(this._buffer.length + array.length);
        combinedArray.set(this._buffer);
        combinedArray.set(array, this._buffer.length);

        this._buffer = combinedArray;
    }
}