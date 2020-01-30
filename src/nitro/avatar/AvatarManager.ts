import * as PIXI from 'pixi.js-legacy';
import { Parser } from 'xml2js';
import { NitroManager } from '../../core/common/NitroManager';
import { NitroConfiguration } from '../../NitroConfiguration';
import { Direction } from '../../room/utils/Direction';
import { AvatarAction } from './actions/AvatarAction';
import { AvatarFigureContainer } from './AvatarFigureContainer';
import { AvatarImage } from './AvatarImage';
import { AvatarStructure } from './AvatarStructure';
import { AvatarLibraryManager } from './library/AvatarLibraryManager';
import { AvatarBodyPart } from './structure/AvatarBodyPart';

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

    public renderAvatar(figure: string, rotation: number = 0, headRotation: number = 0): PIXI.Renderer
    {
        if(!figure) return null;

        const image = this.createAvatarImage(figure);

        if(!image) return null;

        const tempRender = PIXI.autoDetectRenderer({
            clearBeforeRender: false,
            transparent: true
        });

        tempRender.resize(80, 110);

        image.appendAction(AvatarAction.POSTURE, AvatarAction.POSTURE_STAND);

        image.updateActions();

        image.figure.sortParts(AvatarAction.POSTURE_STAND, rotation);

        const parts     = image.figure.figureParts;
        const actions   = image.validatedActions;

        if(!parts || !parts.length || !actions || !actions.length) return;

        let left    = 0;
        let right   = 0;
        let top     = 0;
        let bottom  = 0;

        const sprites: PIXI.Sprite[] = [];

        for(let [ index, part ] of parts.entries())
        {
            if(!part) continue;

            let partId              = part.id;
            let bodyPart            = part.type;
            let direction           = AvatarBodyPart.HEAD_PARTS.indexOf(bodyPart) >= 0 ? headRotation : rotation;
            let assetPartDefinition = AvatarAction.POSTURE_STAND;
            let flipH               = false;

            if(direction === Direction.NORTH_WEST && (bodyPart === AvatarBodyPart.FACE || bodyPart === AvatarBodyPart.EYES)) continue;

            const partDefinition = this._structure.getPartDefinition(bodyPart);

            if(!partDefinition) continue;

            for(let action of actions)
            {
                if(!action) continue;

                const activePartSet = this._structure.getActivePartSet(action.definition.activePartSet);

                if(!activePartSet || activePartSet.parts.indexOf(bodyPart) === -1) continue;

                if(action.definition.assetPartDefinition) assetPartDefinition = action.definition.assetPartDefinition;

                if(action.definition.preventHeadTurn && bodyPart === AvatarBodyPart.HEAD) direction = rotation;

                if(action.actionType === AvatarAction.POSTURE_LAY) direction = direction === Direction.NORTH ? Direction.SOUTH : Direction.EAST;

                break;
            }

            const isFlipped = direction >= Direction.SOUTH && direction <= Direction.WEST;

            if(isFlipped)
            {
                if((assetPartDefinition === 'wav' && (bodyPart === AvatarBodyPart.LEFT_HAND || bodyPart === AvatarBodyPart.LEFT_SLEEVE || bodyPart === AvatarBodyPart.LEFT_COAT_SLEEVE)) || (assetPartDefinition === 'drk' && (bodyPart === AvatarBodyPart.RIGHT_HAND || bodyPart === AvatarBodyPart.RIGHT_SLEEVE || bodyPart === AvatarBodyPart.RIGHT_COAT_SLEEVE)) || (assetPartDefinition === 'blw' && bodyPart === AvatarBodyPart.RIGHT_HAND) || ((assetPartDefinition === 'sig' || assetPartDefinition === 'respect') && bodyPart === AvatarBodyPart.LEFT_HAND) || bodyPart === AvatarBodyPart.RIGHT_HAND_ITEM || bodyPart === AvatarBodyPart.LEFT_HAND_ITEM || bodyPart === AvatarBodyPart.CHEST_PRINT) flipH = true;
                
                else
                {
                    if(direction === Direction.SOUTH) direction = Direction.EAST;

                    else if(direction === Direction.SOUTH_WEST) direction = Direction.NORTH_EAST;
                    
                    else if(direction === Direction.WEST) direction = Direction.NORTH;

                    if(partDefinition.flippedSetType) bodyPart = partDefinition.flippedSetType;
                }
            }

            let library = part.library;

            const asset: any = null;

           // const asset = NitroInstance.instance.core.asset.getAsset(library);

            if(!asset) continue;

            let assetName = this.getSpriteAssetName(library, assetPartDefinition, bodyPart, partId, direction, 0);
            let assetData = asset.assets[assetName];

            if(!assetData)
            {
                assetName = this.getSpriteAssetName(library, 'std', bodyPart, partId, direction, 0);
                assetData = asset.assets[assetName];

                if(!assetData) continue;
            }

            let sourceName = assetName;

            if(assetData.source) sourceName = library + '_' + assetData.source;
    
            if(!sourceName) continue;
    
            const sprite = PIXI.Sprite.from(sourceName + '.png');
    
            if(!sprite) continue;

            if(bodyPart === AvatarBodyPart.EYES)
            {
                sprite.tint = 0xFFFFFF;
            }
            else
            {
                const color = image.figure.getColorForPart(partId, bodyPart);
            
                if(color) sprite.tint = color;
            }
            
            sprite.x        = -assetData.x;
            sprite.y        = -assetData.y;
            sprite.visible  = true;

            if(!(isFlipped && flipH) && (isFlipped || flipH))
            {
                sprite.scale.x  = -1;
                sprite.x *= -1;

                //sprite.x += NitroConfiguration.TILE_REAL_WIDTH + 3;
            }
            else
            {
                sprite.scale.x = 1;
            }

            if(index === 0)
            {
                top     = sprite.y + sprite.height;
                bottom  = sprite.y;
                left    = sprite.x;
                right   = sprite.x + sprite.width;
            }
            else
            {
                if(sprite.x < left) left = sprite.x;
                if((sprite.x + sprite.width) > right) right = sprite.x + sprite.width;
                if((sprite.y + sprite.height) > top) top = sprite.y + sprite.height;
                if(sprite.y < bottom) bottom = sprite.y;
            }

            sprites.push(sprite);
        }

        const width     = Math.abs(left - right);
        const height    = Math.abs(top - bottom);

        tempRender.resize(width, height);

        for(let sprite of sprites)
        {
            if(!sprite) continue;

            if(left < 0)
            {
                sprite.x += Math.abs(left) + (NitroConfiguration.TILE_WIDTH / 2)
            }

            if(bottom < 0)
            {
                sprite.y += Math.abs(bottom);
            }

            tempRender.render(sprite);
        }

        return tempRender;
    }

    private getSpriteAssetName(library: string, action: string, bodyPart: string, partId: number = 1, direction: number = 0, frame: number = 0): string
    {
        return `${ library }_h_${ action }_${ bodyPart }_${ partId }_${ direction }_${ frame }`;
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