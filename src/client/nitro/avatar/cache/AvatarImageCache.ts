import { RoomObjectSpriteData } from '../../../room/data/RoomObjectSpriteData';
import { TextureUtils } from '../../../room/utils/TextureUtils';
import { Nitro } from '../../Nitro';
import { IActiveActionData } from '../actions/IActiveActionData';
import { AssetAliasCollection } from '../alias/AssetAliasCollection';
import { AnimationLayerData } from '../animation/AnimationLayerData';
import { AvatarImageBodyPartContainer } from '../AvatarImageBodyPartContainer';
import { AvatarImagePartContainer } from '../AvatarImagePartContainer';
import { AvatarStructure } from '../AvatarStructure';
import { AvatarDirectionAngle } from '../enum/AvatarDirectionAngle';
import { AvatarFigurePartType } from '../enum/AvatarFigurePartType';
import { AvatarScaleType } from '../enum/AvatarScaleType';
import { GeometryType } from '../enum/GeometryType';
import { IAvatarImage } from '../IAvatarImage';
import { AvatarCanvas } from '../structure/AvatarCanvas';
import { AvatarImageActionCache } from './AvatarImageActionCache';
import { AvatarImageBodyPartCache } from './AvatarImageBodyPartCache';
import { AvatarImageDirectionCache } from './AvatarImageDirectionCache';
import { ImageData } from './ImageData';

export class AvatarImageCache 
{
    private static _Str_2189: number = 60000;

    private _structure: AvatarStructure;
    private _avatar: IAvatarImage;
    private _assets: AssetAliasCollection;
    private _scale: string;
    private _cache: Map<string, AvatarImageActionCache>;
    private _canvas: AvatarCanvas;
    private _disposed: boolean;
    private _geometryType: string;
    private _unionImages: ImageData[];
    private _matrix: PIXI.Matrix;
    private _serverRenderData: RoomObjectSpriteData[];

    constructor(k: AvatarStructure, _arg_2: IAvatarImage, _arg_3: AssetAliasCollection, _arg_4: string)
    {
        this._structure         = k;
        this._avatar            = _arg_2;
        this._assets            = _arg_3;
        this._scale             = _arg_4;
        this._cache             = new Map();
        this._canvas            = null;
        this._disposed          = false;
        this._unionImages       = [];
        this._matrix            = new PIXI.Matrix();
        this._serverRenderData  = new Array();
    }

    public dispose(): void
    {
        if(this._disposed) return;

        this._structure = null;
        this._avatar    = null;
        this._assets    = null;
        this._canvas    = null;
        this._disposed  = true;

        if(this._cache)
        {
            for(let cache of this._cache.values())
            {
                if(!cache) continue;

                cache.dispose();
            }

            this._cache = null;
        }
    }

    public _Str_1086(k: number = 60000): void
    {
        const time = Nitro.instance.time;

        if(this._cache)
        {
            for(let cache of this._cache.values())
            {
                if(!cache) continue;

                cache._Str_2089(k, time);
            }
        }
    }

    public _Str_741(k: IActiveActionData): void
    {
        if(this._cache)
        {
            for(let cache of this._cache.values())
            {
                if(!cache) continue;

                cache._Str_1565(k, 0);
            }
        }
    }

    public setDirection(k: string, _arg_2: number): void
    {
        const parts = this._structure._Str_1695(k);

        if(parts)
        {
            for(let part of parts)
            {
                const actionCache = this._Str_1050(part);

                if(!actionCache) continue;

                actionCache.setDirection(_arg_2);
            }
        }
    }

    public _Str_1565(k: IActiveActionData, _arg_2: number): void
    {
        const _local_3 = this._structure._Str_2021(k, this._avatar);

        for(let _local_4 of _local_3)
        {
            const _local_5 = this._Str_1050(_local_4);

            if(_local_5) _local_5._Str_1565(k, _arg_2);
        }
    }

