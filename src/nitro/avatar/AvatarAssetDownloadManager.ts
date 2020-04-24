import { Parser } from 'xml2js';
import { IAssetManager } from '../../core/asset/IAssetManager';
import { NitroLogger } from '../../core/common/logger/NitroLogger';
import { EventDispatcher } from '../../core/events/EventDispatcher';
import { NitroEvent } from '../../core/events/NitroEvent';
import { NitroConfiguration } from '../../NitroConfiguration';
import { AvatarAssetDownloadLibrary } from './AvatarAssetDownloadLibrary';
import { AvatarStructure } from './AvatarStructure';
import { AvatarRenderEvent } from './events/AvatarRenderEvent';
import { AvatarRenderLibraryEvent } from './events/AvatarRenderLibraryEvent';
import { IAvatarFigureContainer } from './IAvatarFigureContainer';
import { IAvatarImageListener } from './IAvatarImageListener';

export class AvatarAssetDownloadManager extends EventDispatcher
{
    public static DOWNLOADER_READY: string  = 'AADM_DOWNLOADER_READY';
    public static LIBRARY_LOADED: string    = 'AADM_LIBRARY_LOADED';

    private static MAX_DOWNLOADS: number    = 2;

    private _assets: IAssetManager;
    private _structure: AvatarStructure;

    private _figureMap: Map<string, AvatarAssetDownloadLibrary[]>;
    private _pendingContainers: [ IAvatarFigureContainer, IAvatarImageListener ][];
    private _figureListeners: Map<string, IAvatarImageListener[]>;
    private _incompleteFigures: Map<string, AvatarAssetDownloadLibrary[]>;
    private _pendingDownloadQueue: AvatarAssetDownloadLibrary[];
    private _currentDownloads: AvatarAssetDownloadLibrary[];
    private _isReady: boolean;

    constructor(assets: IAssetManager, structure: AvatarStructure)
    {
        super();

        this._assets                = assets;
        this._structure             = structure;

        this._figureMap             = new Map();
        this._pendingContainers     = [];
        this._figureListeners       = new Map();
        this._incompleteFigures     = new Map();
        this._pendingDownloadQueue  = [];
        this._currentDownloads      = [];
        this._isReady               = false;

        this.loadFigureMap();

        this._structure.renderManager.events.addEventListener(AvatarRenderEvent.AVATAR_RENDER_READY, this.onAvatarRenderReady.bind(this));
    }

    private loadFigureMap(): void
    {
        const request = new XMLHttpRequest();

        try
        {
            request.open('GET', NitroConfiguration.ASSET_URL + '/gamedata/figuremap.xml');

            request.send();

            request.onloadend = e =>
            {
                const parser = new Parser();

                parser.parseString(request.responseText, (err: Error, results: any) =>
                {
                    if(err || !results || !results.map) throw new Error('invalid_figure_map');

                    this.processFigureMap(results.map);

                    this._isReady = true;

                    this.dispatchEvent(new NitroEvent(AvatarAssetDownloadManager.DOWNLOADER_READY));
                });
            }

            request.onerror = e => { throw new Error('invalid_avatar_figure_map'); };
        }

        catch(e)
        {
            NitroLogger.log(e);
        }
    }

    private processFigureMap(data: any): void
    {
        if(!data) return;
        
        if(data.lib)
        {
            for(let library of data.lib)
            {
                if(!library) continue;

                const id        = library['$'].id;
                const revision  = library['$'].revision;

                const downloadLibrary = new AvatarAssetDownloadLibrary(id, revision, this._assets, NitroConfiguration.ASSET_AVATAR_URL);

                downloadLibrary.addEventListener(AvatarRenderLibraryEvent.DOWNLOAD_COMPLETE, this.onLibraryLoaded.bind(this));

                if(library.part)
                {
                    for(let part of library.part)
                    {
                        const partString = ((part['$'].type) + ':' + (part['$'].id));

                        let existing = this._figureMap.get(partString);

                        if(!existing) existing = [];
                        
                        existing.push(downloadLibrary);

                        this._figureMap.set(partString, existing);
                    }
                }
            }
        }
    }

    private onAvatarRenderReady(event: NitroEvent): void
    {
        if(!event) return;

        for(let [ container, listener ] of this._pendingContainers)
        {
            this.downloadAvatarFigure(container, listener);
        }

        this._pendingContainers = [];
    }

    private onLibraryLoaded(event: AvatarRenderLibraryEvent): void
    {
        if(!event || !event.library) return;

        const loadedFigures: string[] = [];

        for(let [ figure, libraries ] of this._incompleteFigures.entries())
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
                loadedFigures.push(figure);

                const listeners = this._figureListeners.get(figure);

                for(let listener of listeners)
                {
                    if(!listener || listener.isDisposed) continue;

                    listener.resetFigure(figure);
                }

                this._figureListeners.delete(figure);

                this.dispatchEvent(new NitroEvent(AvatarAssetDownloadManager.LIBRARY_LOADED));
            }
        }

        for(let figure of loadedFigures)
        {
            if(!figure) continue;

            this._incompleteFigures.delete(figure);
        }

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

    public isAvatarFigureContainerReady(container: IAvatarFigureContainer): boolean
    {
        if(!this._isReady || !this._structure.renderManager.isReady)
        {
            return false;
        }

        const pendingLibraries = this.getAvatarFigurePendingLibraries(container);

        return !pendingLibraries.length;
    }

    private getAvatarFigurePendingLibraries(container: IAvatarFigureContainer): AvatarAssetDownloadLibrary[]
    {
        const pendingLibraries: AvatarAssetDownloadLibrary[] = [];

        if(!container || !this._structure) return pendingLibraries;

        const figureData = this._structure.figureData;

        if(!figureData) return pendingLibraries;

        const setKeys = container._Str_1016();

        for(let key of setKeys)
        {
            const set = figureData._Str_740(key);

            if(!set) continue;

            const figurePartSet = set._Str_1020(container.getPartSetId(key));

            if(!figurePartSet) continue;

            for(let part of figurePartSet._Str_806)
            {
                if(!part) continue;

                const name      = (part.type + ':' + part.id);
                const existing  = this._figureMap.get(name);

                if(existing === undefined) continue;

                for(let library of existing)
                {
                    if(!library || library.isLoaded) continue;

                    if(pendingLibraries.indexOf(library) >= 0) continue;

                    pendingLibraries.push(library);
                }
            }
        }

        return pendingLibraries;
    }

    public downloadAvatarFigure(container: IAvatarFigureContainer, listener: IAvatarImageListener): void
    {
        if(!this._isReady || !this._structure.renderManager.isReady)
        {
            this._pendingContainers.push([ container, listener ]);

            return;
        }

        const figure            = container._Str_1008();
        const pendingLibraries  = this.getAvatarFigurePendingLibraries(container);

        if(pendingLibraries && pendingLibraries.length)
        {
            if(listener && !listener.isDisposed)
            {
                let listeners = this._figureListeners.get(figure);

                if(!listeners) listeners = [];

                listeners.push(listener);

                this._figureListeners.set(figure, listeners);
            }

            this._incompleteFigures.set(figure, pendingLibraries);

            for(let library of pendingLibraries)
            {
                if(!library) continue;

                this.downloadLibrary(library);
            }
        }
        else
        {
            if(listener && !listener.isDisposed) listener.resetFigure(figure);
        }
    }

    private downloadLibrary(library: AvatarAssetDownloadLibrary): void
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