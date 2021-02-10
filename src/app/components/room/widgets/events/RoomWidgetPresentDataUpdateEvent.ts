import { Texture } from 'pixi.js';
import { RoomWidgetUpdateEvent } from '../../../../../client/nitro/ui/widget/events/RoomWidgetUpdateEvent';

export class RoomWidgetPresentDataUpdateEvent extends RoomWidgetUpdateEvent
{
    public static RWPDUE_PACKAGEINFO: string = 'RWPDUE_PACKAGEINFO';
    public static RWPDUE_CONTENTS: string = 'RWPDUE_CONTENTS';
    public static RWPDUE_CONTENTS_CLUB: string = 'RWPDUE_CONTENTS_CLUB';
    public static RWPDUE_CONTENTS_FLOOR: string = 'RWPDUE_CONTENTS_FLOOR';
    public static RWPDUE_CONTENTS_LANDSCAPE: string = 'RWPDUE_CONTENTS_LANDSCAPE';
    public static RWPDUE_CONTENTS_WALLPAPER: string = 'RWPDUE_CONTENTS_WALLPAPER';
    public static RWPDUE_CONTENTS_IMAGE: string = 'RWPDUE_CONTENTS_IMAGE';

    private _Str_2319: number = -1;
    private _classId: number = 0;
    private _itemType: string = '';
    private _text: string;
    private _controller: boolean;
    private _Str_12168: Texture;
    private _Str_19174: string;
    private _Str_19510: string;
    private _placedItemId: number = -1;
    private _placedItemType: string = '';
    private _placedInRoom: boolean;

    constructor(k: string, _arg_2: number, _arg_3: string, _arg_4: boolean = false, _arg_5: Texture = null, _arg_6: string = null, _arg_7: string = null)
    {
        super(k);

        this._Str_2319 = _arg_2;
        this._text = _arg_3;
        this._controller = _arg_4;
        this._Str_12168 = _arg_5;
        this._Str_19174 = _arg_6;
        this._Str_19510 = _arg_7;
    }

    public get _Str_1577(): number
    {
        return this._Str_2319;
    }

    public get classId(): number
    {
        return this._classId;
    }

    public set classId(k: number)
    {
        this._classId = k;
    }

    public get itemType(): string
    {
        return this._itemType;
    }

    public set itemType(k: string)
    {
        this._itemType = k;
    }

    public get text(): string
    {
        return this._text;
    }

    public get controller(): boolean
    {
        return this._controller;
    }

    public get _Str_11625(): Texture
    {
        return this._Str_12168;
    }

    public get _Str_22956(): string
    {
        return this._Str_19174;
    }

    public get _Str_23105(): string
    {
        return this._Str_19510;
    }

    public get placedItemId(): number
    {
        return this._placedItemId;
    }

    public set placedItemId(k: number)
    {
        this._placedItemId = k;
    }

    public get placedInRoom(): boolean
    {
        return this._placedInRoom;
    }

    public set placedInRoom(k: boolean)
    {
        this._placedInRoom = k;
    }

    public get placedItemType(): string
    {
        return this._placedItemType;
    }

    public set placedItemType(k: string)
    {
        this._placedItemType = k;
    }
}
