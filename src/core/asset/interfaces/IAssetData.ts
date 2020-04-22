import { IAsset } from './IAsset';
import { IAssetAlias } from './IAssetAlias';
import { IAssetDimension } from './IAssetDimension';
import { IAssetPalette } from './IAssetPalette';
import { IAssetVisualizationData } from './visualization';

export interface IAssetData {
    type: string;
    name: string;
    visualizationType: string;
    logicType: string;
    spritesheet: string;
    dimensions: IAssetDimension;
    directions: number[];
    assets: { [index: string]: IAsset };
    aliases: { [index: string]: IAssetAlias };
    palettes: IAssetPalette[];
    visualization: IAssetVisualizationData;
}