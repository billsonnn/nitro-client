import * as PIXI from 'pixi.js-legacy';
import { INitroCamera } from './INitroCamera';

export interface INitroRenderer extends PIXI.Application
{
    setup(): void;
    setBackgroundColor(color: number): void;
    toggleDrag(): void;
    resizeRenderer(width: number, height: number): void;
    camera: INitroCamera;
    pixiRenderer: PIXI.Renderer | PIXI.CanvasRenderer;
    preventEvents: boolean;
    preventNextClick: boolean;
}