export interface IAsset
{
    source?: string;
    x: number;
    y: number;
    flipH?: boolean;
    texture: PIXI.Texture;
}