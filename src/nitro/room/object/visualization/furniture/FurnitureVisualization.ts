import { GraphicAsset } from '../../../../../core/asset/GraphicAsset';
import { IRoomObjectSprite } from '../../../../../room/object/visualization/IRoomObjectSprite';
import { IObjectVisualizationData } from '../../../../../room/object/visualization/IRoomObjectVisualizationData';
import { RoomObjectSpriteVisualization } from '../../../../../room/object/visualization/RoomObjectSpriteVisualization';
import { IRoomGeometry } from '../../../../../room/utils/IRoomGeometry';
import { RoomObjectVariable } from '../../RoomObjectVariable';
import { RoomObjectVisualizationType } from '../../RoomObjectVisualizationType';
import { ColorData } from '../data/ColorData';
import { LayerData } from '../data/LayerData';
import { FurnitureVisualizationData } from './FurnitureVisualizationData';

export class FurnitureVisualization extends RoomObjectSpriteVisualization
{
    protected static DEPTH_MULTIPLIER: number = Math.sqrt(0.5);
    
    public static TYPE: string = RoomObjectVisualizationType.FURNITURE_STATIC;

    protected _data: FurnitureVisualizationData;

    protected _type: string;
    protected _direction: number;
    protected _geometryDirection: number;
    protected _lastDirection: number;
    protected _lastScale: number;
    protected _colorId: number;
    protected _clickUrl: string;
    protected _liftAmount: number;
    protected _alphaMultiplier: number;
    protected _needsAlphaUpdate: boolean;

    protected _assetNames: string[];
    protected _layerCount: number;
    protected _additionalLayer: number;
    protected _skippedAssets: string[];
    protected _tags: string[];
    protected _inks: number[];
    protected _alphas: number[];
    protected _colors: number[];
    protected _ignoreMouse: boolean[];
    protected _xOffsets: number[];
    protected _yOffsets: number[];
    protected _zOffsets: number[];

    private _animationNumber: number;

    constructor()
    {
        super();

        this._data              = null;

        this._type              = null;
        this._direction         = 0;
        this._geometryDirection = NaN;
        this._lastDirection     = -1;
        this._lastScale         = 0;

        this._colorId           = 0;
        this._clickUrl          = null;
        this._liftAmount        = 0;
        this._alphaMultiplier   = 1;
        this._needsAlphaUpdate  = false;

        this._assetNames        = [];
        this._layerCount        = 0;
        this._additionalLayer   = -1;
        this._skippedAssets     = [];
        this._tags              = [];
        this._inks              = [];
        this._alphas            = [];
        this._colors            = [];
        this._ignoreMouse       = [];
        this._xOffsets          = [];
        this._yOffsets          = [];
        this._zOffsets          = [];

        this._animationNumber   = 0;
    }

    public initialize(data: IObjectVisualizationData): boolean
    {
        this.reset();

        if(!(data instanceof FurnitureVisualizationData)) return false;

        this._type  = data.type;
        this._data  = data;

        return true;
    }

    public dispose(): void
    {
        super.dispose();

        this._data              = null;
        this._assetNames        = null;
        this._skippedAssets     = null;
        this._tags              = null;
        this._inks              = null;
        this._alphas            = null;
        this._colors            = null;
        this._ignoreMouse       = null;
        this._xOffsets          = null;
        this._yOffsets          = null;
        this._zOffsets          = null;
    }

    protected reset(): void
    {
        super.reset();

        this.setDirection(-1);
        
        this._data              = null;
        this._assetNames        = [];
        this._skippedAssets     = [];
        this._tags              = [];
        this._inks              = [];
        this._alphas            = [];
        this._colors            = [];
        this._ignoreMouse       = [];
        this._xOffsets          = [];
        this._yOffsets          = [];
        this._zOffsets          = [];

        this.setSpriteCount(0);
    }

    protected resetLayers(scale: number, direction: number): void
    {
        if((this._lastDirection === direction) && (this._lastScale === scale)) return;

        this._lastScale     = scale;
        this._lastDirection = direction;

        this._assetNames        = [];
        this._skippedAssets     = [];
        this._tags              = [];
        this._inks              = [];
        this._alphas            = [];
        this._colors            = [];
        this._ignoreMouse       = [];
        this._xOffsets          = [];
        this._yOffsets          = [];
        this._zOffsets          = [];

        this.setLayerCount(((this._data && this._data.getLayerCount(scale)) || 0) + this.getAdditionalLayerCount());
    }

    public update(geometry: IRoomGeometry, time: number, update: boolean, skipUpdate: boolean): void
    {
        if(!geometry) return;

        let scale           = geometry.scale;
        let updateSprites   = false;

        if(this.updateObject(scale, geometry.direction.x)) updateSprites = true;

        if(this.updateModel(scale)) updateSprites = true;

        let number = 0;

        if(skipUpdate)
        {
            this._animationNumber = this._animationNumber | this.updateAnimation(scale);
        }
        else
        {
            number = this.updateAnimation(scale) | this._animationNumber;
            this._animationNumber = 0;
        }

        if(updateSprites || (number !== 0))
        {
            this.updateSprites(scale, updateSprites, number);

            this._scale = geometry.scale;

            this.updateSpriteCounter++;
        }
    }

