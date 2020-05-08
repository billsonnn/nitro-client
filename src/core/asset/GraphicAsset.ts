export class GraphicAsset
{
    private _name: string;
    private _source: string;
    private _texture: PIXI.Texture;
    private _x: number;
    private _y: number;
    private _width: number;
    private _height: number;
    private _flipH: boolean;
    private _flipV: boolean;
    private _rectangle: PIXI.Rectangle;

    private _initialized: boolean;
    private _disposed: boolean;

    public static createAsset(name: string, source: string, texture: PIXI.Texture, x: number, y: number, flipH: boolean = false, flipV: boolean = false)
    {
        const asset = new GraphicAsset();

        asset._name      = name;
        asset._source    = source || null

        if(asset._source === null) asset._source = asset._name;

        if(texture)
        {
            asset._texture      = texture;
            asset._initialized  = false;
        }
        else
        {
            asset._texture      = null;
            asset._initialized  = true;
        }

        asset._x            = x || 0;
        asset._y            = y || 0;
        asset._flipH        = flipH;
        asset._flipV        = flipV;
        asset._rectangle    = null;

        asset._disposed     = false;

        return asset;
    }

    public dispose(): void
    {
        if(this._disposed) return;

        this._disposed  = true;
        this._name      = null;
        this._source    = null;

        if(this._texture)
        {
            this._texture.destroy();

            this._texture = null;
        }
    }

    private initialize(): void
    {
        if(this._initialized || !this._texture) return;

        this._width     = this._texture.width;
        this._height    = this._texture.height;

        this._initialized = true;
    }

    public get name(): string
    {
        return this._name;
    }

    public get source(): string
    {
        return this._source;
    }

    public get texture(): PIXI.Texture
    {
        return this._texture;
    }

    public get x(): number
    {
        return this._x;
    }

    public get y(): number
    {
        return this._y;
    }

    public get width(): number
    {
        this.initialize();

        return this._width;
    }

    public get height(): number
    {
        this.initialize();

        return this._height;
    }

    public get offsetX(): number
    {
        if(!this._flipH) return -(this._x);

        return (-(this._x) * -1);
    }

    public get offsetY(): number
    {
        if(!this._flipV) return -(this._y);

        return (-(this._y) * -1);
    }

    public get flipH(): boolean
    {
        return this._flipH;
    }

    public get flipV(): boolean
    {
        return this._flipV;
    }

    public get rectangle(): PIXI.Rectangle
    {
        if(!this._rectangle) this._rectangle = new PIXI.Rectangle(0, 0, this.width, this.height);

        return this._rectangle;
    }
}