import { IMessageParser } from '../../../../../../core/communication/messages/IMessageParser';
import { IMessageDataWrapper } from '../../../../../../core/communication/messages/IMessageDataWrapper';

export class RoomStackHeightParser implements IMessageParser
{
    private _heights: any[];

    public flush(): boolean
    {
        this._heights = [];

        return true;
    }
    
    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        const totalHeights = wrapper.readByte();

        if(!totalHeights) return true;

        for(let i = 0; i < totalHeights; i++)
        {
            const x = wrapper.readByte();
            const y = wrapper.readByte();

            let height = wrapper.readShort();

            if(height === 32767) height = -1;
            else height /= 256;

            this._heights.push({ x, y, height });
        }

        return true;
    }

    public get heights(): number[]
    {
        return this._heights;
    }
}