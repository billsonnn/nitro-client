import { RoomWidgetMessage } from './RoomWidgetMessage';

export class RoomWidgetFurniActionMessage extends RoomWidgetMessage
{
    public static RWFUAM_ROTATE: string = 'RWFUAM_ROTATE';
    public static RWFAM_MOVE: string = 'RWFAM_MOVE';
    public static RWFAM_PICKUP: string = 'RWFAM_PICKUP';
    public static RWFAM_EJECT: string = 'RWFAM_EJECT';
    public static RWFAM_USE: string = 'RWFAM_USE';
    public static RWFAM_OPEN_WELCOME_GIFT: string = 'RWFAM_OPEN_WELCOME_GIFT';
    public static RWFAM_SAVE_STUFF_DATA: string = 'RWFAM_SAVE_STUFF_DATA';

    private _furniId: number;
    private _furniCategory: number;
    private _offerId: number;
    private _objectData: string;

    constructor(k: string, _arg_2: number, _arg_3: number, _arg_4: number =- 1, _arg_5: string = null)
    {
        super(k);

        this._furniId       = _arg_2;
        this._furniCategory = _arg_3;
        this._offerId       = _arg_4;
        this._objectData    = _arg_5;
    }

    public get furniId(): number
    {
        return this._furniId;
    }

    public get furniCategory(): number
    {
        return this._furniCategory;
    }

    public get objectData(): string
    {
        return this._objectData;
    }

    public get _Str_2451(): number
    {
        return this._offerId;
    }
}