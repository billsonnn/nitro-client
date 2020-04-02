import * as PIXI from 'pixi.js-legacy';
import { IEventDispatcher } from '../events/IEventDispatcher';

export interface INitroRenderer extends PIXI.Application
{
    setup(): void;
    setBackgroundColor(color: number): void;
    eventDispatcher: IEventDispatcher;
    totalTimeRunning: number;
}