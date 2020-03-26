import { IAssetManager } from '../../../core/asset/IAssetManager';
import { AvatarStructure } from '../AvatarStructure';
import { IAvatarImage } from '../IAvatarImage';
import { AvatarCanvas } from '../structure/AvatarCanvas';

export class AvatarImageCache
{
    private _structure: AvatarStructure;
    private _avatar: IAvatarImage;
    private _assets: IAssetManager;
    private _scale: string;
    private _canvas: AvatarCanvas;
    private _geometry: string;

    constructor(structure: AvatarStructure, avatar: IAvatarImage, assets: IAssetManager, scale: string)
    {
        this._structure = structure;
        this._avatar    = avatar;
        this._assets    = assets;
        this._scale     = scale;
        this._canvas    = null;
        this._geometry  = null;
    }
}