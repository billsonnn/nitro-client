import { AvatarActionManager } from './actions/AvatarActionManager';
import { IActionDefinition } from './actions/IActionDefinition';
import { AnimationManager } from './animation/AnimationManager';
import { AvatarRenderManager } from './AvatarRenderManager';
import { AvatarModelGeometry } from './geometry/AvatarModelGeometry';
import { IAvatarRenderManager } from './IAvatarRenderManager';
import { AnimationData } from './structure/AnimationData';
import { FigureSetData } from './structure/FigureSetData';
import { PartSetsData } from './structure/PartSetsData';

export class AvatarStructure
{
    private _renderManager: AvatarRenderManager;
    private _geometry: AvatarModelGeometry;
    private _figureData: FigureSetData;
    private _partSetsData: PartSetsData;
    private _animationData: AnimationData;
    private _animationManager: AnimationManager;
    private _mandatorySetTypeIds: any;
    private _actionManager: AvatarActionManager;
    private _defaultAction: IActionDefinition;

    constructor(renderManager: AvatarRenderManager)
    {
        this._renderManager         = renderManager;
        this._geometry              = null;
        this._figureData            = new FigureSetData();
        this._partSetsData          = new PartSetsData();
        this._animationData         = new AnimationData();
        this._animationManager      = new AnimationManager();
        this._mandatorySetTypeIds   = {};
        this._actionManager         = null;
        this._defaultAction         = null;
    }

    public _Str_1825(k: any): void
    {
        if(!k) return;

        this._geometry = new AvatarModelGeometry(k);
    }

    public _Str_1060(k: any, _arg_2: any):void
    {
        if(!_arg_2) return;

        this._actionManager = new AvatarActionManager(k, _arg_2);
        this._defaultAction = this._actionManager._Str_1027();
    }

    public _Str_1296(k: any): boolean
    {
        if(!k) return false;

        if(this._partSetsData.parse(k))
        {
            this._partSetsData._Str_1102("ri")._Str_1583 = true;
            this._partSetsData._Str_1102("li")._Str_1583 = true;

            return true;
        }

        return false;
    }

    public _Str_2229(k: any): boolean
    {
        if(!k) return false;
        
        return this._animationData.parse(k);
    }

    public _Str_1569(k: any): boolean
    {
        if(!k) return false;
        
        return this._figureData.parse(k);
    }

    public get renderManager(): IAvatarRenderManager
    {
        return this._renderManager;
    }

    public get figureData(): FigureSetData
    {
        return this._figureData;
    }
}