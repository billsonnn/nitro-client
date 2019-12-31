import { Parser } from 'xml2js';
import { NitroManager } from '../../core/common/NitroManager';
import { NitroConfiguration } from '../../NitroConfiguration';
import { AvatarFigureContainer } from './AvatarFigureContainer';
import { AvatarImage } from './AvatarImage';
import { AvatarStructure } from './AvatarStructure';
import { AvatarLibraryManager } from './library/AvatarLibraryManager';

export class AvatarManager extends NitroManager
{
    private _libraryManager: AvatarLibraryManager;
    private _structure: AvatarStructure;

    constructor()
    {
        super();

        this._libraryManager    = new AvatarLibraryManager();
        this._structure         = new AvatarStructure(this);
    }

    public onInit(): void
    {
        this.loadFigureMap();
        
        this.loadActions();
        
        this.loadPartSets();
        
        this.loadAnimations();
        
        this.loadFigureData();
    }

    public onDispose(): void
    {
        this._libraryManager = null;
        
        if(this._structure)
        {
            this._structure.dispose();

            this._structure = null;
        }
    }

    public createAvatarImage(figure: string): AvatarImage
    {
        if(!this._structure) return null;

        const figureContainer = new AvatarFigureContainer(this, figure);

        if(!figureContainer) return null;

        return new AvatarImage(this._structure, figureContainer);
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

                    this._libraryManager.parseFigureMap(results.map);
                });
            }

            request.onerror = e => { throw new Error('invalid_figure_map'); };
        }

        catch(e) { this.logger.error(e); }
    }

    private loadActions(): void
    {
        const request = new XMLHttpRequest();

        try
        {
            request.open('GET', NitroConfiguration.ASSET_URL + '/gamedata/HabboAvatarActions.xml');

            request.send();

            request.onloadend = e =>
            {
                const parser = new Parser();

                parser.parseString(request.responseText, (err: Error, results: any) =>
                {
                    if(err || !results || !results.actions) throw new Error('invalid_actions');

                    if(this._structure) this._structure.setAvatarActionManager(results.actions);
                });
            }

            request.onerror = e => { throw new Error('invalid_actions'); };
        }

        catch(e) { this.logger.error(e); }
    }

    private loadPartSets(): void
    {
        const request = new XMLHttpRequest();

        try
        {
            request.open('GET', NitroConfiguration.ASSET_URL + '/gamedata/HabboAvatarPartSets.xml');

            request.send();

            request.onloadend = e =>
            {
                const parser = new Parser();

                parser.parseString(request.responseText, (err: Error, results: any) =>
                {
                    if(err || !results || !results.partSets) throw new Error('invalid_part_sets');

                    if(this._structure) this._structure.parsePartSetsData(results.partSets);
                });
            }

            request.onerror = e => { throw new Error('invalid_part_sets'); };
        }

        catch(e) { this.logger.error(e); }
    }

    private loadAnimations(): void
    {
        const request = new XMLHttpRequest();

        try
        {
            request.open('GET', NitroConfiguration.ASSET_URL + '/gamedata/HabboAvatarAnimations.xml');

            request.send();

            request.onloadend = e =>
            {
                const parser = new Parser();

                parser.parseString(request.responseText, (err: Error, results: any) =>
                {
                    if(err || !results || !results.animationSet) throw new Error('invalid_animations');

                    if(this._structure) this._structure.parseAnimationData(results.animationSet);
                });
            }

            request.onerror = e => { throw new Error('invalid_animations'); };
        }

        catch(e) { this.logger.error(e); }
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
                const parser = new Parser();

                parser.parseString(request.responseText, (err: Error, results: any) =>
                {
                    if(err || !results || !results.figuredata) throw new Error('invalid_figure_data');

                    if(this._structure) this._structure.parseFigureSetData(results.figuredata);
                });
            }

            request.onerror = e => { throw new Error('invalid_figure_data'); };
        }

        catch(e) { this.logger.error(e); }
    }

    public get libraryManager(): AvatarLibraryManager
    {
        return this._libraryManager;
    }

    public get structure(): AvatarStructure
    {
        return this._structure;
    }
}