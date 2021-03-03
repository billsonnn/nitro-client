import { IMessageDataWrapper } from '../../../../../../core/communication/messages/IMessageDataWrapper';
import { IMessageParser } from '../../../../../../core/communication/messages/IMessageParser';

export class RoomThicknessParser implements IMessageParser
{
    private _hideWalls: boolean;
    private _thicknessWall: number;
    private _thicknessFloor: number;

    public flush(): boolean
    {
        this._hideWalls         = false;
        this._thicknessWall     = 0;
        this._thicknessFloor    = 0;

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._hideWalls         = wrapper.readBoolean();

        const thicknessWall   = wrapper.readInt();
        const thicknessFloor  = wrapper.readInt();


        this._thicknessWall     = Math.pow(2, thicknessWall);
        this._thicknessFloor    = Math.pow(2, thicknessFloor);

        return true;
    }

    public get hideWalls(): boolean
    {
        return this._hideWalls;
    }

    public get thicknessWall(): number
    {
        return this._thicknessWall;
    }

    public get thicknessFloor(): number
    {
        return this._thicknessFloor;
    }
}
