import { IAsset } from './IAsset';
import { IAssetAlias } from './IAssetAlias';
import { IAssetDimension } from './IAssetDimension';
import { IAssetPalette } from './IAssetPalette';
import { ISpritesheetData } from './spritesheet';
import { IAssetVisualizationData } from './visualization';

export interface IAssetData {
    type: string;
    name: string;
    visualizationType: string;
    logicType: string;
    maskType: string;
    spritesheet: ISpritesheetData;
    dimensions: IAssetDimension;
    directions: number[];
    assets: { [index: string]: IAsset };
    aliases: { [index: string]: IAssetAlias };
    palettes: { [index: string]: IAssetPalette };
    visualizations: IAssetVisualizationData[];
}