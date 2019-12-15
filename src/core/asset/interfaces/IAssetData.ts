import { IAsset } from './IAsset';
import { IAssetDimension } from './IAssetDimension';
import { IAssetPalette } from './IAssetPalette';
import { IAssetVisualizationData } from './visualization/IAssetVisualizationData';

export interface IAssetData {
    type: string;
    name: string;
    visualizationType: string;
    logicType: string;
    spritesheet: string;
    dimensions: IAssetDimension;
    directions: number[];
    assets: { [index: string]: IAsset };
    palettes: IAssetPalette[];
    visualization: IAssetVisualizationData;
}