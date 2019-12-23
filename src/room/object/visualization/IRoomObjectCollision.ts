import * as PIXI from 'pixi.js-legacy';
import { IRoomObject } from '../IRoomObject';
import { IRoomObjectSprite } from './IRoomObjectSprite';

export interface IRoomObjectCollision extends PIXI.Container
{
    addCollision(sprite: IRoomObjectSprite): void
    removeCollision(sprite: IRoomObjectSprite): void
    findCollision(point: PIXI.Point): IRoomObjectSprite;
    object: IRoomObject;
}