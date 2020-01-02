import { IMessageDataWrapper } from '../../../../../core/communication/messages/IMessageDataWrapper';
import { IMessageParser } from '../../../../../core/communication/messages/IMessageParser';

export class RoomRollingParser implements IMessageParser
{
    private _x: number;
    private _y: number;

    private _nextX: number;
    private _nextY: number;

    private _rollerId: number;

    private _itemsRolling: { itemId: number, height: number, nextHeight: number}[];
    private _unitRolling: { unitId: number, animationType: number, height: number, nextHeight: number};

    public flush(): boolean
    {
        this._x             = 0;
        this._y             = 0;

        this._nextX         = 0;
        this._nextY         = 0;

        this._rollerId      = 0;

        this._itemsRolling  = [];
        this._unitRolling   = null;

        return true;
    }
    
    public parse(wrapper: IMessageDataWrapper): boolean
    {
        this._x     = wrapper.readInt();
        this._y     = wrapper.readInt();

        this._nextX = wrapper.readInt();
        this._nextY = wrapper.readInt();

        let totalItems = wrapper.readInt();

        while(totalItems > 0)
        {
            this._itemsRolling.push({
                itemId: wrapper.readInt(),
                height: parseFloat(wrapper.readString()),
                nextHeight: parseFloat(wrapper.readString())
            });

            totalItems--;
        }

        this._rollerId = wrapper.readInt();

        if(wrapper.bytesAvailable)
        {
            this._unitRolling = {
                animationType: wrapper.readInt(),
                unitId: wrapper.readInt(),
                height: parseFloat(wrapper.readString()),
                nextHeight: parseFloat(wrapper.readString())
            };
        }

        return true;
    }

    public get x(): number
    {
        return this._x;
    }

    public get y(): number
    {
        return this._y;
    }

    public get nextX(): number
    {
        return this._nextX;
    }

    public get nextY(): number
    {
        return this._nextY;
    }

    public get rollerId(): number
    {
        return this._rollerId;
    }

    public get itemsRolling(): { itemId: number, height: number, nextHeight: number}[]
    {
        return this._itemsRolling;
    }

    public get unitRolling(): { unitId: number, animationType: number, height: number, nextHeight: number}
    {
        return this._unitRolling;
    }
}