    public _Str_2014(k: string): void
    {
        if(this._geometryType === k) return;

        if((((this._geometryType === GeometryType.SITTING) && (k === GeometryType.VERTICAL)) || ((this._geometryType === GeometryType.VERTICAL) && (k === GeometryType.SITTING)) || ((this._geometryType === GeometryType.SNOWWARS_HORIZONTAL) && (k = GeometryType.SNOWWARS_HORIZONTAL))))
        {
            this._geometryType  = k;
            this._canvas        = null;

            return;
        }

        this._Str_1086(0);

        this._geometryType  = k;
        this._canvas        = null;
    }

    public _Str_1629(k: string, _arg_2: number, _arg_3: boolean = false): AvatarImageBodyPartContainer
    {
        let _local_4 = this._Str_1050(k);

        if(!_local_4)
        {
            _local_4 = new AvatarImageActionCache();

            this._cache.set(k, _local_4);
        }

        let _local_5 = _local_4.getDirection();
        let _local_7 = _local_4._Str_2244();
        let frameCount = _arg_2;

        if(_local_7._Str_742._Str_812) frameCount -= _local_7._Str_664;

        let _local_8                        = _local_7;
        let _local_9: string[]              = [];
        let _local_10: Map<string, string>  = new Map();
        let _local_11                       = new PIXI.Point();

        if (!((!(_local_7)) || (!(_local_7._Str_742))))
        {
            if (_local_7._Str_742._Str_861)
            {
                let _local_15 = _local_5;

                const _local_16 = this._structure._Str_720(((_local_7._Str_742.state + '.') + _local_7._Str_727));
                const _local_17 = (_arg_2 - _local_7._Str_664);

                if(_local_16)
                {
                    const _local_18 = _local_16._Str_607(_local_17, k, _local_7._Str_707);

                    if(_local_18)
                    {
                        _local_15 = (_local_5 + _local_18.dd);

                        if(_local_18.dd < 0)
                        {
                            if(_local_15 < 0)
                            {
                                _local_15 = (8 + _local_15);
                            }
                            else if(_local_15 > 7) _local_15 = (8 - _local_15);
                        }
                        else
                        {
                            if(_local_15 < 0)
                            {
                                _local_15 = (_local_15 + 8);
                            }
                            else if(_local_15 > 7) _local_15 = (_local_15 - 8);
                        }

                        if(this._scale === AvatarScaleType.LARGE)
                        {
                            _local_11.x = _local_18.dx;
                            _local_11.y = _local_18.dy;
                        }
                        else
                        {
                            _local_11.x = (_local_18.dx / 2);
                            _local_11.y = (_local_18.dy / 2);
                        }

                        frameCount = _local_18._Str_891;

                        if(_local_18.action)
                        {
                            _local_7 = _local_18.action;
                        }

                        if(_local_18.type === AnimationLayerData.BODYPART)
                        {
                            if(_local_18.action != null)
                            {
                                _local_8 = _local_18.action;
                            }

                            _local_5 = _local_15;
                        }
                        else if(_local_18.type === AnimationLayerData.FX) _local_5 = _local_15;

                        _local_10 = _local_18.items;
                    }

                    _local_9 = _local_16._Str_652;
                }
            }
        }

        let _local_12 = _local_4._Str_1961(_local_8);

        if(!_local_12 || _arg_3)
        {
            _local_12 = new AvatarImageBodyPartCache();
            _local_4._Str_1765(_local_8, _local_12);
        }

        let _local_13 = _local_12._Str_2070(_local_5);

        if(!_local_13 || _arg_3)
        {
            const _local_19 = this._structure._Str_713(k, this._avatar._Str_784(), _local_8, this._geometryType, _local_5, _local_9, this._avatar, _local_10);
            
            _local_13 = new AvatarImageDirectionCache(_local_19);

            _local_12._Str_2168(_local_5, _local_13);
        }

        let _local_14 = _local_13._Str_1629(frameCount);

        if(!_local_14 || _arg_3)
        {
            const _local_20 = _local_13._Str_1699();

            _local_14 = this._Str_1834(_local_5, _local_20, frameCount, _local_7, _arg_3);

            if(_local_14 && !_arg_3)
            {
                if(_local_14._Str_1807) _local_13._Str_1924(_local_14, frameCount);
            }
            else
            {
                return null;
            }
        }

        const offset = this._structure._Str_1888(_local_8, _local_5, frameCount, k);

        _local_11.x += offset.x;
        _local_11.y += offset.y;

        _local_14.offset = _local_11;

        return _local_14;
    }

