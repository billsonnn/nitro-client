import { Parser } from 'xml2js';
import { IAssetManager } from '../../core/asset/IAssetManager';
import { NitroManager } from '../../core/common/NitroManager';
import { NitroEvent } from '../../core/events/NitroEvent';
import { NitroConfiguration } from '../../NitroConfiguration';
import { NitroInstance } from '../NitroInstance';
import { AssetAliasCollection } from './alias/AssetAliasCollection';
import { AvatarAssetDownloadManager } from './AvatarAssetDownloadManager';
import { AvatarFigureContainer } from './AvatarFigureContainer';
import { AvatarImage } from './AvatarImage';
import { AvatarStructure } from './AvatarStructure';
import { EffectAssetDownloadManager } from './EffectAssetDownloadManager';
import { AvatarRenderEvent } from './events/AvatarRenderEvent';
import { IAvatarEffectListener } from './IAvatarEffectListener';
import { IAvatarImage } from './IAvatarImage';
import { IAvatarImageListener } from './IAvatarImageListener';
import { IAvatarRenderManager } from './IAvatarRenderManager';
import { PlaceHolderAvatarImage } from './PlaceHolderAvatarImage';
import { AvatarStructureDownload } from './structure/AvatarStructureDownload';

export class AvatarRenderManager extends NitroManager implements IAvatarRenderManager
{
    private static DEFAULT_FIGURE: string = 'hd-99999-99999';

    private _aliasCollection: AssetAliasCollection;

    private _structure: AvatarStructure;
    private _avatarAssetDownloadManager: AvatarAssetDownloadManager;
    private _effectAssetDownloadManager: EffectAssetDownloadManager;

    private _placeHolderFigure: AvatarFigureContainer;

    private _figureMapReady: boolean;
    private _effectMapReady: boolean;
    private _actionsReady: boolean;
    private _structureReady: boolean;
    private _geometryReady: boolean;
    private _partSetsReady: boolean;
    private _animationsReady: boolean;
    private _isReady: boolean;

    constructor()
    {
        super();

        this._structure                     = null;
        this._avatarAssetDownloadManager    = null;

        this._placeHolderFigure             = null;

        this._figureMapReady                = false;
        this._effectMapReady                = false;
        this._actionsReady                  = false;
        this._geometryReady                 = false;
        this._partSetsReady                 = false;
        this._animationsReady               = false;
        this._isReady                       = false;
    }

    public onInit(): void
    {
        this._structure = new AvatarStructure(this);

        this.loadGeometry();
        this.loadPartSets();
        this.loadActions();
        this.loadAnimations();
        this.loadFigureData();

        this._aliasCollection = new AssetAliasCollection(this, NitroInstance.instance.core.asset);

        this._aliasCollection.init();

        if(!this._avatarAssetDownloadManager)
        {
            this._avatarAssetDownloadManager = new AvatarAssetDownloadManager(NitroInstance.instance.core.asset, this._structure);

            this._avatarAssetDownloadManager.addEventListener(AvatarAssetDownloadManager.DOWNLOADER_READY, this.onAvatarAssetDownloaderReady.bind(this));

            this._avatarAssetDownloadManager.addEventListener(AvatarAssetDownloadManager.LIBRARY_LOADED, this.onAvatarAssetDownloaded.bind(this));
        }

        if(!this._effectAssetDownloadManager)
        {
            this._effectAssetDownloadManager = new EffectAssetDownloadManager(NitroInstance.instance.core.asset, this._structure);

            this._effectAssetDownloadManager.addEventListener(EffectAssetDownloadManager.DOWNLOADER_READY, this.onEffectAssetDownloaderReady.bind(this));

            this._effectAssetDownloadManager.addEventListener(EffectAssetDownloadManager.LIBRARY_LOADED, this.onEffectAssetDownloaded.bind(this));
        }

        this.checkReady();
    }

    public onDispose(): void
    {
        if(this._avatarAssetDownloadManager)
        {
            this._avatarAssetDownloadManager.removeEventListener(AvatarAssetDownloadManager.DOWNLOADER_READY, this.onAvatarAssetDownloaderReady.bind(this));

            this._avatarAssetDownloadManager.removeEventListener(AvatarAssetDownloadManager.LIBRARY_LOADED, this.onAvatarAssetDownloaded.bind(this));
        }

        if(this._effectAssetDownloadManager)
        {
            this._effectAssetDownloadManager.removeEventListener(EffectAssetDownloadManager.DOWNLOADER_READY, this.onEffectAssetDownloaderReady.bind(this));

            this._effectAssetDownloadManager.removeEventListener(EffectAssetDownloadManager.LIBRARY_LOADED, this.onEffectAssetDownloaded.bind(this));
        }
    }

    private loadGeometry(): void
    {
        const request = new XMLHttpRequest();

        try
        {
            request.open('GET', NitroConfiguration.AVATAR_GEOMETRY_URL);

            request.send();

            request.onloadend = e =>
            {
                if(!this._structure) return;

                this._structure._Str_1825(JSON.parse(request.responseText).geometry);

                this._geometryReady = true;

                this.checkReady();
            }

            request.onerror = e => { throw new Error('invalid_avatar_geometry'); };
        }

        catch(e)
        {
            this.logger.error(e);
        }
    }

    private loadPartSets(): void
    {
        const request = new XMLHttpRequest();

        try
        {
            request.open('GET', NitroConfiguration.AVATAR_PARTSETS_URL);

            request.send();

            request.onloadend = e =>
            {
                if(!this._structure) return;

                this._structure._Str_1296(JSON.parse(request.responseText).partSets);

                this._partSetsReady = true;

                this.checkReady();
            }

            request.onerror = e => { throw new Error('invalid_avatar_part_sets'); };
        }

        catch(e)
        {
            this.logger.error(e);
        }
    }

