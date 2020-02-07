import * as PIXI from 'pixi.js-legacy';
import { RoomObjectSpriteType } from '../object/enum/RoomObjectSpriteType';
import { IRoomObject } from '../object/IRoomObject';
import { IRoomObjectSpriteVisualization } from '../object/visualization/IRoomObjectSpriteVisualization';
import { IRoomGeometry } from '../utils/IRoomGeometry';
import { RoomGeometry } from '../utils/RoomGeometry';
import { Vector3d } from '../utils/Vector3d';
import { RoomObjectCache } from './cache/RoomObjectCache';
import { RoomObjectCacheItem } from './cache/RoomObjectCacheItem';
import { IRoomCanvasMouseListener } from './IRoomCanvasMouseListener';
import { IRoomRenderingCanvas } from './IRoomRenderingCanvas';
import { IRoomSpriteCanvasContainer } from './IRoomSpriteCanvasContainer';
import { ExtendedSprite } from './utils/ExtendedSprite';
import { SortableSprite } from './utils/SortableSprite';

export class RoomSpriteCanvas implements IRoomRenderingCanvas
{
    private _id: number;
    private _container: IRoomSpriteCanvasContainer;

    private _geometry: IRoomGeometry;
    private _renderTimestamp: number;

    private _master: PIXI.Container;
    private _display: PIXI.Container;
    private _mask: PIXI.Graphics;

    private _sortableSprites: SortableSprite[];
    private _spriteCount: number;
    private _activeSpriteCount: number;
    private _spritePool: ExtendedSprite[];

    private _width: number;
    private _height: number;
    private _renderedWidth: number;
    private _renderedHeight: number;
    private _screenOffset: PIXI.Point;
    private _scale: number;
    
    private _noSpriteVisibilityChecking: boolean;
    private _usesExclusionRectangles: boolean;
    private _usesMask: boolean;

    private _objectCache: RoomObjectCache;

    private _mouseListener: IRoomCanvasMouseListener;

    constructor(container: IRoomSpriteCanvasContainer, id: number, width: number, height: number, scale: number)
    {
        this._id                            = id;
        this._container                     = container;

        this._geometry                      = new RoomGeometry(scale, new Vector3d(-135, 30, 0), new Vector3d(11, 11, 5), new Vector3d(-135, 0.5, 0));
        this._renderTimestamp               = 0;

        this._master                        = null;
        this._display                       = null;
        this._mask                          = null;

        this._sortableSprites               = [];
        this._spriteCount                   = 0;
        this._activeSpriteCount             = 0;
        this._spritePool                    = [];

        this._width                         = 0;
        this._height                        = 0;
        this._renderedWidth                 = 0;
        this._renderedHeight                = 0;
        this._screenOffset                  = new PIXI.Point();
        this._scale                         = 1;

        this._noSpriteVisibilityChecking    = false;
        this._usesExclusionRectangles       = false;
        this._usesMask                      = true;

        this._objectCache                   = new RoomObjectCache(this._container.roomObjectVariableAccurateZ);

        this._mouseListener                 = null;

        this.setupCanvas();
        this.initialize(width, height);
    }

    private setupCanvas(): void
    {
        if(!this._master) this._master = new PIXI.Container();

        if(!this._display)
        {
            const display = new PIXI.Container();

            display.name        = 'canvas';
            display.interactive = true;

            this._master.addChild(display);

            //this._display.addListener('click', this.click.bind(this));

            this._display = display;
        }
    }

    public dispose(): void
    {
        if(this._master)
        {
            for(let child of this._master.children)
            {
                if(!child) continue;

                this._master.removeChild(child);

                child.destroy();
            }

            this._master.parent.removeChild(this._master);

            this._master.destroy();

            this._master = null;
        }
    }

    public initialize(width: number, height: number): void
    {
        width   = width < 1 ? 1 : width;
        height  = height < 1 ? 1 : height;

        if(this._usesMask)
        {
            if(this._mask)
            {
                this._mask.clear();
            }
            else
            {
                this._mask = new PIXI.Graphics();

                this._mask.name = 'mask';

                if(this._master)
                {
                    this._master.addChild(this._mask);

                    if(this._display) this._display.mask = this._mask;
                }
            }

            this._mask.beginFill(0);
            this._mask.drawRect(0, 0, width, height);
        }

        this._width     = width;
        this._height    = height;
    }

