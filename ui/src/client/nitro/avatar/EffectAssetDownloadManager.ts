import { IAssetManager } from '../../core/asset/IAssetManager';
import { NitroLogger } from '../../core/common/logger/NitroLogger';
import { EventDispatcher } from '../../core/events/EventDispatcher';
import { NitroEvent } from '../../core/events/NitroEvent';
import { NitroConfiguration } from '../../NitroConfiguration';
import { AvatarStructure } from './AvatarStructure';
import { EffectAssetDownloadLibrary } from './EffectAssetDownloadLibrary';
import { AvatarRenderEffectLibraryEvent } from './events/AvatarRenderEffectLibraryEvent';
import { AvatarRenderEvent } from './events/AvatarRenderEvent';
import { IAvatarEffectListener } from './IAvatarEffectListener';

export class EffectAssetDownloadManager extends EventDispatcher
{
    public static DOWNLOADER_READY: string  = 'EADM_DOWNLOADER_READY';
    public static LIBRARY_LOADED: string    = 'EADM_LIBRARY_LOADED';

    private static MAX_DOWNLOADS: number    = 2;

    private _assets: IAssetManager;
    private _structure: AvatarStructure;

    private _missingMandatoryLibs: string[];
    private _effectMap: Map<string, EffectAssetDownloadLibrary[]>;
    private _initDownloadBuffer: [ number, IAvatarEffectListener][];
    private _effectListeners: Map<string, IAvatarEffectListener[]>;
    private _incompleteEffects: Map<string, EffectAssetDownloadLibrary[]>;
    private _pendingDownloadQueue: EffectAssetDownloadLibrary[];
    private _currentDownloads: EffectAssetDownloadLibrary[];
    private _libraryNames: string[];
    private _isReady: boolean;

    constructor(assets: IAssetManager, structure: AvatarStructure)
    {
        super();

        this._assets                = assets;
        this._structure             = structure;

        this._missingMandatoryLibs  = NitroConfiguration.MANDATORY_EFFECT_LIBRARIES;
        this._effectMap             = new Map();
        this._effectListeners       = new Map();
        this._incompleteEffects     = new Map();
        this._initDownloadBuffer    = [];
        this._pendingDownloadQueue  = [];
        this._currentDownloads      = [];
        this._libraryNames          = [];
        this._isReady               = false;

        this.loadEffectMap();

        this._structure.renderManager.events.addEventListener(AvatarRenderEvent.AVATAR_RENDER_READY, this.onAvatarRenderReady.bind(this));
    }

    private loadEffectMap(): void
    {
        const request = new XMLHttpRequest();

        try
        {
            request.open('GET', NitroConfiguration.AVATAR_EFFECTMAP_URL);

            request.send();

            request.onloadend = e =>
            {
                if(request.responseText)
                {
                    const data = JSON.parse(request.responseText);

                    this.processEffectMap(data.effects);

                    this.processMissingLibraries();

                    this._isReady = true;

                    this.dispatchEvent(new NitroEvent(EffectAssetDownloadManager.DOWNLOADER_READY));
                }
            }

            request.onerror = e => { throw new Error('invalid_avatar_effect_map'); };
        }

        catch(e)
        {
            NitroLogger.log(e);
        }
    }

    private processEffectMap(data: any): void
    {
        if(!data) return;

        for(let effect of data)
        {
            if(!effect) continue;

            const id        = (effect.id as string);
            const lib       = (effect.lib as string);
            const revision  = (effect.revision as number);

            if(this._libraryNames.indexOf(lib) >= 0) continue;

            this._libraryNames.push(lib);

            const downloadLibrary = new EffectAssetDownloadLibrary(lib, revision, this._assets, NitroConfiguration.AVATAR_ASSET_EFFECT_URL);

            downloadLibrary.addEventListener(AvatarRenderEffectLibraryEvent.DOWNLOAD_COMPLETE, this.onLibraryLoaded.bind(this));

            let existing = this._effectMap.get(id);

            if(!existing) existing = [];

            existing.push(downloadLibrary);

            this._effectMap.set(id, existing);
        }
    }

