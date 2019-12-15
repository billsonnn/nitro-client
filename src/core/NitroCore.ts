import { AssetManager } from './asset/AssetManager';
import { IAssetManager } from './asset/IAssetManager';
import { CommunicationManager } from './communication/CommunicationManager';
import { ICommunicationManager } from './communication/ICommunicationManager';
import { INitroCore } from './INitroCore';

export class NitroCore implements INitroCore
{
    private _asset: IAssetManager;
    private _communication: ICommunicationManager;

    constructor()
    {
        this._asset         = new AssetManager();
        this._communication = new CommunicationManager();
    }

    public dispose(): void
    {
        if(this._asset)
        {
            this._asset.dispose();

            this._asset = null;
        }

        if(this._communication)
        {
            this._communication.dispose();

            this._communication = null;
        }
    }

    public get asset(): IAssetManager
    {
        return this._asset;
    }

    public get communication(): ICommunicationManager
    {
        return this._communication;
    }
}