    public render(time: number, update: boolean = false): void
    {
        if(time === -1) time = (this._renderTimestamp + 1);

        if(!this._container || !this._geometry) return;

        if(time === this._renderTimestamp) return;

        if((this._width !== this._renderedWidth) || (this._height !== this._renderedHeight)) update = true;

        if((this._display.x !== this._screenOffset.x) || (this._display.y !== this._screenOffset.y))
        {
            this._display.x = this._screenOffset.x;
            this._display.y = this._screenOffset.y;

            update = true;
        }

        let spriteCount = 0;

        const objects = this._container.objects;

        if(objects.size)
        {
            for(let object of objects.values())
            {
                if(!object) continue;

                if(object.type === 'room') continue;

                spriteCount = (spriteCount + this.renderObject(object, object.instanceId.toString(), time, update, spriteCount));
            }
        }

        this._sortableSprites.sort((a, b) =>
        {
            return b.z - a.z;
        });

        if(spriteCount < this._sortableSprites.length)
        {
            this._sortableSprites.splice(spriteCount);
        }

        let iterator = 0;

        while(iterator < spriteCount)
        {
            const sprite = this._sortableSprites[iterator];

            if(sprite && sprite.sprite) this.renderSprite(iterator, sprite);

            iterator++;
        }

        this._Str_20677(spriteCount);
        this._renderTimestamp   = time;
        this._renderedWidth     = this._width;
        this._renderedHeight    = this._height;
    }

    public removeFromCache(identifier: string): void
    {
        this._objectCache.removeObjectCache(identifier);
    }

    private renderObject(object: IRoomObject, identifier: string, time: number, update: boolean, count: number): number
    {
        if(!object) return 0;

        const visualization = object.visualization as IRoomObjectSpriteVisualization;

        if(!visualization)
        {
            this.removeFromCache(identifier);

            return 0;
        }

        const cache = this.getCacheItem(identifier);
        cache._Str_1577 = object.instanceId;

        const locationCache = cache.location;
        const sortableCache = cache.sprites;

        const vector = locationCache.updateLocation(object, this._geometry);

        if(!vector)
        {
            this.removeFromCache(identifier);

            return 0;
        }

        visualization.update(this._geometry, time, update, false);

        if(locationCache.locationChanged) update = true;

        if(!sortableCache._Str_17574(visualization.instanceId, visualization.updateSpriteCounter) && !update)
        {
            return sortableCache._Str_3008;
        }

        let x   = vector.x;
        let y   = vector.y;
        let z   = vector.z;

        if(x > 0) z = (z + (x * 1.2E-7));
        else z = (z + (-x * 1.2E-7));

        x = (x + (this._width / 2));
        y = (y + (this._height / 2));

        let spriteCount = 0;

        for(let sprite of visualization.sprites.values())
        {
            if(!sprite || !sprite.visible) continue;

            const texture = sprite.texture;

            if(!texture) continue;
            
            let spriteX = ((x + sprite.offsetX) + this._screenOffset.x);
            let spriteY = ((y + sprite.offsetY) + this._screenOffset.y);

            if(!this.isSpriteVisible(spriteX, spriteY, texture.width, texture.height)) continue;

            let sortableSprite = sortableCache._Str_2505(spriteCount);

            if(!sortableSprite)
            {
                sortableSprite = new SortableSprite();

                sortableCache._Str_12937(sortableSprite);

                this._sortableSprites.push(sortableSprite);

                sortableSprite.name = identifier;
            }

            sortableSprite.sprite = sprite;

            if((sprite.spriteType === RoomObjectSpriteType._Str_11629) || (sprite.spriteType === RoomObjectSpriteType._Str_10494))
            {

            }

            sortableSprite.x    = (spriteX - this._screenOffset.x);
            sortableSprite.y    = (spriteY - this._screenOffset.y);
            sortableSprite.z    = ((z + sprite.relativeDepth) + (3.7E-11 * count));

            spriteCount++;
            count++;
        }

        sortableCache._Str_20276(spriteCount);

        return spriteCount;
    }

    private getExtendedSprite(index: number): ExtendedSprite
    {
        if((index < 0) || (index >= this._spriteCount)) return null;

        const sprite = this._display.getChildAt(index);

        if(!sprite) return null;

        return sprite as ExtendedSprite;
    }

