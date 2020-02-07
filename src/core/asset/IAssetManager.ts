import * as PIXI from 'pixi.js-legacy';
import { GraphicAssetCollection } from './GraphicAssetCollection';
import { IAssetData } from './interfaces';

export interface IAssetManager
{
    dispose(): void;
    getTexture(name: string): PIXI.Texture;
    setTexture(name: string, texture: PIXI.Texture): void;
    getCollection(name: string): GraphicAssetCollection;
    createCollection(data: IAssetData, spritesheet: PIXI.Spritesheet): GraphicAssetCollection;
    downloadAssets(urls: string[], cb: Function): void;
    downloadImages(urls: string[], cb: Function): void;
}