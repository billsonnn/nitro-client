import { IAssetManager } from '../../core/asset/IAssetManager';
import { EventDispatcher } from '../../core/events/EventDispatcher';
import { AvatarRenderEffectLibraryEvent } from './events/AvatarRenderEffectLibraryEvent';

export class EffectAssetDownloadLibrary extends EventDispatcher
{
    public static DOWNLOAD_COMPLETE: string = 'EADL_DOWNLOAD_COMPLETE';

    private static NOT_LOADED: number       = 0;
    private static LOADING: number          = 1;
    private static LOADED: number           = 2;

    private _state: number;
    private _libraryName: string;
    private _revision: number;
    private _downloadUrl: string;
    private _assets: IAssetManager;
    private _animation: any;

    constructor(id: string, revision: number, assets: IAssetManager, assetUrl: string)
    {
        super();

        this._state         = EffectAssetDownloadLibrary.NOT_LOADED;
        this._libraryName   = id;
        this._revision      = revision;
        this._downloadUrl   = assetUrl;
        this._assets        = assets;
        this._animation     = null;

        this._downloadUrl = this._downloadUrl.replace(/%libname%/gi, this._libraryName);
        this._downloadUrl = this._downloadUrl.replace(/%revision%/gi, this._revision.toString());

        const asset = this._assets.getCollection(this._libraryName);

        if(asset) this._state = EffectAssetDownloadLibrary.LOADED;
    }

    public downloadAsset(): void
    {
        if(!this._assets || (this._state === EffectAssetDownloadLibrary.LOADING) || (this._state === EffectAssetDownloadLibrary.LOADED)) return;

        const asset = this._assets.getCollection(this._libraryName);

        if(asset)
        {
            this._state = EffectAssetDownloadLibrary.LOADED;

            this.dispatchEvent(new AvatarRenderEffectLibraryEvent(AvatarRenderEffectLibraryEvent.DOWNLOAD_COMPLETE, this));

            return;
        }

        this._state = EffectAssetDownloadLibrary.LOADING;

        this._assets.downloadAsset(this._downloadUrl, () =>
        {
            this._state = EffectAssetDownloadLibrary.LOADED;

            const collection = this._assets.getCollection(this._libraryName);

            if(collection)
            {
                //@ts-ignore
                this._animation = collection.data.animations;
            }

            this.dispatchEvent(new AvatarRenderEffectLibraryEvent(AvatarRenderEffectLibraryEvent.DOWNLOAD_COMPLETE, this));
        });
    }

    public get libraryName(): string
    {
        return this._libraryName;
    }

    public get animation(): any
    {
        return this._animation;
    }

    public get isLoaded(): boolean
    {
        return (this._state === EffectAssetDownloadLibrary.LOADED);
    }
}