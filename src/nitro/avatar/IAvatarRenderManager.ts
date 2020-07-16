import { IAssetManager } from '../../core/asset/IAssetManager';
import { INitroManager } from '../../core/common/INitroManager';
import { IGraphicAsset } from '../../room/object/visualization/utils/IGraphicAsset';
import { AvatarAssetDownloadManager } from './AvatarAssetDownloadManager';
import { AvatarFigureContainer } from './AvatarFigureContainer';
import { AvatarStructure } from './AvatarStructure';
import { IAvatarEffectListener } from './IAvatarEffectListener';
import { IAvatarImage } from './IAvatarImage';
import { IAvatarImageListener } from './IAvatarImageListener';

export interface IAvatarRenderManager extends INitroManager
{
    createAvatarImage(figure: string, size: string, gender: string, listener?: IAvatarImageListener, effectListener?: IAvatarEffectListener): IAvatarImage;
    downloadAvatarFigure(container: AvatarFigureContainer, listener: IAvatarImageListener): void;
    getAssetByName(name: string): IGraphicAsset;
    assets: IAssetManager;
    isReady: boolean;
    structure: AvatarStructure;
    downloadManager: AvatarAssetDownloadManager;
}