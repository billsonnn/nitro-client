import { IAssetManager } from './asset/IAssetManager';
import { ICommunicationManager } from './communication/ICommunicationManager';

export interface INitroCore
{
    dispose(): void;
    asset: IAssetManager;
    communication: ICommunicationManager;
}