import { GraphicAsset } from '../../../../../core/asset/GraphicAsset';
import { IRoomObjectSprite } from '../../../../../room/object/visualization/IRoomObjectSprite';
import { IObjectVisualizationData } from '../../../../../room/object/visualization/IRoomObjectVisualizationData';
import { RoomObjectSpriteVisualization } from '../../../../../room/object/visualization/RoomObjectSpriteVisualization';
import { IRoomGeometry } from '../../../../../room/utils/IRoomGeometry';
import { RoomObjectModelKey } from '../../RoomObjectModelKey';
import { ColorData } from '../data/ColorData';
import { LayerData } from '../data/LayerData';
import { ObjectVisualizationType } from '../ObjectVisualizationType';
import { FurnitureVisualizationData } from './FurnitureVisualizationData';

export class FurnitureVisualization extends RoomObjectSpriteVisualization
{
    protected static DEPTH_MULTIPLIER: number = Math.sqrt(0.5);
    
    public static TYPE: string = ObjectVisualizationType.FURNITURE_STATIC;

    protected _data: FurnitureVisualizationData;

    protected _type: string;
    protected _direction: number;
    protected _geometryDirection: number;
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
        this._direction         = -1;
        this._geometryDirection = -1;
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
        if(!(data instanceof FurnitureVisualizationData)) return false;

        this._type  = data.type;
        this._data  = data;

        this.reset();

        super.initialize(data);