    protected updateObject(scale: number, direction: number): boolean
    {
        if(!this.object) return false;

        if((this.updateObjectCounter === this.object.updateCounter) && (scale === this._scale) && (this._geometryDirection === direction)) return false;

        let offsetDirection = (this.object.getDirection().x - (direction + 135));

        offsetDirection = ((((offsetDirection) % 360) + 360) % 360);

        if(this._data)
        {
            const validDirection = this._data.getValidDirection(scale, offsetDirection);

            this.setDirection(validDirection);
        }

        this._geometryDirection = direction;
        this._scale             = scale;
        
        this.updateObjectCounter = this.object.updateCounter;

        this.resetLayers(scale, this._direction);

        return true;
    }

    protected updateModel(scale: number): boolean
    {
        const model = this.object && this.object.model;

        if(!model) return false;

        if(this.updateModelCounter === model.updateCounter) return false;

        this._colorId       = model.getValue(RoomObjectVariable.FURNITURE_COLOR);
        this._clickUrl      = model.getValue(RoomObjectVariable.FURNITURE_AD_URL);
        this._liftAmount    = model.getValue(RoomObjectVariable.FURNITURE_LIFT_AMOUNT);

        let alphaMultiplier = model.getValue(RoomObjectVariable.FURNITURE_ALPHA_MULTIPLIER);

        if(isNaN(alphaMultiplier)) alphaMultiplier = 1;
        
        if(this._alphaMultiplier !== alphaMultiplier)
        {
            this._alphaMultiplier = alphaMultiplier;

            this._needsAlphaUpdate = true;
        }

        this.updateModelCounter = model.updateCounter;

        return true;
    }

    protected updateSprites(scale: number, update: boolean, animation: number): void
    {
        if(this._layerCount !== this.totalSprites)
        {
            this.setSpriteCount(this._layerCount);
        }

        if(update)
        {
            let layerId = (this.totalSprites - 1);

            while(layerId >= 0)
            {
                this.updateSprite(scale, layerId);

                layerId--;
            }
        }
        else
        {
            let layerId = 0;
            while(animation > 0)
            {
                if(animation) this.updateSprite(scale, layerId);

                layerId++;
                animation = (animation >> 1);
            }
        }

        this._needsAlphaUpdate = false;
    }

    protected updateSprite(scale: number, layerId: number): void
    {
        const assetName = this.getSpriteAssetName(scale, layerId);
        const sprite    = this.getSprite(layerId);

        if(assetName && sprite)
        {
            const assetData = this.getAsset(assetName);

            if(assetData && assetData.texture)
            {
                sprite.visible      = true;
                sprite.type         = this._type;
                sprite.texture      = assetData.texture;
                sprite.flipH        = assetData.flipH;
                sprite.flipV        = assetData.flipV;
                sprite.direction    = this._direction;

                let relativeDepth = 0;

                if(layerId !== this._additionalLayer)
                {
                    sprite.tag              = this.getLayerTag(scale, this._direction, layerId);
                    sprite.alpha            = this.getLayerAlpha(scale, this._direction, layerId);
                    sprite.color            = this.getLayerColor(scale, layerId, this._colorId);
                    sprite.offsetX          = (assetData.offsetX + this.getLayerXOffset(scale, this._direction, layerId));
                    sprite.offsetY          = (assetData.offsetY + this.getLayerYOffset(scale, this._direction, layerId));
                    sprite.ignoreMouse      = this.getLayerIgnoreMouse(scale, this._direction, layerId);
                    sprite.blendMode        = this.getLayerInk(scale, this._direction, layerId);

                    relativeDepth = this.getLayerZOffset(scale, this._direction, layerId);
                    relativeDepth = (relativeDepth - (layerId * 0.001));
                }
                else
                {
                    sprite.offsetX      = assetData.offsetX;
                    sprite.offsetY      = (assetData.offsetY + this.getLayerYOffset(scale, this._direction, layerId));
                    sprite.alpha        = (48 * this._alphaMultiplier);
                    sprite.ignoreMouse  = true;
                    
                    relativeDepth = 1;
                }

                sprite.relativeDepth    = (relativeDepth * FurnitureVisualization.DEPTH_MULTIPLIER);
                sprite.name             = assetName;
                sprite._Str_3582        = this.getLibraryAssetNameForSprite(assetData, sprite);
            }
            else
            {
                this.resetSprite(sprite);
            }
        }
        else
        {
            if(sprite) this.resetSprite(sprite);
        }
    }

    protected getLibraryAssetNameForSprite(asset: GraphicAsset, sprite: IRoomObjectSprite): string
    {
        return asset.source;
    }

    protected getPostureForAssetFile(scale: number, _arg_2: string): string
    {
        return null;
    }

    private resetSprite(sprite: IRoomObjectSprite): void
    {
        if(!sprite) return;

        sprite.texture          = null;
        sprite.offsetX          = 0;
        sprite.offsetY          = 0;
        sprite.flipH            = false;
        sprite.flipV            = false;
        sprite.relativeDepth    = 0;
    }

