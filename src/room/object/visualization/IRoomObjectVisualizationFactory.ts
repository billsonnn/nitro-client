import { IRoomObjectSpriteVisualization } from './IRoomObjectSpriteVisualization';
import { IObjectVisualizationData } from './IRoomObjectVisualizationData';

export interface IRoomObjectVisualizationFactory
{
    getVisualization(type: string): IRoomObjectSpriteVisualization;
    getVisualizationData(type: string, visualizationType: string, ...args: any[]): IObjectVisualizationData;
}