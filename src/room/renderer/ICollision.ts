import * as PIXI from 'pixi.js-legacy';
import { IRoomObjectController } from '../object/IRoomObjectController';

export interface ICollision extends PIXI.DisplayObject
{
    object: IRoomObjectController;
}