import * as PIXI from 'pixi.js-legacy';
import { IRoomObjectController } from '../object/IRoomObjectController';
import { ICollision } from './ICollision';

export interface IRoomCollision extends PIXI.Container
{
    setObject(object: IRoomObjectController): void;
    addCollision(sprite: PIXI.DisplayObject): void;
    removeCollision(sprite: PIXI.DisplayObject): void;
    findCollision(point: PIXI.Point): ICollision;
}