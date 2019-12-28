import { IDisposable } from '../../../core/common/disposable/IDisposable';

export interface IObjectVisualizationData extends IDisposable
{
    initialize(...args: any[]): boolean;
    saveable: boolean;
}