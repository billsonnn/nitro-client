import { IAssetData } from '../../../../../core/asset/interfaces';
import { Disposable } from '../../../../../core/common/disposable/Disposable';
import { IObjectVisualizationData } from '../../../../../room/object/visualization/IRoomObjectVisualizationData';
import { AvatarImage } from '../../../../avatar/AvatarImage';
import { AvatarManager } from '../../../../avatar/AvatarManager';

export class AvatarVisualizationData extends Disposable implements IObjectVisualizationData
{
    private _avatarManager: AvatarManager;

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

    public createAvatarImage(figure: string): AvatarImage
    {
        return this._avatarManager.createAvatarImage(figure);
    }

    public get layerCount(): number
    {
        return 0;
    }

    public get saveable(): boolean
    {
        return true;
    }
}