    protected getSpriteAssetName(scale: number, layerId: number): string
    {
        let assetName = this._assetNames[layerId];

        if(!assetName) assetName = this.cacheSpriteAssetName(layerId);

        return assetName + this.getFrameNumber(scale, layerId);
    }

    protected cacheSpriteAssetName(layerId: number): string
    {
        let layerCode = '';

        if(layerId !== this._additionalLayer)
        {
            layerCode = FurnitureVisualizationData.LAYER_LETTERS[layerId] || '';
        }
        else
        {
            layerCode = 'sd';
        }

        if(layerCode === '') return null;

        const assetName = `${ this._type }_64_${ layerCode }_${ this._direction }_`;

        this._assetNames[layerId] = assetName;

        return assetName;
    }

    protected getLayerTag(scale: number, direction: number, layerId: number): string
    {
        const existing = this._tags[layerId];

        if(existing !== undefined) return existing;

        if(!this._data) return LayerData.DEFAULT_TAG;

        const tag = this._data.getLayerTag(scale, direction, layerId);

        this._tags[layerId] = tag;

        return tag;
    }

    protected getLayerInk(scale: number, direction: number, layerId: number): number
    {
        const existing = this._inks[layerId];

        if(existing !== undefined) return existing;

        if(!this._data) return LayerData.DEFAULT_INK;

        const ink = this._data.getLayerInk(scale, direction, layerId);

        this._inks[layerId] = ink;

        return ink;
    }

    protected getLayerAlpha(scale: number, direction: number, layerId: number): number
    {
        if(!this._needsAlphaUpdate)
        {
            const existing = this._alphas[layerId];

            if(existing !== undefined) return existing;
        }

        if(!this._data) return LayerData.DEFAULT_ALPHA;

        let alpha = this._data.getLayerAlpha(scale, direction, layerId);

        if(this._alphaMultiplier !== null) alpha = (alpha * this._alphaMultiplier);

        this._alphas[layerId] = alpha;

        return alpha;
    }

    protected getLayerColor(scale: number, layerId: number, colorId: number): number
    {        
        const existing = this._colors[layerId];

        if(existing !== undefined) return existing;

        if(!this._data) return ColorData.DEFAULT_COLOR;

        const color = this._data.getLayerColor(scale, layerId, colorId);

        this._colors[layerId] = color;

        return color;
    }

    protected getLayerIgnoreMouse(scale: number, direction: number, layerId: number): boolean
    {
        const existing = this._ignoreMouse[layerId];

        if(existing !== undefined) return existing;

        if(!this._data) return LayerData.DEFAULT_IGNORE_MOUSE;

        const ignoreMouse = this._data.getLayerIgnoreMouse(scale, direction, layerId);

        this._ignoreMouse[layerId] = ignoreMouse;

        return ignoreMouse;
    }

    protected getLayerXOffset(scale: number, direction: number, layerId: number): number
    {
        const existing = this._xOffsets[layerId];

        if(existing !== undefined) return existing;

        if(!this._data) return LayerData.DEFAULT_XOFFSET;

        const xOffset = this._data.getLayerXOffset(scale, direction, layerId);

        this._xOffsets[layerId] = xOffset;

        return xOffset;
    }

    protected getLayerYOffset(scale: number, direction: number, layerId: number): number
    {
        if(layerId === this._additionalLayer) return Math.ceil((this._liftAmount * (64 / 2)));

        const existing = this._yOffsets[layerId];

        if(existing !== undefined) return existing;

        if(!this._data) return LayerData.DEFAULT_YOFFSET;

        const yOffset = this._data.getLayerYOffset(scale, direction, layerId);

        this._yOffsets[layerId] = yOffset;

        return yOffset;
    }

    protected getLayerZOffset(scale: number, direction: number, layerId: number): number
    {
        const existing = this._zOffsets[layerId];

        if(existing !== undefined) return existing;

        if(!this._data) return LayerData.DEFAULT_ZOFFSET;

        const zOffset = this._data.getLayerZOffset(scale, direction, layerId);

        this._zOffsets[layerId] = zOffset;

        return zOffset;
    }

    protected getValidScale(scale: number): number
    {
        if(!this._data) return scale;

        return this._data.getValidScale(scale);
    }

    protected setLayerCount(count: number): void
    {
        this._layerCount        = count;
        this._additionalLayer   = count - this.getAdditionalLayerCount();
    }

    protected getAdditionalLayerCount(): number
    {
        return 1;
    }

    protected updateAnimation(scale: number): number
    {
        return 0;
    }

    protected getFrameNumber(scale: number, layerId: number): number
    {
        return 0;
    }

    public getAsset(name: string): GraphicAsset
    {
        if(!this.asset) return null;

        return this.asset.getAsset(name);
    }

    protected setDirection(direction: number): void
    {
        if(this._direction === direction) return;

        this._direction = direction;
    }

    protected get direction(): number
    {
        return this._direction;
    }
}