import * as PIXI from 'pixi.js-legacy';
import { IDownloadQueue } from './download/IDownloadQueue';
import { GraphicAssetCollection } from './GraphicAssetCollection';
import { IAssetData } from './interfaces';

export interface IAssetManager
{
    dispose(): void;
    getCollection(name: string): GraphicAssetCollection;
    createCollection(data: IAssetData, spritesheet: PIXI.Spritesheet): GraphicAssetCollection;
    downloadAssets(urls: string[], cb: Function): void;
    downloadImages(urls: string[], cb: Function): void;
    queue: IDownloadQueue;
}