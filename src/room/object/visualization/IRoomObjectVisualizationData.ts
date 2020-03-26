import { IAssetData } from '../../../core/asset/interfaces';
import { IDisposable } from '../../../core/common/disposable/IDisposable';

export interface IObjectVisualizationData extends IDisposable
{
    initialize(asset: IAssetData): boolean;
}