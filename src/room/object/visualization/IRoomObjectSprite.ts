import * as PIXI from 'pixi.js-legacy';

export interface IRoomObjectSprite
{
    id: number;
    name: string;
    type: string;
    spriteType: number;
    texture: PIXI.Texture;
    width: number;
    height: number;
    offsetX: number;
    offsetY: number;
    flipH: boolean;
    flipV: boolean;
    direction: number;
    alpha: number;
    blendMode: number;
    color: number;
    relativeDepth: number;
    _Str_4593: boolean;
    _Str_3582: string;
    visible: boolean;
    tag: string;
    alphaTolerance: number;
    filters: PIXI.Filter[];
    updateCounter: number;
}