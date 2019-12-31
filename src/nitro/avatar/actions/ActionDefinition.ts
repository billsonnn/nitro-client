import { ActionType } from './ActionType';
import { IActionDefinition } from './interfaces/IActionDefinition';

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
    private _types: { [index: string]: ActionType };
    private _params: { [index: string]: string };
    private _defaultParameterValue: string;

    constructor(data: any)
    {
        if(!data) throw new Error('invalid_data');
        
        this._id                    = data['$'].id;
        this._state                 = data['$'].state;
        this._precedence            = parseInt(data['$'].precedence);
        this._activePartSet         = data['$'].activepartset;
        this._assetPartDefinition   = data['$'].assetpartdefinition;
        this._lay                   = data['$'].lay;
        this._geometryType          = data['$'].geometrytype;
        this._isMain                = parseInt(data['$'].main) === 1;
        this._isDefault             = parseInt(data['$'].isdefault) === 1;
        this._isAnimation           = parseInt(data['$'].animation) === 1;
        this._startFromFrameZero    = data['$'].startfromframezero === 'true';
        this._prevents              = [];
        this._preventHeadTurn       = data['$'].preventheadturn === 'true';
        this._types                 = {};
        this._params                = {};
        this._defaultParameterValue = '';

        const prevents = data['$'].prevents;

        if(prevents) this._prevents = prevents.split(',');

        const params = data.param;

        if(params)
        {
            for(let param of params)
            {
                const paramId       = param['$'].id;
                const paramValue    = param['$'].value;

                if(paramId === 'default') this._defaultParameterValue = paramValue;
                else this._params[paramId] = paramValue;
            }
        }

        const types = data.type;

        if(types)
        {
            for(let type of types)
            {
                const typeId = type['$'].id;
                this._types[typeId] = new ActionType(type);
            }
        }
    }

    public getType(id: string): ActionType
    {
        if(!id) return null;

        const type = this._types[id];

        if(!type) return null;

        return type;
    }

    public getParameter(id: string): string
    {
        if(!id) return '';

        const existing = this._params[id];

        if(!existing) return this._defaultParameterValue;

        return existing;
    }

    public getPreventionWithType(type: string = null): string[]
    {
        return this._prevents.concat(this.getTypePrevention(type));
    }

    private getTypePrevention(type: string = null): string[]
    {
        if(!type) return [];

        const existingType = this._types[type] as ActionType;

        if(!existingType) return [];

        return existingType.prevents;
    }

    public getValueForParam(id: number): string
    {
        const existingParam = this._params[id];

        return existingParam ? existingParam : null;
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

    public get assetPartDefinition(): string
    {
        return this._assetPartDefinition;
    }

    public get lay(): string
    {
        return this._lay;
    }

    public get geometryType(): string
    {
        return this._geometryType;
    }

    public get isMain(): boolean
    {
        return this._isMain;
    }

    public get isDefault(): boolean
    {
        return this._isDefault;
    }

    public get isAnimation(): boolean
    {
        return this._isAnimation;
    }

    public get startFromFrameZero(): boolean
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

    public get params(): { [index: string]: string }
    {
        return this._params;
    }
}