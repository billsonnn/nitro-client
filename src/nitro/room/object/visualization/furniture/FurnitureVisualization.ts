import { IAsset } from '../../../../../core/asset/interfaces';
import { IObjectVisualizationData } from '../../../../../room/object/visualization/IRoomObjectVisualizationData';
import { PlayableVisualization } from '../../../../../room/object/visualization/PlayableVisualization';
import { RoomObjectSpriteVisualization } from '../../../../../room/object/visualization/RoomObjectSpriteVisualization';
import { Position } from '../../../../../room/utils/Position';
import { RoomObjectModelKey } from '../../RoomObjectModelKey';
import { ColorData } from '../data/ColorData';
import { LayerData } from '../data/LayerData';
import { ObjectVisualizationType } from '../ObjectVisualizationType';
import { FurnitureVisualizationData } from './FurnitureVisualizationData';

export class FurnitureVisualization extends RoomObjectSpriteVisualization
{
    public static TYPE: string = ObjectVisualizationType.FURNITURE_STATIC;

    protected _data: FurnitureVisualizationData;

    protected _type: string;
    protected _screenPosition: Position;
    protected _direction: number;
    protected _colorId: number;
    protected _clickUrl: string;
    protected _liftAmount: number;
    protected _isIcon: boolean;
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
    protected _iconColors: number[];
    protected _ignoreMouse: boolean[];
    protected _xOffsets: number[];
    protected _yOffsets: number[];
    protected _zOffsets: number[];

    constructor()
    {
        super();

        this._data              = null;

        this._type              = null;
        this._screenPosition    = new Position();
        this._direction         = -1;
        this._colorId           = 0;
        this._clickUrl          = null;
        this._liftAmount        = 0;
        this._isIcon            = false;
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
        this._iconColors        = [];
        this._ignoreMouse       = [];
        this._xOffsets          = [];
        this._yOffsets          = [];
        this._zOffsets          = [];
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
        this._direction = -1;

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
        this._iconColors        = [];
        this._ignoreMouse       = [];
        this._xOffsets          = [];
        this._yOffsets          = [];
        this._zOffsets          = [];

        this.setLayerCount(((this._data && this._data.layerCount) || 0) + this.getAdditionalLayerCount());
    }

    public onUpdate(): void
    {
        const frameCount = Math.round(this.totalTimeRunning / PlayableVisualization.FPS_TIME_MS);

        if(this.frameCount === frameCount) return;

        this.frameCount = frameCount;

        super.onUpdate();

        let updateSprites = false;

        if(this.updateObject()) updateSprites = true;

        if(this.updateModel()) updateSprites = true;

        if(this._isIcon) updateSprites = false;
        else if(this.updateAnimation()) updateSprites = true;

        if(!updateSprites) return;

        this.updateSprites();
    }

    protected onDispose(): void
    {
        this.reset();

        if(this._data && !this._data.saveable) this._data.dispose();

        super.onDispose();
    }

    protected updateObject(): boolean
    {
        if(!this.object) return false;

        if(this.updateObjectCounter === this.object.updateCounter) return false;

        this._screenPosition = this.object.getScreenPosition();

        if(this._selfContainer)
        {
            if(this._screenPosition.x !== this._selfContainer.x || this._screenPosition.y !== this._selfContainer.y)
            {
                this._selfContainer.x       = this._screenPosition.x;
                this._selfContainer.y       = this._screenPosition.y;
                this._selfContainer.zIndex  = this._screenPosition.depth + 4;
            }
        }

        this.setDirection(this.object.position.direction);

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
        if(this._data) direction = this._data.getValidDirection(direction);

        if(direction === this._direction) return;

        this._direction = direction;

        this.resetLayers();
    }

    public updateSprites(): void
    {
        if(!this.object.isReady) return;

        this.hideSprites();

        for(let i = 0; i < this._layerCount; i++) this.updateSprite(i);

        this._needsAlphaUpdate = false;
    }

    public enableIcon(): void
    {
        if(this._isIcon) return;

        this._isIcon = true;

        this.resetLayers();

        this._layerCount = 2;

        this.updateSprites();
    }

    public disableIcon(): void
    {
        if(!this._isIcon) return;
        
        this.resetLayers();

        this._isIcon = false;

        this.updateSprites();
    }

