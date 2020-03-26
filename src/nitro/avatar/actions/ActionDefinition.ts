import { ActionType } from './ActionType';
import { IActionDefinition } from './IActionDefinition';

export class ActionDefinition implements IActionDefinition
{
    private _id: string;
    private _state: string;
    private _precedence: number;
    private _activePartSet: string;
    private _assetPartDefinition: string;
    private _lay: string;
    private _geometryType: string;
    private _isMain: boolean;
    private _isDefault: boolean;
    private _isAnimation: boolean;
    private _startFromFrameZero: boolean;
    private _prevents: string[];
    private _preventHeadTurn: boolean;
    private _types: Map<number, ActionType>;
    private _params: Map<string, string>;
    private _defaultParameterValue: string;
    private _canvasOffsets: Map<string, Map<number, []>>;

    constructor(data: any)
    {
        this._id                    = data.id;
        this._state                 = data.state;
        this._precedence            = data.precedence;
        this._activePartSet         = data.activePartSet;
        this._assetPartDefinition   = data.assetPartDefinition;
        this._lay                   = data.lay;
        this._geometryType          = data.geometryType;
        this._isMain                = data.main || false;
        this._isDefault             = data.isDefault || false;
        this._isAnimation           = data.animation || false;
        this._startFromFrameZero    = data.startFromFrameZero || false;
        this._prevents              = data.prevents || [];
        this._preventHeadTurn       = data.preventHeadTurn || false;
        this._types                 = new Map();
        this._params                = new Map();
        this._defaultParameterValue = '';
        this._canvasOffsets         = null;

        if(data.params && (data.params.length > 0))
        {
            for(let param of data.params)
            {
                if(!param) continue;

                if(param.id === 'default') this._defaultParameterValue = param.value;
                else this._params.set(param.id, param.value);
            }
        }

        if(data.types && (data.types.length > 0))
        {
            for(let type of data.types)
            {
                if(!type) continue;

                const action = new ActionType(type);

                this._types.set(action.id, action);
            }
        }
    }

    public _Str_772(k: string, _arg_2: number, _arg_3: []): void
    {
        if(!this._canvasOffsets) this._canvasOffsets = new Map();

        let existing = this._canvasOffsets.get(k);

        if(!existing)
        {
            existing = new Map();

            this._canvasOffsets.set(k, existing);
        }

        existing.set(_arg_2, _arg_3);
    }

    public _Str_805(k: string, _arg_2: number): []
    {
        if(!this._canvasOffsets) return null;

        const existing = this._canvasOffsets.get(k);

        if(!existing) return null;

        return existing.get(_arg_2);
    }

    public getType(id: string): ActionType
    {
        if(!id) return null;

        const existing = this._types.get(parseInt(id));

        if(!existing) return null;

        return existing;
    }

    public _Str_1350(id: string): string
    {
        if(!id) return '';

        const existing = this._params.get(id);

        if(!existing) return this._defaultParameterValue;

        return existing;
    }

    public _Str_733(type: string): string[]
    {
        return this._prevents.concat(this._Str_1889(type));
    }

    private _Str_1889(type: string): string[]
    {
        if(!type) return [];

        const existing = this._types.get(parseInt(type));

        if(!existing) return [];

        return existing.prevents;
    }

    public _Str_715(k: string): boolean
    {
        if(!k) return this._preventHeadTurn;

        const type = this.getType(k);

        if(!type) return this._preventHeadTurn;

        return type.preventHeadTurn;
    }

    public _Str_801(k: string): boolean
    {
        if(!k) return true;

        const type = this.getType(k);

        if(!type) return true;

        return type.isAnimated;
    }

    public get id(): string
    {
        return this._id;
    }

    public get state(): string
    {
        return this._state;
    }

    public get precedence(): number
    {
        return this._precedence;
    }

    public get activePartSet(): string
    {
        return this._activePartSet;
    }

    public get _Str_778(): string
    {
        return this._assetPartDefinition;
    }

    public get lay(): string
    {
        return this._lay;
    }

    public get _Str_868(): string
    {
        return this._geometryType;
    }

    public get _Str_779(): boolean
    {
        return this._isMain;
    }

    public get _Str_804(): boolean
    {
        return this._isDefault;
    }

    public get _Str_861(): boolean
    {
        return this._isAnimation;
    }

    public get _Str_812(): boolean
    {
        return this._startFromFrameZero;
    }

    public get prevents(): string[]
    {
        return this._prevents;
    }

    public get preventHeadTurn(): boolean
    {
        return this._preventHeadTurn;
    }

    public get params(): Map<string, string>
    {
        return this._params;
    }
}