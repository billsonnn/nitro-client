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
    visible: boolean;
    tag: string;
    filters: PIXI.Filter[];
    ignoreMouse: boolean;
    updateCounter: number;
}