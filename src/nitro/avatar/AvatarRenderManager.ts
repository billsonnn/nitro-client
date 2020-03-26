import { Parser } from 'xml2js';
import { NitroManager } from '../../core/common/NitroManager';
import { NitroEvent } from '../../core/events/NitroEvent';
import { NitroConfiguration } from '../../NitroConfiguration';
import { NitroInstance } from '../NitroInstance';
import { AvatarAssetDownloadManager } from './AvatarAssetDownloadManager';
import { AvatarFigureContainer } from './AvatarFigureContainer';
import { AvatarImage } from './AvatarImage';
import { AvatarStructure } from './AvatarStructure';
import { AvatarRenderEvent } from './events/AvatarRenderEvent';
import { IAvatarImage } from './IAvatarImage';
import { IAvatarImageListener } from './IAvatarImageListener';
import { IAvatarRenderManager } from './IAvatarRenderManager';
import { PlaceHolderAvatarImage } from './PlaceHolderAvatarImage';

export class AvatarRenderManager extends NitroManager implements IAvatarRenderManager
{
    private static DEFAULT_FIGURE: string = 'hd-99999-99999';

    private _structure: AvatarStructure;
    private _avatarAssetDownloadManager: AvatarAssetDownloadManager;

    private _placeHolderFigure: AvatarFigureContainer;

    private _geometryReady: boolean;
    private _partSetsReady: boolean;
    private _actionsReady: boolean;
    private _animationsReady: boolean;
    private _figureMapReady: boolean;
    private _effectMapReady: boolean;
    private _isReady: boolean;

    constructor()
    {
        super();

        this._structure                     = null;
        this._avatarAssetDownloadManager    = null;

        this._placeHolderFigure             = null;

        this._geometryReady                 = false;
        this._partSetsReady                 = false;
        this._actionsReady                  = false;
        this._animationsReady               = false;
        this._figureMapReady                = false;
        this._effectMapReady                = true;
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

        if(!this._avatarAssetDownloadManager)
        {
            this._avatarAssetDownloadManager = new AvatarAssetDownloadManager(NitroInstance.instance.core.asset, this._structure);

            this._avatarAssetDownloadManager.addEventListener(AvatarAssetDownloadManager.DOWNLOADER_READY, this.onAvatarAssetDownloaderReady.bind(this));
        }

        this.checkReady();
    }

    private loadGeometry(): void
    {
        const request = new XMLHttpRequest();

        try
        {
            request.open('GET', NitroConfiguration.ASSET_URL + '/gamedata/json/HabboAvatarGeometry.json');

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
            request.open('GET', NitroConfiguration.ASSET_URL + '/gamedata/json/HabboAvatarPartSets.json');

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
        const request = new XMLHttpRequest();

        try
        {
            request.open('GET', NitroConfiguration.ASSET_URL + '/gamedata/json/HabboAvatarActions.json');

            request.send();

            request.onloadend = e =>
            {
                if(!this._structure) return;

                this._structure._Str_1060(null, JSON.parse(request.responseText));

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
            request.open('GET', NitroConfiguration.ASSET_URL + '/gamedata/json/HabboAvatarAnimations.json');

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
        const request = new XMLHttpRequest();

        try
        {
            request.open('GET', NitroConfiguration.ASSET_URL + '/gamedata/figuredata.xml');

            request.send();

            request.onloadend = e =>
            {
                if(!this._structure) return;

                const parser = new Parser();

                parser.parseString(request.responseText, (err: Error, results: any) =>
                {
                    if(err || !results || !results.figuredata) throw new Error('invalid_figure_data');

                    if(this._structure) this._structure._Str_1569(results.figuredata);
                });
            }

            request.onerror = e => { throw new Error('invalid_avatar_figure_data'); };
        }

        catch(e)
        {
            this.logger.error(e);
        }
    }

    private onAvatarAssetDownloaderReady(event: NitroEvent): void
    {
        if(!event) return;

        this._figureMapReady = true;

        this.checkReady();
    }

    private checkReady(): void
    {
        if(this._isReady) return;

        if(!this._geometryReady || !this._partSetsReady || !this._actionsReady || !this._animationsReady || !this._figureMapReady || !this._effectMapReady) return;

        this._isReady = true;

        if(this.events) this.events.dispatchEvent(new NitroEvent(AvatarRenderEvent.AVATAR_RENDER_READY));
    }

    public createAvatarImage(figure: string, size: string, gender: string, listener: IAvatarImageListener): IAvatarImage
    {
        if(!this._structure || !this._avatarAssetDownloadManager) return null;

        const figureContainer = new AvatarFigureContainer(figure);

        if(gender) this.validateAvatarFigure(figureContainer, gender);

        if(this._avatarAssetDownloadManager.isAvatarFigureContainerReady(figureContainer))
        {
            return new AvatarImage(this._structure, NitroInstance.instance.core.asset, figureContainer, size);
        }

        if(!this._placeHolderFigure) this._placeHolderFigure = new AvatarFigureContainer(AvatarRenderManager.DEFAULT_FIGURE);

        this._avatarAssetDownloadManager.downloadAvatarFigure(figureContainer, listener);

        return new PlaceHolderAvatarImage(this._structure, NitroInstance.instance.core.asset, this._placeHolderFigure, size);
    }

    private validateAvatarFigure(container: AvatarFigureContainer, gender: string)
    {
        return true;
    }

    public get isReady(): boolean
    {
        return this._isReady;
    }
}