import { IMessageDataWrapper } from '../../../../../core/communication/messages/IMessageDataWrapper';
import { IMessageParser } from '../../../../../core/communication/messages/IMessageParser';
import { Position } from '../../../../../room/utils/Position';
import { ObjectRolling } from '../../../../room/utils/ObjectRolling';

export class RoomRollingParser implements IMessageParser
{
    private _rollerId: number;
    private _itemsRolling: ObjectRolling[];
    private _unitRolling: ObjectRolling;

    public flush(): boolean
    {
        this._rollerId      = 0;

        this._itemsRolling  = [];
        this._unitRolling   = null;

        return true;
    }
    
    public parse(wrapper: IMessageDataWrapper): boolean
    {
        const x     = wrapper.readInt();
        const y     = wrapper.readInt();
        const nextX = wrapper.readInt();
        const nextY = wrapper.readInt();

        let totalItems = wrapper.readInt();

        while(totalItems > 0)
        {
            const id            = wrapper.readInt();
            const height        = parseFloat(wrapper.readString());
            const nextHeight    = parseFloat(wrapper.readString());
            const fromPosition  = new Position(x, y, height);
            const toPosition    = new Position(nextX, nextY, nextHeight);

            const rollingData = new ObjectRolling(id, fromPosition, toPosition);

            this._itemsRolling.push(rollingData);

            totalItems--;
        }

        this._rollerId = wrapper.readInt();

        if(!wrapper.bytesAvailable) return true;

        const movementType  = wrapper.readInt();
        const unitId        = wrapper.readInt();
        const height        = parseFloat(wrapper.readString());
        const nextHeight    = parseFloat(wrapper.readString());
        const fromPosition  = new Position(x, y, height);
        const toPosition    = new Position(nextX, nextY, nextHeight);

        switch(movementType)
        {
            case 0: break;
            case 1:
                this._unitRolling = new ObjectRolling(unitId, fromPosition, toPosition, ObjectRolling.MOVE);
                break;
            case 2:
                this._unitRolling = new ObjectRolling(unitId, fromPosition, toPosition, ObjectRolling.SLIDE);
                break;
        }

        return true;
    }

    public get rollerId(): number
    {
        return this._rollerId;
    }

    public get itemsRolling(): ObjectRolling[]
    {
        return this._itemsRolling;
    }

    public get unitRolling(): ObjectRolling
    {
        return this._unitRolling;
    }
}