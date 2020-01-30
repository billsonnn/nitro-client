import * as PIXI from 'pixi.js-legacy';
import { IRoomGeometry } from '../utils/IRoomGeometry';
import { IRoomCanvasMouseListener } from './IRoomCanvasMouseListener';

export interface IRoomRenderingCanvas
{
    dispose(): void;
    initialize(width: number, height: number): void;
    render(time: number, update?: boolean): void;
    update(): void;
    setMouseListener(listener: IRoomCanvasMouseListener): void;
    geometry: IRoomGeometry;
    displayObject: PIXI.DisplayObject;
}