        return true;
    }

    protected reset(): void
    {
        this.setDirection(-1);

        this.resetLayers();
    }

    protected resetLayers(): void
    {
        this._assetNames        = [];
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

        this.setLayerCount(((this._data && this._data.layerCount) || 0) + this.getAdditionalLayerCount());
    }

    public update(geometry: IRoomGeometry, time: number, update: boolean, skipUpdate: boolean): void
    {
        if(!geometry) return;

        let updateSprites = false;

        if(this.updateObject(geometry.direction.x)) updateSprites = true;

        if(this.updateModel()) updateSprites = true;

        let number = 0;

        if(skipUpdate)
        {
            this._animationNumber = this._animationNumber | this.updateAnimation();
        }
        else
        {
            number = this.updateAnimation() | this._animationNumber;
            this._animationNumber = 0;
        }

        if(updateSprites || number !== 0)
        {
            this.updateSprites(updateSprites, number);

            this.updateSpriteCounter++;
        }
    }

    public dispose(): void
    {
        super.dispose();

        this.reset();

        if(this._data && !this._data.saveable) this._data.dispose();
    }

    protected updateObject(direction: number): boolean
    {
        if(!this.object) return false;

        if((this.updateObjectCounter === this.object.updateCounter) && (this._geometryDirection === direction)) return false;

        let offsetDirection = (this.object.getDirection().x - (direction + 135));

        offsetDirection = (((offsetDirection) % 360) % 360);

        this.setDirection(offsetDirection);

        this._geometryDirection = direction;
        
        this.updateObjectCounter = this.object.updateCounter;

        return true;
    }

    protected updateModel(): boolean
    {
        const model = this.object && this.object.model;

        if(!model) return false;

        if(this.updateModelCounter === model.updateCounter) return false;

        this._colorId       = model.getValue(RoomObjectModelKey.FURNITURE_COLOR);
        this._clickUrl      = model.getValue(RoomObjectModelKey.FURNITURE_AD_URL);
        this._liftAmount    = model.getValue(RoomObjectModelKey.FURNITURE_LIFT_AMOUNT);

        let alphaMultiplier = model.getValue(RoomObjectModelKey.FURNITURE_ALPHA_MULTIPLIER)

        if(isNaN(alphaMultiplier)) alphaMultiplier = 1;
        
        if(this._alphaMultiplier !== alphaMultiplier)
        {
            this._alphaMultiplier = alphaMultiplier;

            this._needsAlphaUpdate = true;
        }

        this.updateModelCounter = model.updateCounter;

        return true;
    }

    protected setDirection(direction: number): void
    {
        direction = this._data.getValidDirection(direction);

        this._direction = direction;

        this.resetLayers();
    }

    protected updateSprites(update: boolean, animation: number): void
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
                this.updateSprite(layerId);

                layerId--;
            }
        }
        else
        {
            let layerId = 0;
            while(animation > 0)
            {
                if(animation) this.updateSprite(layerId);

                layerId++;
                animation = (animation >> 1);
            }
        }

        this._needsAlphaUpdate = false;
    }

    protected updateSprite(layerId: number): void
    {
        const assetName = this.getSpriteAssetName(layerId);
        const sprite    = this.getSprite(layerId);

        if(assetName && sprite)
        {
            const assetData = this.getAsset(assetName);

            if(assetData && assetData.texture)
            {
                sprite.visible      = true;
                sprite.type         = this.type;
                sprite.texture      = assetData.texture;
                sprite.flipH        = assetData.flipH;
                sprite.flipV        = assetData.flipV;
                sprite.direction    = this._direction;

                let relativeDepth = 0;

                if(layerId !== this._additionalLayer)
                {
                    sprite.tag              = this.getLayerTag(this._direction, layerId);
                    sprite.alpha            = this.getLayerAlpha(this._direction, layerId);
                    sprite.color            = this.getLayerColor(this._colorId, layerId);
                    sprite.offsetX          = (assetData.offsetX + this.getLayerXOffset(this._direction, layerId));
                    sprite.offsetY          = (assetData.offsetY + this.getLayerYOffset(this._direction, layerId));
                    sprite.ignoreMouse      = this.getLayerIgnoreMouse(this._direction, layerId);
                    sprite.blendMode        = this.getLayerInk(this._direction, layerId);

                    relativeDepth = this.getLayerZOffset(this._direction, layerId);
                    relativeDepth = (relativeDepth - (layerId * 0.001));
                }
                else
                {
                    sprite.offsetX      = assetData.offsetX;
                    sprite.offsetY      = (assetData.offsetY + this.getLayerYOffset(this._direction, layerId));
                    sprite.alpha        = (48 * this._alphaMultiplier);
                    sprite.ignoreMouse  = true;
                    
                    relativeDepth = 1;
                }

                sprite.relativeDepth    = (relativeDepth * FurnitureVisualization.DEPTH_MULTIPLIER);
                sprite.name             = assetName;
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

    protected getSpriteAssetName(layerId: number): string
    {
        let assetName = this._assetNames[layerId];

        if(!assetName) assetName = this.cacheSpriteAssetName(layerId);

        return assetName + this.getFrameNumber(layerId);
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

    protected getLayerTag(direction: number, layerId: number): string
    {
        const existing = this._tags[layerId];

        if(existing !== undefined) return existing;

        if(!this._data) return LayerData.DEFAULT_TAG;

        const tag = this._data.getLayerTag(direction, layerId);

        this._tags[layerId] = tag;

        return tag;
    }

    protected getLayerInk(direction: number, layerId: number): number
    {
        const existing = this._inks[layerId];

        if(existing !== undefined) return existing;

        if(!this._data) return LayerData.DEFAULT_INK;

        const ink = this._data.getLayerInk(direction, layerId);

        this._inks[layerId] = ink;

        return ink;
    }

    protected getLayerAlpha(direction: number, layerId: number): number
    {
        if(!this._needsAlphaUpdate)
        {
            const existing = this._alphas[layerId];

            if(existing !== undefined) return existing;
        }

        if(!this._data) return LayerData.DEFAULT_ALPHA;

        let alpha = this._data.getLayerAlpha(direction, layerId);

        if(this._alphaMultiplier !== null) alpha = (alpha * this._alphaMultiplier);

        this._alphas[layerId] = alpha;

        return alpha;
    }

    protected getLayerColor(colorId: number, layerId: number): number
    {        
        const existing = this._colors[layerId];

        if(existing !== undefined) return existing;

        if(!this._data) return ColorData.DEFAULT_COLOR;

        const color = this._data.getLayerColor(colorId, layerId);

        this._colors[layerId] = color;

        return color;
    }

    protected getLayerIgnoreMouse(direction: number, layerId: number): boolean
    {
        const existing = this._ignoreMouse[layerId];

        if(existing !== undefined) return existing;

        if(!this._data) return LayerData.DEFAULT_IGNORE_MOUSE;

        const ignoreMouse = this._data.getLayerIgnoreMouse(direction, layerId);

        this._ignoreMouse[layerId] = ignoreMouse;

        return ignoreMouse;
    }

    protected getLayerXOffset(direction: number, layerId: number): number
    {
        const existing = this._xOffsets[layerId];

        if(existing !== undefined) return existing;

        if(!this._data) return LayerData.DEFAULT_XOFFSET;

        const xOffset = this._data.getLayerXOffset(direction, layerId);

        this._xOffsets[layerId] = xOffset;

        return xOffset;
    }

    protected getLayerYOffset(direction: number, layerId: number): number
    {
        if(layerId === this._additionalLayer) return Math.ceil((this._liftAmount * (64 / 2)));

        const existing = this._yOffsets[layerId];

        if(existing !== undefined) return existing;

        if(!this._data) return LayerData.DEFAULT_YOFFSET;

        const yOffset = this._data.getLayerYOffset(direction, layerId);

        this._yOffsets[layerId] = yOffset;

        return yOffset;
    }

    protected getLayerZOffset(direction: number, layerId: number): number
    {
        const existing = this._zOffsets[layerId];

        if(existing !== undefined) return existing;

        if(!this._data) return LayerData.DEFAULT_ZOFFSET;

        const zOffset = this._data.getLayerZOffset(direction, layerId);

        this._zOffsets[layerId] = zOffset;

        return zOffset;
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

    protected updateAnimation(): number
    {
        return 0;
    }

    protected getFrameNumber(layerId: number): number
    {
        return 0;
    }

    public getAsset(name: string): GraphicAsset
    {
        if(!this._data) return null;

        return this.asset.getGraphic(name);
    }

    public get data(): FurnitureVisualizationData
    {
        return this._data;
    }

    public get type(): string
    {
        return this._type;
    }

    public get direction(): number
    {
        return this._direction;
    }

    public get layerCount(): number
    {
        return this._data.layerCount;
    }
}