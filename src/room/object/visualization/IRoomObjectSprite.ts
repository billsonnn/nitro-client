import { IRoomObject } from '../IRoomObject';

export interface IRoomObjectSprite extends PIXI.Sprite
{
    instanceId: number;
    object: IRoomObject;
    boundingRectangle: PIXI.Rectangle;
    tag: string;
    doesntHide: boolean;
    ignoreMouse: boolean;
}