import { IDisposable } from '../../core/common/disposable/IDisposable';
import { IVector3D } from '../utils/IVector3D';
import { IRoomObjectModel } from './IRoomObjectModel';
import { IRoomObjectMouseHandler } from './logic/IRoomObjectMouseHandler';
import { IRoomObjectVisualization } from './visualization/IRoomObjectVisualization';

export interface IRoomObject extends IDisposable
{
    getLocation(): IVector3D;
    getDirection(): IVector3D;
    id: number;
    instanceId: number;
    type: string;
    model: IRoomObjectModel;
    visualization: IRoomObjectVisualization;
    mouseHandler: IRoomObjectMouseHandler;
    location: IVector3D;
    direction: IVector3D;
    tempLocation: IVector3D;
    realLocation: IVector3D;
    state: number;
    updateCounter: number;
    isReady: boolean;
}