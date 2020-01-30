import { IRoomGeometry } from '../../utils/IRoomGeometry';
import { IRoomObject } from '../IRoomObject';
import { IObjectVisualizationData } from './IRoomObjectVisualizationData';

export interface IRoomObjectVisualization
{
    initialize(data: IObjectVisualizationData): boolean;
    dispose(): void;
    update(geometry: IRoomGeometry, time: number, update: boolean, skipUpdate: boolean): void;
    getBoundingRectangle(): PIXI.Rectangle;
    instanceId: number;
    object: IRoomObject;
    updateSpriteCounter: number;
}