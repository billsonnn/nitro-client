export interface IGetImageListener 
{
    imageReady(id: number, texture: PIXI.Texture, image?: HTMLImageElement): void;
    imageFailed(id: number): void;
}