export interface IGetImageListener 
{
    imageReady(_arg_1: number, _arg_2: PIXI.Texture): void;
    imageFailed(_arg_1: number): void;
}