    private loadActions(): void
    {
        const defaultActions = NitroConfiguration.AVATAR_DEFAULT_ACTIONS;

        if(defaultActions) this._structure._Str_1060(NitroInstance.instance.core.asset, defaultActions);

        const request = new XMLHttpRequest();

        try
        {
            request.open('GET', NitroConfiguration.AVATAR_ACTIONS_URL);

            request.send();

            request.onloadend = e =>
            {
                if(!this._structure) return;

                this._structure._Str_1620(JSON.parse(request.responseText));

                this._actionsReady = true;

                this.checkReady();
            }

            request.onerror = e => { throw new Error('invalid_avatar_actions'); };
        }

        catch(e)
        {
            this.logger.error(e);
        }
    }

    private loadAnimations(): void
    {
        const request = new XMLHttpRequest();

        try
        {
            request.open('GET', NitroConfiguration.AVATAR_ANIMATIONS_URL);

            request.send();

            request.onloadend = e =>
            {
                if(!this._structure) return;

                this._structure._Str_2229(JSON.parse(request.responseText));

                this._animationsReady = true;

                this.checkReady();
            }

            request.onerror = e => { throw new Error('invalid_avatar_animations'); };
        }

        catch(e)
        {
            this.logger.error(e);
        }
    }

    private loadFigureData(): void
    {
        const defaultFigureData = NitroConfiguration.AVATAR_DEFAULT_FIGUREDATA;

        if(defaultFigureData)
        {
            const parser = new Parser();

            parser.parseString(defaultFigureData, (err: Error, results: any) =>
            {
                if(err || !results || !results.figuredata) throw new Error('invalid_default_figure_data');

                if(this._structure) this._structure._Str_1569(results.figuredata);
            });
        }

        const structureDownloader = new AvatarStructureDownload(NitroConfiguration.AVATAR_FIGUREDATA_URL, this._structure.figureData);

        structureDownloader.addEventListener(AvatarStructureDownload.AVATAR_STRUCTURE_DONE, this.onAvatarStructureDownloadDone.bind(this));
    }

    private onAvatarStructureDownloadDone(event: NitroEvent): void
    {
        this._structureReady = true;

        this._structure.init();

        this.checkReady();
    }

    private onAvatarAssetDownloaderReady(event: NitroEvent): void
    {
        if(!event) return;

        this._figureMapReady = true;

        this.checkReady();
    }

    private onAvatarAssetDownloaded(event: NitroEvent): void
    {
        if(!event) return;

        this._aliasCollection.reset();
    }

    private onEffectAssetDownloaderReady(event: NitroEvent): void
    {
        if(!event) return;

        this._effectMapReady = true;

        this.checkReady();
    }

    private onEffectAssetDownloaded(event: NitroEvent): void
    {
        if(!event) return;

        this._aliasCollection.reset();
    }

    private checkReady(): void
    {
        if(this._isReady) return;

        if(!this._geometryReady || !this._partSetsReady || !this._actionsReady || !this._animationsReady || !this._figureMapReady || !this._effectMapReady || !this._structureReady) return;

        this._isReady = true;

        if(this.events) this.events.dispatchEvent(new NitroEvent(AvatarRenderEvent.AVATAR_RENDER_READY));
    }

    public createAvatarImage(figure: string, size: string, gender: string, listener: IAvatarImageListener = null, effectListener: IAvatarEffectListener = null): IAvatarImage
    {
        if(!this._structure || !this._avatarAssetDownloadManager) return null;

        const figureContainer = new AvatarFigureContainer(figure);

        if(gender) this.validateAvatarFigure(figureContainer, gender);

        if(this._avatarAssetDownloadManager.isAvatarFigureContainerReady(figureContainer))
        {
            return new AvatarImage(this._structure, this._aliasCollection, figureContainer, size, this._effectAssetDownloadManager, effectListener);
        }

        if(!this._placeHolderFigure) this._placeHolderFigure = new AvatarFigureContainer(AvatarRenderManager.DEFAULT_FIGURE);

        this._avatarAssetDownloadManager.downloadAvatarFigure(figureContainer, listener);

        return new PlaceHolderAvatarImage(this._structure, this._aliasCollection, this._placeHolderFigure, size, this._effectAssetDownloadManager);
    }

    private validateAvatarFigure(container: AvatarFigureContainer, gender: string): boolean
    {
        let isValid = false;

        const typeIds = this._structure._Str_1733(gender, 2);

        if(typeIds)
        {
            const figureData = this._structure.figureData;

            for(let id of typeIds)
            {
                if(!container._Str_744(id))
                {
                    const figurePartSet = this._structure._Str_2264(id, gender);

                    if(figurePartSet)
                    {
                        container._Str_830(id, figurePartSet.id, [0]);

                        isValid = true;
                    }
                }
                else
                {
                    const setType = figureData._Str_740(id);

                    if(setType)
                    {
                        const figurePartSet = setType._Str_1020(container.getPartSetId(id));

                        if(!figurePartSet)
                        {
                            const partSet = this._structure._Str_2264(id, gender);

                            if(partSet)
                            {
                                container._Str_830(id, partSet.id, [0]);

                                isValid = true;
                            }
                        }
                    }
                }
            }
        }

        return !(isValid);
    }

    public get assets(): IAssetManager
    {
        return NitroInstance.instance.core.asset;
    }

    public get isReady(): boolean
    {
        return this._isReady;
    }
}