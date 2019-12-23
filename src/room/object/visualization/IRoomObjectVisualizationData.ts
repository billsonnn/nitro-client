import { IAssetData } from '../../../core/asset/interfaces/IAssetData';
import { IDisposable } from '../../../core/common/disposable/IDisposable';

export interface IObjectVisualizationData extends IDisposable
{
    initialize(asset: IAssetData): boolean;
}