    public _Str_1009(): any[]
    {
        this._serverRenderData = [];

        return this._serverRenderData;
    }

    public _Str_1050(k: string): AvatarImageActionCache
    {
        let existing = this._cache.get(k);

        if(!existing)
        {
            existing = new AvatarImageActionCache();

            this._cache.set(k, existing);
        }

        return existing;
    }

    private _Str_1834(direction: number, containers: AvatarImagePartContainer[], frameCount: number, _arg_4: IActiveActionData, renderServerData: boolean = false): AvatarImageBodyPartContainer
    {
        if(!containers || !containers.length) return null;

        if(!this._canvas)
        {
            this._canvas = this._structure._Str_1664(this._scale, this._geometryType);

            if(!this._canvas) return null;
        }

        let isFlipped           = AvatarDirectionAngle.DIRECTION_IS_FLIPPED[direction] || false;
        let assetPartDefinition = _arg_4._Str_742._Str_778;
        let isCacheable         = true;
        let containerIndex      = (containers.length - 1);

        while(containerIndex >= 0)
        {
            const container = containers[containerIndex];

            let color = 16777215;

            if(!((direction == 7) && ((container._Str_1669 === 'fc') || (container._Str_1669 === 'ey'))))
            {
                if(!((container._Str_1669 === 'ri') && !container._Str_1502))
                {
                    const partId            = container._Str_1502;
                    const animationFrame    = container._Str_2258(frameCount);

                    let partType    = container._Str_1669;
                    let frameNumber = 0;

                    if(animationFrame)
                    {
                        frameNumber = animationFrame.number;

                        if((animationFrame._Str_778) && (animationFrame._Str_778 !== '')) assetPartDefinition = animationFrame._Str_778;
                    }
                    else frameNumber = container._Str_1674(frameCount);

                    let assetDirection  = direction;
                    let flipH           = false;

                    if(isFlipped)
                    {
                        if(((assetPartDefinition === 'wav') && (((partType === AvatarFigurePartType.LEFT_HAND) || (partType === AvatarFigurePartType.LEFT_SLEEVE)) || (partType === AvatarFigurePartType.LEFT_COAT_SLEEVE))) || ((assetPartDefinition === 'drk') && (((partType === AvatarFigurePartType.RIGHT_HAND) || (partType === AvatarFigurePartType.RIGHT_SLEEVE)) || (partType === AvatarFigurePartType.RIGHT_COAT_SLEEVE))) || ((assetPartDefinition === 'blw') && (partType === AvatarFigurePartType.RIGHT_HAND)) || ((assetPartDefinition === 'sig') && (partType === AvatarFigurePartType.LEFT_HAND)) || ((assetPartDefinition === 'respect') && (partType === AvatarFigurePartType.LEFT_HAND)) || (partType === AvatarFigurePartType.RIGHT_HAND_ITEM) || (partType === AvatarFigurePartType.LEFT_HAND_ITEM) || (partType === AvatarFigurePartType.CHEST_PRINT))
                        {
                            flipH = true;
                        }
                        else
                        {
                            if(direction === 4)         assetDirection = 2;
                            else if(direction === 5)    assetDirection = 1;
                            else if(direction === 6)    assetDirection = 0;

                            if(container._Str_1666 !== partType) partType = container._Str_1666;
                        }
                    }

                    let assetName   = (this._scale + '_' + assetPartDefinition + '_' + partType + '_' + partId + '_' + assetDirection + '_' + frameNumber);
                    let asset       = this._assets.getAsset(assetName);

                    if(!asset)
                    {
                        assetName   = (this._scale + '_std_' + partType + '_' + partId + '_' + assetDirection + '_0');
                        asset       = this._assets.getAsset(assetName);
                    }

                    if(asset)
                    {
                        const texture = asset.texture;

                        if(!texture || !texture.valid || !texture.baseTexture)
                        {
                            isCacheable = false;
                        }
                        else
                        {
                            if(container.isColorable && container.color) color = container.color._Str_915;

                            const offset = new PIXI.Point(-(asset.x), -(asset.y));

                            if(flipH) offset.x = (offset.x + ((this._scale === AvatarScaleType.LARGE) ? 65 : 31));

                            if(renderServerData)
                            {
                                const spriteData = new RoomObjectSpriteData();

                                spriteData.name      = this._assets._Str_2125(assetName);
                                spriteData.x         = (-(offset.x) - 33);
                                spriteData.y         = -(offset.y);
                                spriteData.z         = (this._serverRenderData.length * -0.0001);
                                spriteData.width     = asset.rectangle.width;
                                spriteData.height    = asset.rectangle.height;
                                spriteData.flipH     = flipH;

                                if(assetPartDefinition === 'lay') spriteData.x = (spriteData.x + 53);

                                if(isFlipped)
                                {
                                    spriteData.flipH = (!(spriteData.flipH));

                                    if(spriteData.flipH) spriteData.x = (-(spriteData.x) - texture.width);
                                    else spriteData.x = (spriteData.x + 65);
                                }

                                if(container.isColorable) spriteData.color = `${ color }`;

                                this._serverRenderData.push(spriteData);
                            }

                            this._unionImages.push(new ImageData(texture, asset.rectangle, offset, flipH, color));
                        }
                    }
                }
            }

            containerIndex--;
        }

        if(!this._unionImages.length) return null;

        const imageData     = this._Str_1236(this._unionImages, isFlipped);
        const canvasOffset  = ((this._scale === AvatarScaleType.LARGE) ? (this._canvas.height - 16) : (this._canvas.height - 8));
        const offset        = new PIXI.Point(-(imageData._Str_1076.x), (canvasOffset - imageData._Str_1076.y));

        if(isFlipped && (assetPartDefinition !== 'lay')) offset.x = (offset.x + ((this._scale === AvatarScaleType.LARGE) ? 67 : 31));

        let imageIndex = (this._unionImages.length - 1);

        while(imageIndex >= 0)
        {
            const _local_17 = this._unionImages.pop();

            if(_local_17) _local_17.dispose();

            imageIndex--;
        }
        
        return new AvatarImageBodyPartContainer(imageData.bitmap, offset, isCacheable);
    }

