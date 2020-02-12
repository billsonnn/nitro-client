import { IRoomObject } from '../object/IRoomObject';
import { RoomObjectEvent } from './RoomObjectEvent';

export class RoomObjectMouseEvent extends RoomObjectEvent
{
    public static CLICK: string         = 'ROE_MOUSE_CLICK';
    public static DOUBLE_CLICK: string  = 'ROE_MOUSE_DOUBLE_CLICK';
    public static MOUSE_MOVE: string    = 'ROE_MOUSE_MOVE';
    public static MOUSE_DOWN: string    = 'ROE_MOUSE_DOWN';
    public static MOUSE_UP: string      = 'ROE_MOUSE_UP';
    
    private _eventId: string = "";
    private _altKey: boolean;
    private _ctrlKey: boolean;
    private _shiftKey: boolean;
    private _buttonDown: boolean;
    private _localX: number;
    private _localY: number;
    private _spriteOffsetX: number;
    private _spriteOffsetY: number;

    constructor(k: string, _arg_2: IRoomObject, _arg_3: string, _arg_4: boolean = false, _arg_5: boolean = false, _arg_6: boolean = false, _arg_7: boolean = false)
    {
        super(k, _arg_2);

        this._eventId = _arg_3;
        this._altKey = _arg_4;
        this._ctrlKey = _arg_5;
        this._shiftKey = _arg_6;
        this._buttonDown = _arg_7;
    }

    public get _Str_3463(): string
    {
        return this._eventId;
    }

    public get altKey(): boolean
    {
        return this._altKey;
    }

    public get ctrlKey(): boolean
    {
        return this._ctrlKey;
    }

    public get shiftKey(): boolean
    {
        return this._shiftKey;
    }

    public get buttonDown(): boolean
    {
        return this._buttonDown;
    }

    public get localX(): number
    {
        return this._localX;
    }

    public get localY(): number
    {
        return this._localY;
    }

    public get _Str_4595(): number
    {
        return this._spriteOffsetX;
    }

    public get _Str_4534(): number
    {
        return this._spriteOffsetY;
    }

    public set localX(k: number)
    {
        this._localX = k;
    }

    public set localY(k: number)
    {
        this._localY = k;
    }

    public set _Str_4595(k: number)
    {
        this._spriteOffsetX = k;
    }

    public set _Str_4534(k: number)
    {
        this._spriteOffsetY = k;
    }
}