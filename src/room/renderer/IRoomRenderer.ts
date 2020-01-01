import * as PIXI from 'pixi.js-legacy';
import { IDisposable } from '../../core/common/disposable/IDisposable';
import { IRoomCollision } from './IRoomCollision';

export interface IRoomRenderer extends PIXI.Container, IDisposable
{
    mouseMove(event: MouseEvent): void;
    mouseDown(event: MouseEvent): void;
    mouseUp(event: MouseEvent): void;
    click(event: MouseEvent): void;
    keyDown(event: KeyboardEvent): void;
    keyUp(event: KeyboardEvent): void;
    collision: IRoomCollision;
}