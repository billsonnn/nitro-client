import { IRoomSession } from '../IRoomSession';
import { RoomSessionEvent } from './RoomSessionEvent';

export class RoomSessionPresentEvent extends RoomSessionEvent
{
    public static RSPE_PRESENT_OPENED: string = 'RSPE_PRESENT_OPENED';

    private _classId: number = 0;
    private _itemType: string = '';
    private _productCode: string;
    private _placedItemId: number = 0;
    private _placedItemType: string = '';
    private _placedInRoom: boolean;
    private _petFigureString: string;

    constructor(k: string, _arg_2: IRoomSession, _arg_3: number, _arg_4: string, _arg_5: string, _arg_6: number, _arg_7: string, _arg_8: boolean, _arg_9: string)
    {
        super(k, _arg_2);

        this._classId = _arg_3;
        this._itemType = _arg_4;
        this._productCode = _arg_5;
        this._placedItemId = _arg_6;
        this._placedItemType = _arg_7;
        this._placedInRoom = _arg_8;
        this._petFigureString = _arg_9;
    }

    public get _Str_2706(): number
    {
        return this._classId;
    }

    public get _Str_2887(): string
    {
        return this._itemType;
    }

    public get _Str_2716(): string
    {
        return this._productCode;
    }

    public get _Str_5200(): number
    {
        return this._placedItemId;
    }

    public get _Str_4057(): boolean
    {
        return this._placedInRoom;
    }

    public get _Str_5057(): string
    {
        return this._placedItemType;
    }

    public get _Str_17075(): string
    {
        return this._petFigureString;
    }
}