    private _Str_1652(k: number): string
    {
        var _local_2: string = (k * 0xFF).toString(16);
        if (_local_2.length < 2)
        {
            _local_2 = ('0' + _local_2);
        }
        return _local_2;
    }

    private _Str_1236(k: ImageData[], isFlipped: boolean): ImageData
    {
        let bounds = new PIXI.Rectangle();

        for(let data of k) data && bounds.enlarge(data._Str_1567);

        const point     = new PIXI.Point(-(bounds.x), -(bounds.y));
        const container = new PIXI.Graphics()
            .drawRect(0, 0, bounds.width, bounds.height);

        for(let data of k)
        {
            if(!data) continue;

            const texture   = data.bitmap;
            const color     = data.color;
            const flipH     = (!(isFlipped && data.flipH) && (isFlipped || data.flipH));
            const regPoint  = point.clone();

            regPoint.x -= data._Str_1076.x;
            regPoint.y -= data._Str_1076.y;

            if(isFlipped) regPoint.x = (container.width - (regPoint.x + data.rect.width));

            if(flipH)
            {
                this._matrix.a  = -1;
                this._matrix.tx = ((data.rect.x + data.rect.width) + regPoint.x);
                this._matrix.ty = (regPoint.y - data.rect.y);
            }
            else
            {
                this._matrix.a = 1;
                this._matrix.tx = (regPoint.x - data.rect.x);
                this._matrix.ty = (regPoint.y - data.rect.y);
            }

            container
                    .beginTextureFill({ texture, matrix: this._matrix, color })
                    .drawRect(regPoint.x, regPoint.y, data.rect.width, data.rect.height)
                    .endFill();
        }

        const texture = TextureUtils.generateTexture(container);

        return new ImageData(texture, container.getLocalBounds(), point, isFlipped, null);
    }
}