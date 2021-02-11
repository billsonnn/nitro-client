import { Data, inflate } from 'pako';
import { BaseTexture } from 'pixi.js';
import { NitroLogger } from '../common/logger/NitroLogger';
import { BinaryReader } from '../communication/codec/BinaryReader';
import { IAssetData } from './interfaces';

export class NitroBundle
{
    private static TEXT_DECODER: TextDecoder = new TextDecoder('utf-8');

    private _jsonFile: Object = null;
    private _image: string = null;
    private _imageData: Uint8Array = null;
    private _baseTexture: BaseTexture = null;

    constructor(arrayBuffer: ArrayBuffer)
    {
        this.parse(arrayBuffer);
    }

    private static arrayBufferToBase64(buffer: ArrayBuffer): string
    {
        let binary = '';

        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for(let i = 0; i < len; i++)
        {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }

    public parse(arrayBuffer: ArrayBuffer): void
    {
        const binaryReader = new BinaryReader(arrayBuffer);

        let fileCount = binaryReader.readShort();

        while(fileCount > 0)
        {
            const fileNameLength    = binaryReader.readShort();
            const fileName          = binaryReader.readBytes(fileNameLength).toString();
            const fileLength        = binaryReader.readInt();
            const buffer            = binaryReader.readBytes(fileLength);

            if(fileName.endsWith('.json'))
            {
                const decompressed = inflate((buffer.toArrayBuffer() as Data));

                this._jsonFile = JSON.parse(NitroBundle.TEXT_DECODER.decode(decompressed));
            }
            else
            {
                const decompressed = inflate((buffer.toArrayBuffer() as Data));

                this._imageData = decompressed;

                this._image = NitroBundle.arrayBufferToBase64(this._imageData);

                if(fileName.includes('holo_dragon')) console.log('data:image/png;base64,' + this._image);

                this._imageData = null;
            }

            fileCount--;
        }

        //this.buildTexture();
    }

    private buildTexture(): void
    {
        if(!this._imageData) return;

        const json = (this._jsonFile as IAssetData);

        if(!json) return;

        const width = json.spritesheet.meta.size.w;
        const height = json.spritesheet.meta.size.h;

        try
        {
            //@ts-ignore
            const baseTexture = BaseTexture.fromBuffer(this._imageData, 1, 1);

            this._baseTexture = baseTexture;
        }
        catch (e)
        {
            NitroLogger.log(e);
        }

        this._imageData = null;
    }

    get jsonFile(): Object
    {
        return this._jsonFile;
    }

    get image(): string
    {
        return this._image;
    }

    public get baseTexture(): BaseTexture
    {
        return this._baseTexture;
    }
}