    public downloadAvatarEffect(id: number, listener: IAvatarEffectListener): void
    {
        if(!this._isReady || !this._structure.renderManager.isReady)
        {
            this._initDownloadBuffer.push([ id, listener ]);

            return;
        }

        const pendingLibraries = this.getAvatarEffectPendingLibraries(id);

        if(pendingLibraries && pendingLibraries.length)
        {
            if(listener && !listener.disposed)
            {
                let listeners = this._effectListeners.get(id.toString());

                if(!listeners) listeners = [];

                listeners.push(listener);

                this._effectListeners.set(id.toString(), listeners);
            }

            this._incompleteEffects.set(id.toString(), pendingLibraries);

            for(let library of pendingLibraries)
            {
                if(!library) continue;

                this.downloadLibrary(library);
            }
        }
        else
        {
            if(listener && !listener.disposed) listener.resetEffect(id);
        }
    }

    private onAvatarRenderReady(event: NitroEvent): void
    {
        if(!event) return;

        for(let [ id, listener ] of this._initDownloadBuffer)
        {
            this.downloadAvatarEffect(id, listener);
        }

        this._initDownloadBuffer = [];
    }

    private onLibraryLoaded(event: AvatarRenderEffectLibraryEvent): void
    {
        if(!event || !event.library) return;

        const loadedEffects: string[] = [];

        this._structure._Str_2061(event.library.animation);

        for(let [ id, libraries ] of this._incompleteEffects.entries())
        {
            let isReady = true;

            for(let library of libraries)
            {
                if(!library || library.isLoaded) continue;

                isReady = false;

                break;
            }

            if(isReady)
            {
                loadedEffects.push(id);

                const listeners = this._effectListeners.get(id);

                for(let listener of listeners)
                {
                    if(!listener || listener.disposed) continue;

                    listener.resetEffect(parseInt(id));
                }

                this._effectListeners.delete(id);

                this.dispatchEvent(new NitroEvent(EffectAssetDownloadManager.LIBRARY_LOADED));
            }
        }

        for(let id of loadedEffects) this._incompleteEffects.delete(id);

        let index = 0;

        while(index < this._currentDownloads.length)
        {
            const download = this._currentDownloads[index];

            if(download)
            {
                if(download.libraryName === event.library.libraryName) this._currentDownloads.splice(index, 1);
            }

            index++;
        }
    }

    public processMissingLibraries(): void
    {
        const libraries = this._missingMandatoryLibs.slice();

        for(let library of libraries)
        {
            if(!library) continue;

            const map = this._effectMap.get(library);

            if(map) for(let effect of map) effect && this.downloadLibrary(effect);
        }
    }

    public isAvatarEffectReady(effect: number): boolean
    {
        if(!this._isReady || !this._structure.renderManager.isReady)
        {
            return false;
        }

        const pendingLibraries = this.getAvatarEffectPendingLibraries(effect);

        return !pendingLibraries.length;
    }

    private getAvatarEffectPendingLibraries(id: number): EffectAssetDownloadLibrary[]
    {
        let pendingLibraries: EffectAssetDownloadLibrary[] = [];

        if(!this._structure) return pendingLibraries;

        var libraries = this._effectMap.get(id.toString());

        if(libraries)
        {
            for(let library of libraries)
            {
                if(!library || library.isLoaded) continue;

                if(pendingLibraries.indexOf(library) === -1) pendingLibraries.push(library);
            }
        }

        return pendingLibraries;
    }

    private downloadLibrary(library: EffectAssetDownloadLibrary): void
    {
        if(!library || library.isLoaded) return;

        if((this._pendingDownloadQueue.indexOf(library) >= 0) || (this._currentDownloads.indexOf(library) >= 0)) return;

        this._pendingDownloadQueue.push(library);

        this.processDownloadQueue();
    }

    private processDownloadQueue(): void
    {
        while(this._pendingDownloadQueue.length)
        {
            const library = this._pendingDownloadQueue[0];

            library.downloadAsset();

            this._currentDownloads.push(this._pendingDownloadQueue.shift());
        }
    }
}