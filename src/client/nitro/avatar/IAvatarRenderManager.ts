import { IAssetManager } from '../../core/asset/IAssetManager';
import { INitroManager } from '../../core/common/INitroManager';
import { IGraphicAsset } from '../../room/object/visualization/utils/IGraphicAsset';
import { AvatarAssetDownloadManager } from './AvatarAssetDownloadManager';
import { AvatarFigureContainer } from './AvatarFigureContainer';
import { AvatarStructure } from './AvatarStructure';
import { IAvatarEffectListener } from './IAvatarEffectListener';
import { IAvatarImage } from './IAvatarImage';
import { IAvatarImageListener } from './IAvatarImageListener';
import { IStructureData } from './structure/IStructureData';

export interface IAvatarRenderManager extends INitroManager
{
    createAvatarImage(figure: string, size: string, gender: string, listener?: IAvatarImageListener, effectListener?: IAvatarEffectListener): IAvatarImage;
    downloadAvatarFigure(container: AvatarFigureContainer, listener: IAvatarImageListener): void;
    isValidFigureSetForGender(setId: number, gender: string): boolean;
    getFigureStringWithFigureIds(k: string, _arg_2: string, _arg_3: number[]): string;
    getAssetByName(name: string): IGraphicAsset;
    assets: IAssetManager;
    isReady: boolean;
    structure: AvatarStructure;
    structureData: IStructureData;
    downloadManager: AvatarAssetDownloadManager;
}