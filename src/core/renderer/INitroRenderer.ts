import * as PIXI from 'pixi.js-legacy';
import { IEventDispatcher } from '../events/IEventDispatcher';
import { INitroCamera } from './INitroCamera';

export interface INitroRenderer extends PIXI.Application
{
    setup(): void;
    setBackgroundColor(color: number): void;
    toggleDrag(): void;
    resizeRenderer(event?: UIEvent): void;
    camera: INitroCamera;
    pixiRenderer: PIXI.Renderer | PIXI.CanvasRenderer;
    eventDispatcher: IEventDispatcher;
    totalTimeRunning: number;
}