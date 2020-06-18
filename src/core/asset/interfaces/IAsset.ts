export interface IAsset
{
    source?: string;
    x: number;
    y: number;
    flipH?: boolean;
    usesPalette?: number;
    texture: PIXI.Texture;
}