    private renderSprite(index: number, sprite: SortableSprite): boolean
    {
        if(index >= this._spriteCount)
        {
            this.createAndAddSprite(sprite);

            return true;
        }

        if(!sprite) return false;

        const objectSprite      = sprite.sprite;
        const extendedSprite    = this.getExtendedSprite(index);

        if(!extendedSprite) return false;

        if(extendedSprite._Str_4593 !== objectSprite._Str_4593)
        {
            if(extendedSprite._Str_4593 && !objectSprite._Str_4593)
            {
                this._display.removeChildAt(index);

                this._spritePool.push(extendedSprite);

                return this.renderSprite(index, sprite);
            }

            this.createAndAddSprite(sprite, index);

            return true;
        }

        if(extendedSprite.needsUpdate(objectSprite.id, objectSprite.updateCounter))
        {
            extendedSprite.tag          = objectSprite.tag;
            extendedSprite.name         = sprite.name;
            extendedSprite._Str_4593    = objectSprite._Str_4593;

            const alpha = (objectSprite.alpha / 255);

            if(extendedSprite.alpha !== alpha) extendedSprite.alpha = alpha;

            if(extendedSprite.tint !== objectSprite.color) extendedSprite.tint = objectSprite.color;

            if(extendedSprite.blendMode !== objectSprite.blendMode) extendedSprite.blendMode = objectSprite.blendMode;

            if(extendedSprite.filters !== objectSprite.filters) extendedSprite.filters = objectSprite.filters;

            if(extendedSprite.texture !== objectSprite.texture) extendedSprite.texture = objectSprite.texture;
        }

        if(objectSprite.flipH)
        {
            if(extendedSprite.scale.x !== -1) extendedSprite.scale.x = -1;
        }
        else
        {
            if(extendedSprite.scale.x !== 1) extendedSprite.scale.x = 1;
        }

        if(objectSprite.flipV)
        {
            if(extendedSprite.scale.y !== -1) extendedSprite.scale.y = -1;
        }
        else
        {
            if(extendedSprite.scale.y !== 1) extendedSprite.scale.y = 1;
        }
        
        if(extendedSprite.x !== sprite.x) extendedSprite.x = sprite.x;
        if(extendedSprite.y !== sprite.y) extendedSprite.y = sprite.y;

        return true;
    }

    private createAndAddSprite(sortableSprite: SortableSprite, index: number = -1): void
    {
        const sprite = sortableSprite.sprite;

        if(!sprite) return;

        let extendedSprite: ExtendedSprite = null;

        if(this._spritePool.length > 0) extendedSprite = this._spritePool.pop();

        if(!extendedSprite) extendedSprite = new ExtendedSprite();

        extendedSprite.tag          = sprite.tag;
        extendedSprite.alpha        = sprite.alpha / 255;
        extendedSprite.tint         = sprite.color;
        extendedSprite.x            = sortableSprite.x;
        extendedSprite.y            = sortableSprite.y;
        extendedSprite.name         = sprite.name;
        extendedSprite._Str_4593    = sprite._Str_4593;
        extendedSprite.blendMode    = sprite.blendMode;
        extendedSprite.filters      = sprite.filters;
        extendedSprite.texture      = sprite.texture;

        if(sprite.flipH) extendedSprite.scale.x = -1;

        if(sprite.flipV) extendedSprite.scale.y = -1;

        if((index < 0) || (index >= this._spriteCount))
        {
            this._display.addChild(extendedSprite);

            this._spriteCount++;
        }
        else
        {
            this._display.addChildAt(extendedSprite, index);
        }

        this._activeSpriteCount++;
    }

    private _Str_20677(spriteCount: number, _arg_2:Boolean=false):void
    {
        if(!this._display) return;

        if(spriteCount < 0) spriteCount = 0;

        if((spriteCount < this._activeSpriteCount) || !this._activeSpriteCount)
        {
            let iterator = (this._spriteCount - 1);

            while(iterator >= spriteCount)
            {
                this._Str_21974(this.getExtendedSprite(iterator), _arg_2);

                iterator--;
            }
        }
        
        this._activeSpriteCount = spriteCount;
    }

    private _Str_21974(k:ExtendedSprite, _arg_2:Boolean):void
    {
        if (k != null)
        {
            if (!_arg_2)
            {
                k.texture = null;
            }
            else
            {
                k.destroy();
            }
        }
    }

    public update(): void
    {
        // perform hit test for mouse location
    }

    public setMouseListener(listener: IRoomCanvasMouseListener): void
    {
        this._mouseListener = listener;
    }

    private getCacheItem(id: string): RoomObjectCacheItem
    {
        return this._objectCache.getObjectCache(id);
    }

    private isSpriteVisible(x: number, y: number, width: number, height: number): boolean
    {
        if(this._noSpriteVisibilityChecking) return true;

        x       = (((x - this._screenOffset.x) * this._scale) + this._screenOffset.x);
        y       = (((y - this._screenOffset.y) * this._scale) + this._screenOffset.y);
        width   = (width * this._scale);
        height  = (height * this._scale);

        if(((x < this._width) && ((x + width) >= 0)) && ((y < this._height) && ((y + height) >= 0)))
        {
            if(!this._usesExclusionRectangles) return true;
        }

        return false;
    }

    public get geometry(): IRoomGeometry
    {
        return this._geometry;
    }

    public get displayObject(): PIXI.DisplayObject
    {
        return this._master;
    }
}