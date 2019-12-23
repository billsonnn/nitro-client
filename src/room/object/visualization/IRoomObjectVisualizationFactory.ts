import { IAssetData } from '../../../core/asset/interfaces/IAssetData';
import { IRoomObjectSpriteVisualization } from './IRoomObjectSpriteVisualization';
import { IObjectVisualizationData } from './IRoomObjectVisualizationData';

export interface IRoomObjectVisualizationFactory
{
    getVisualization(type: string): IRoomObjectSpriteVisualization;
    getVisualizationData(type: string, visualizationType: string, asset: IAssetData): IObjectVisualizationData;
}