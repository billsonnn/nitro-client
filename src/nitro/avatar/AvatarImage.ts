import { IAssetManager } from '../../core/asset/IAssetManager';
import { AvatarFigureContainer } from './AvatarFigureContainer';
import { AvatarStructure } from './AvatarStructure';
import { AvatarImageCache } from './cache/AvatarImageCache';
import { AvatarScaleType } from './enum/AvatarScaleType';
import { IAvatarImage } from './IAvatarImage';

export class AvatarImage implements IAvatarImage
{
    private _structure: AvatarStructure;
    private _assets: IAssetManager;
    private _figureContainer: AvatarFigureContainer;
    private _scale: string;
    private _cache: AvatarImageCache;

    constructor(structure: AvatarStructure, assets: IAssetManager, figureContainer: AvatarFigureContainer, scale: string)
    {
        this._structure         = structure;
        this._assets            = assets;
        this._figureContainer   = figureContainer;
        this._scale             = scale;

        if(!this._scale) this._scale = AvatarScaleType.LARGE;

        if(!this._figureContainer) this._figureContainer = new AvatarFigureContainer('hr-893-45.hd-180-2.ch-210-66.lg-270-82.sh-300-91.wa-2007-.ri-1-');

        this._cache             = new AvatarImageCache(this._structure, this, this._assets, scale);
    }

    public dispose(): void
    {

    }

    public get id(): number
    {
        return 0;
    }
}