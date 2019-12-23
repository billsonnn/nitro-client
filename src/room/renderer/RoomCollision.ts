import * as PIXI from 'pixi.js-legacy';
import { NitroInstance } from '../../nitro/NitroInstance';
import { IRoomObjectSprite } from '../object/visualization/IRoomObjectSprite';

export class RoomCollision extends PIXI.Container
{
    constructor()
    {
        super();
        
        this.sortableChildren = true;
    }

    public addCollision(sprite: IRoomObjectSprite): void
    {
        if(!sprite) return;

        this.addChild(sprite);
    }

    public removeCollision(sprite: IRoomObjectSprite): void
    {
        if(!sprite) return;

        this.removeChild(sprite);
    }

    public findCollision(point: PIXI.Point): IRoomObjectSprite | PIXI.DisplayObject
    {
        return NitroInstance.instance.renderer.pixiRenderer.plugins.interaction.hitTest(point, this);
    }
}