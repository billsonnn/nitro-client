import { GraphicAssetCollection } from '../../../core/asset/GraphicAssetCollection';
import { IRoomObjectVisualization } from './IRoomObjectVisualization';

export interface IRoomObjectGraphicVisualization extends IRoomObjectVisualization
{
    asset: GraphicAssetCollection;
}