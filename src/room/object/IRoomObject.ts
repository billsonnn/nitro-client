import { IDisposable } from '../../core/common/disposable/IDisposable';
import { IRoomInstance } from '../IRoomInstance';
import { IVector3D } from '../utils/IVector3D';
import { IRoomObjectModel } from './IRoomObjectModel';
import { IRoomObjectLogic } from './logic/IRoomObjectLogic';
import { IRoomObjectVisualization } from './visualization/IRoomObjectVisualization';

export interface IRoomObject extends IDisposable
{
    getLocation(): IVector3D;
    getDirection(): IVector3D;
    id: number;
    instanceId: number;
    type: string;
    category: number;
    model: IRoomObjectModel;
    room: IRoomInstance;
    visualization: IRoomObjectVisualization;
    logic: IRoomObjectLogic;
    location: IVector3D;
    direction: IVector3D;
    tempLocation: IVector3D;
    realLocation: IVector3D;
    state: number;
    updateCounter: number;
}