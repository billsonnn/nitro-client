import * as PIXI from 'pixi.js-legacy';

export class ExtendedSprite extends PIXI.Sprite
{
    private _tag: string;

    constructor(texture?: PIXI.Texture)
    {
        super(texture);

        this._tag = null;
    }

    public get tag(): string
    {
        return this._tag;
    }

    public set tag(tag: string)
    {
        this._tag = tag;
    }
}