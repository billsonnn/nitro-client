import { Position } from '../../utils/Position';
import { IRoomObject } from '../IRoomObject';

export interface IRoomObjectSprite extends PIXI.Sprite
{
    instanceId: number;
    boundingRectangle: PIXI.Rectangle;
    object: IRoomObject;
    tilePosition: Position;
    tag: string;
    doesntHide: boolean;
    ignoreMouse: boolean;
}