    protected updateSprite(layerId: number): void
    {
        const assetName = this.getSpriteAssetName(layerId);
        
        if(this._skippedAssets.indexOf(assetName) >= 0) return;

        const assetData = this.getAsset(assetName);

        if(!assetData)
        {
            this._skippedAssets.push(assetName);
            
            return;
        }

        let sprite = this.getSprite(assetName);

        if(!sprite)
        {
            const sourceName = this.getAssetSourceName(layerId, assetName, assetData);

            sprite = this.createAndAddSprite(assetName, sourceName);

            if(!sprite)
            {
                this._skippedAssets.push(assetName);

                return;
            }

            if(assetData.flipH) sprite.scale.x = -1;
        }
        
        sprite.x        = -assetData.x;
        sprite.y        = -assetData.y;
        sprite.visible  = true;

        if(assetData.flipH) sprite.x *= -1;

        if(this._isIcon)
        {
            sprite.tint     = this.getLayerIconColor(this._colorId, layerId);
            sprite.zIndex   = 1000000 + (layerId * 0.001);
        }
        else
        {
            if(layerId !== this._additionalLayer)
            {
                sprite.tag          = this.getLayerTag(this._direction, layerId);
                sprite.blendMode    = this.getLayerInk(this._direction, layerId);
                sprite.alpha        = this.getLayerAlpha(this._direction, layerId);
                sprite.tint         = this.getLayerColor(this._colorId, layerId);
                sprite.ignoreMouse  = this.getLayerIgnoreMouse(this._direction, layerId);
                sprite.x            = (sprite.x + this.getLayerXOffset(this._direction, layerId));
                sprite.y            = (sprite.y + this.getLayerYOffset(this._direction, layerId));
                sprite.zIndex       = (this._screenPosition.depth + this._screenPosition.z) + this.getLayerZOffset(this._direction, layerId) + (layerId * 0.001);
            }
            else
            {
                sprite.alpha        = (48 * this._alphaMultiplier) / 255;
                sprite.ignoreMouse  = true;
                sprite.zIndex       = (this._screenPosition.depth + this._screenPosition.z) - 1000 + 0.001;
            }

            if(!this._selfContainer)
            {
                sprite.x += this._screenPosition.x;
                sprite.y += this._screenPosition.y;
            }
        }
    }

    protected getSpriteAssetName(layerId: number): string
    {
        if(this._isIcon) return this.getSpriteAssetIconName(layerId);

        let assetName = this._assetNames[layerId];

        if(!assetName) assetName = this.cacheSpriteAssetName(layerId);

        return assetName + this.getFrameNumber(layerId);
    }

    protected getSpriteAssetIconName(layerId: number): string
    {
        const layerCode = FurnitureVisualizationData.LAYER_LETTERS[layerId] || '';

        return `${ this._type }_icon_${ layerCode }`;
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

        if(this._alphaMultiplier !== null) alpha = (alpha * this._alphaMultiplier) / 255;

        this._alphas[layerId] = alpha;

        return alpha;
    }

    protected getLayerColor(colorId: number, layerId: number): number
    {
        if(this._isIcon) return this.getLayerIconColor(colorId, layerId);
        
        const existing = this._colors[layerId];

        if(existing !== undefined) return existing;

        if(!this._data) return ColorData.DEFAULT_COLOR;

        const color = this._data.getLayerColor(colorId, layerId);

        this._colors[layerId] = color;

        return color;
    }

    protected getLayerIconColor(colorId: number, layerId: number): number
    {
        const existing = this._iconColors[layerId];

        if(existing !== undefined) return existing;

        if(!this._data) return ColorData.DEFAULT_COLOR;

        const color = this._data.getLayerIconColor(colorId, layerId);

        this._iconColors[layerId] = color;

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
        let yOffset = LayerData.DEFAULT_YOFFSET;

        const existing = this._yOffsets[layerId];

        if(existing !== undefined) yOffset = existing;
        
        else
        {
            if(this._data)
            {
                yOffset = this._data.getLayerYOffset(direction, layerId);

                this._yOffsets[layerId] = yOffset;
            }
        }

        if(this._liftAmount) yOffset -= Math.ceil(this._liftAmount * (64 / 2));

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

    protected updateAnimation(): boolean
    {
        return false;
    }

    protected getFrameNumber(layerId: number): number
    {
        return 0;
    }

    public getAsset(name: string): IAsset
    {
        if(!this._data) return null;

        return this._data.getAsset(name);
    }

    protected getAssetSourceName(layerId: number, assetName: string, asset: IAsset): string
    {
        if(!assetName || !asset) return null;

        let source = assetName;
            
        if(asset.source) source = asset.source;

        source = `${ this._type }_${ source }.png`;

        return source;
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

    public get isIcon(): boolean
    {
        return this._isIcon;
    }
}