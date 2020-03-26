import { IMessageDataWrapper } from '../../../../../../../core/communication/messages/IMessageDataWrapper';

export class FurnitureWallDataParser
{
    private _itemId: number;
    private _spriteId: number;
    private _location: string;
    private _stuffData: string;
    private _state: number;
    private _secondsToExpiration: number;
    private _usagePolicy: number;
    private _userId: number;
    private _username: string;

    private _width: number;
    private _height: number;
    private _localX: number;
    private _localY: number;
    private _direction: string;

    constructor(wrapper: IMessageDataWrapper)
    {
        if(!wrapper) throw new Error('invalid_wrapper');

        this.flush();
        this.parse(wrapper);
    }

    public flush(): boolean
    {
        this._itemId                    = 0;
        this._spriteId                  = 0;
        this._location                  = null;
        this._stuffData                 = null;
        this._state                     = 0;
        this._secondsToExpiration       = 0;
        this._usagePolicy               = -1;
        this._userId                    = 0;
        this._username                  = null;

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._itemId                    = parseInt(wrapper.readString());
        this._spriteId                  = wrapper.readInt();
        this._location                  = wrapper.readString();
        this._stuffData                 = wrapper.readString();
        this._secondsToExpiration       = wrapper.readInt();
        this._usagePolicy               = wrapper.readInt();
        this._userId                    = wrapper.readInt();
        this._username                  = null;

        const state = parseFloat(this._stuffData);

        if(!isNaN(state)) this._state = state;

        if(this._location.indexOf(':') === 0)
        {
            let parts = this._location.split(' ');

            if(parts.length >= 3)
            {
                let [ widthHeight, leftRight, direction ] = parts;

                if((widthHeight.length > 3) && (leftRight.length > 2))
                {
                    widthHeight = widthHeight.substr(3);
                    leftRight   = leftRight.substr(2);
                    parts       = widthHeight.split(',');

                    if(parts.length >= 2)
                    {
                        const width     = parseInt(parts[0]);
                        const height    = parseInt(parts[1]);

                        parts = leftRight.split(',');

                        if(parts.length >= 2)
                        {
                            const localX    = parseInt(parts[0]);
                            const localY    = parseInt(parts[1]);

                            this._width     = width;
                            this._height    = height;
                            this._localX    = localX;
                            this._localY    = localY;
                            this._direction = direction;
                        }
                    }
                }
            }
        }

        return true;
    }

    public get itemId(): number
    {
        return this._itemId;
    }

    public get spriteId(): number
    {
        return this._spriteId;
    }

    public get wallPosition(): string
    {
        return this._location;
    }

    public get stuffData(): string
    {
        return this._stuffData;
    }

    public get state(): number
    {
        return this._state;
    }

    public get secondsToExpiration(): number
    {
        return this._secondsToExpiration;
    }

    public get usagePolicy(): number
    {
        return this._usagePolicy;
    }

    public get userId(): number
    {
        return this._userId;
    }

    public get username(): string
    {
        return this._username;
    }

    public set username(username: string)
    {
        this._username = username;
    }

    public get width(): number
    {
        return this._width;
    }

    public get height(): number
    {
        return this._height;
    }

    public get localX(): number
    {
        return this._localX;
    }

    public get localY(): number
    {
        return this._localY;
    }

    public get direction(): string
    {
        return this._direction
    }
}