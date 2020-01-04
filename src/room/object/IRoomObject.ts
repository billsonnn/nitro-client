import { IDisposable } from '../../core/common/disposable/IDisposable';
import { IRoomInstance } from '../IRoomInstance';
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
    category: number;
    model: IRoomObjectModel;
    room: IRoomInstance;
    visualization: IRoomObjectSpriteVisualization;
    logic: IRoomObjectLogic;
    position: Position;
    realPosition: Position;
    tempPosition: Position;
    state: number;
    updateCounter: number;
}