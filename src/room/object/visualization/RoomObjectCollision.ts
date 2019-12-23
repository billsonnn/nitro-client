import * as PIXI from 'pixi.js-legacy';
import { NitroInstance } from '../../../nitro/NitroInstance';
import { IRoomObject } from '../IRoomObject';
import { RoomObject } from '../RoomObject';
import { IRoomObjectCollision } from './IRoomObjectCollision';
import { IRoomObjectSprite } from './IRoomObjectSprite';

export class RoomObjectCollision extends PIXI.Container implements IRoomObjectCollision
{
    private _roomObject: IRoomObject;

    constructor(object: IRoomObject)
    {
        super();

        if(!(object instanceof RoomObject)) throw new Error('invalid_object');

        this._roomObject        = object;

        this.sortableChildren   = true;
        this.interactive        = true;
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

    public findCollision(point: PIXI.Point): IRoomObjectSprite
    {
        return NitroInstance.instance.renderer.pixiRenderer.plugins.interaction.hitTest(point, this) as IRoomObjectSprite;
    }

    public get object(): IRoomObject
    {
        return this._roomObject;
    }
}