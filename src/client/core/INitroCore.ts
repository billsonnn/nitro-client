import { IAssetManager } from './asset/IAssetManager';
import { IDisposable } from './common/disposable/IDisposable';
import { ICommunicationManager } from './communication/ICommunicationManager';

export interface INitroCore extends IDisposable
{
    asset: IAssetManager;
    communication: ICommunicationManager;
}