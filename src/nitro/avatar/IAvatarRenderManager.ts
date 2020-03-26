import { INitroManager } from '../../core/common/INitroManager';
import { IAvatarImage } from './IAvatarImage';
import { IAvatarImageListener } from './IAvatarImageListener';

export interface IAvatarRenderManager extends INitroManager
{
    createAvatarImage(figure: string, size: string, gender: string, listener: IAvatarImageListener): IAvatarImage;
    isReady: boolean;
}