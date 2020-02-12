export class RoomSpriteMouseEvent 
{
    private _type: string = "";
    private _eventId: string = "";
    private _canvasId: string = "";
    private _spriteTag: string = "";
    private _screenX: number = 0;
    private _screenY: number = 0;
    private _localX: number = 0;
    private _localY: number = 0;
    private _ctrlKey: boolean = false;
    private _altKey: boolean = false;
    private _shiftKey: boolean = false;
    private _buttonDown: boolean = false;
    private _spriteOffsetX: number = 0;
    private _spriteOffsetY: number = 0;

    constructor(type: string, eventId: string, canvasId: string, spriteTag: string, screenX: number, screenY: number, localX: number = 0, localY: number = 0, ctrlKey: boolean = false, altKey: boolean = false, shiftKey: boolean = false, buttonDown: boolean = false)
    {
        this._type          = type;
        this._eventId       = eventId;
        this._canvasId      = canvasId;
        this._spriteTag     = spriteTag;
        this._screenX       = screenX;
        this._screenY       = screenY;
        this._localX        = localX;
        this._localY        = localY;
        this._ctrlKey       = ctrlKey;
        this._altKey        = altKey;
        this._shiftKey      = shiftKey;
        this._buttonDown    = buttonDown;
        this._spriteOffsetX = 0;
        this._spriteOffsetY = 0;
    }

    public get type(): string
    {
        return this._type;
    }

    public get _Str_3463(): string
    {
        return this._eventId;
    }

    public get canvasId(): string
    {
        return this._canvasId;
    }

    public get _Str_4216(): string
    {
        return this._spriteTag;
    }

    public get _Str_24406(): number
    {
        return this._screenX;
    }

    public get _Str_25684(): number
    {
        return this._screenY;
    }

    public get localX(): number
    {
        return this._localX;
    }

    public get localY(): number
    {
        return this._localY;
    }

    public get ctrlKey(): boolean
    {
        return this._ctrlKey;
    }

    public get altKey(): boolean
    {
        return this._altKey;
    }

    public get shiftKey(): boolean
    {
        return this._shiftKey;
    }

    public get buttonDown(): boolean
    {
        return this._buttonDown;
    }

    public get _Str_4595(): number
    {
        return this._spriteOffsetX;
    }

    public set _Str_4595(k: number)
    {
        this._spriteOffsetX = k;
    }

    public get _Str_4534(): number
    {
        return this._spriteOffsetY;
    }

    public set _Str_4534(k: number)
    {
        this._spriteOffsetY = k;
    }
}