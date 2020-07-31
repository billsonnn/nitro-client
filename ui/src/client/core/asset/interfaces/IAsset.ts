export interface IAsset
{
    source?: string;
    x: number;
    y: number;
    flipH?: boolean;
    usesPalette?: boolean;
    texture: PIXI.Texture;
}