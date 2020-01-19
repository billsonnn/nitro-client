import { IVector3D } from '../../utils/IVector3D';
import { IRoomObject } from '../IRoomObject';

export interface IRoomObjectSprite extends PIXI.Sprite
{
    instanceId: number;
    boundingRectangle: PIXI.Rectangle;
    object: IRoomObject;
    tilePosition: IVector3D;
    tag: string;
    doesntHide: boolean;
    ignoreMouse: boolean;
}