import { IDownloadQueue } from './download/IDownloadQueue';
import { IAssetData } from './interfaces';

export interface IAssetManager
{
    dispose(): void;
    getAsset(name: string): IAssetData;
    createAsset(name: string, data: IAssetData): IAssetData;
    downloadAssets(urls: string[], cb: Function): void;
    queue: IDownloadQueue;
}