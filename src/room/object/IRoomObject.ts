import { IDisposable } from '../../core/common/disposable/IDisposable';
import { Position } from '../utils/Position';
import { IRoomObjectModel } from './IRoomObjectModel';
import { IRoomObjectLogic } from './logic/IRoomObjectLogic';
import { IRoomObjectSpriteVisualization } from './visualization/IRoomObjectSpriteVisualization';

export interface IRoomObject extends IDisposable
{
    getScreenPosition(): Position;
    id: number;
    instanceId: number;
    type: string;
    model: IRoomObjectModel;
    visualization: IRoomObjectSpriteVisualization;
    logic: IRoomObjectLogic;
    position: Position;
    tempPosition: Position;
    state: number;
    updateCounter: number;
}