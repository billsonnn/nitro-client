import { IAssetManager } from '../../core/asset/IAssetManager';
import { INitroManager } from '../../core/common/INitroManager';
import { IAvatarEffectListener } from './IAvatarEffectListener';
import { IAvatarImage } from './IAvatarImage';
import { IAvatarImageListener } from './IAvatarImageListener';

export interface IAvatarRenderManager extends INitroManager
{
    createAvatarImage(figure: string, size: string, gender: string, listener: IAvatarImageListener, effectListener: IAvatarEffectListener): IAvatarImage;
    assets: IAssetManager;
    isReady: boolean;
}