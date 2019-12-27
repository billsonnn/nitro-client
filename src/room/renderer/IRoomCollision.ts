import * as PIXI from 'pixi.js-legacy';

export interface IRoomCollision extends PIXI.Container
{
    addCollision(sprite: PIXI.DisplayObject): void;
    removeCollision(sprite: PIXI.DisplayObject): void;
    findCollision(point: PIXI.Point): PIXI.DisplayObject;
}