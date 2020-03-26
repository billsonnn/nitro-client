import { IAssetData } from '../../../../../core/asset/interfaces';
import { Disposable } from '../../../../../core/common/disposable/Disposable';
import { IObjectVisualizationData } from '../../../../../room/object/visualization/IRoomObjectVisualizationData';
import { AvatarScaleType } from '../../../../avatar/enum/AvatarScaleType';
import { IAvatarImage } from '../../../../avatar/IAvatarImage';
import { IAvatarImageListener } from '../../../../avatar/IAvatarImageListener';
import { IAvatarRenderManager } from '../../../../avatar/IAvatarRenderManager';

export class AvatarVisualizationData extends Disposable implements IObjectVisualizationData
{
    private _avatarRenderer: IAvatarRenderManager;

    constructor()
    {
        super();
    }

    public initialize(asset: IAssetData): boolean
    {
        //if(!(avatarManager instanceof AvatarManager)) return false;

        //this._avatarManager = avatarManager;

        return true;
    }

    public onDispose(): void
    {
        super.onDispose();
    }

    public createAvatarImage(figure: string, size: number, gender: string = null, avatarListener: IAvatarImageListener = null): IAvatarImage
    {
        let avatarImage: IAvatarImage = null;

        if(size > 48) avatarImage = this._avatarRenderer.createAvatarImage(figure, AvatarScaleType.LARGE, gender, avatarListener);
        else avatarImage = this._avatarRenderer.createAvatarImage(figure, AvatarScaleType.SMALL, gender, avatarListener);

        return avatarImage;
    }

    public get avatarManager(): IAvatarRenderManager
    {
        return this._avatarRenderer;
    }

    public set avatarManager(renderer: IAvatarRenderManager)
    {
        this._avatarRenderer = renderer;
    }

    public get layerCount(): number
    {
        return 0;
    }
}