import * as PIXI from 'pixi.js-legacy';
import { NitroInstance } from '../../nitro/NitroInstance';
import { IRoomCollision } from './IRoomCollision';

export class RoomCollision extends PIXI.Container implements IRoomCollision
{
    constructor()
    {
        super();
        
        this.sortableChildren = true;
    }

    public addCollision(sprite: PIXI.DisplayObject): void
    {
        if(!sprite) return;

        this.addChild(sprite);
    }

    public removeCollision(sprite: PIXI.DisplayObject): void
    {
        if(!sprite) return;

        this.removeChild(sprite);
    }

    public findCollision(point: PIXI.Point): PIXI.DisplayObject
    {
        return NitroInstance.instance.renderer.pixiRenderer.plugins.interaction.hitTest(point, this);
    }
}