import * as PIXI from 'pixi.js-legacy';
import { GraphicAsset } from '../../../core/asset/GraphicAsset';
import { RoomObjectSpriteData } from '../../../room/data/RoomObjectSpriteData';
import { NitroInstance } from '../../NitroInstance';
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
        const time = NitroInstance.instance.renderer.totalTimeRunning;

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

    public _Str_1629(k: string, _arg_2: number, _arg_3: boolean=false): AvatarImageBodyPartContainer
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

                const _local_16 = this._structure._Str_720(((_local_7._Str_742.state + ".") + _local_7._Str_727));
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

    private _Str_1834(direction: number, _arg_2: AvatarImagePartContainer[], frameCount: number, _arg_4:IActiveActionData, _arg_5: boolean=false):AvatarImageBodyPartContainer
    {
        var _local_8: boolean;
        var _local_9: number;
        var _local_17:ImageData;
        var _local_20: string;
        var _local_23: number;
        var _local_24: string;
        var bitmapAsset: GraphicAsset;
        var bitmapData: PIXI.Texture;
        let color: number = 0xFFFFFF;
        var _local_28: PIXI.Point;

        if(!_arg_2 || !_arg_2.length) return null;

        if (!this._canvas)
        {
            this._canvas = this._structure._Str_1664(this._scale, this._geometryType);

            if(!this._canvas) return null;
        }

        var assetDirection    = direction;
        var _local_7    = AvatarDirectionAngle._Str_1859[direction] || false;
        var _local_10   = _arg_4._Str_742._Str_778;
        var _local_11   = _arg_4._Str_742.state;
        var _local_12   = true;
        var _local_13   = (_arg_2.length - 1);

        _local_9 = _local_13;

        while (_local_9 >= 0)
        {
            const partContainer = _arg_2[_local_9];

            if(!((direction == 7) && ((partContainer._Str_1669 == "fc") || (partContainer._Str_1669 == "ey"))))
            {
                if (!((partContainer._Str_1669 == "ri") && (partContainer._Str_1502 == null)))
                {
                    const _local_19         = partContainer._Str_1360;

                    _local_20         = partContainer._Str_1669;
                    const _local_21         = partContainer._Str_1502;
                    const animationFrame    = partContainer._Str_2258(frameCount);

                    if(animationFrame)
                    {
                        _local_23 = animationFrame.number;

                        if((animationFrame._Str_778) && (!(animationFrame._Str_778 == "")))
                        {
                            _local_10 = animationFrame._Str_778;
                        }
                    }
                    else
                    {
                        _local_23 = partContainer._Str_1674(frameCount);
                    }

                    assetDirection = direction;
                    _local_8 = false;

                    if (_local_7)
                    {
                        if (((_local_10 == "wav") && (((_local_20 == AvatarFigurePartType.LEFT_HAND) || (_local_20 == AvatarFigurePartType.LEFT_SLEEVE)) || (_local_20 == AvatarFigurePartType.LEFT_COAT_SLEEVE))))
                        {
                            _local_8 = true;
                        }
                        else
                        {
                            if (((_local_10 == "drk") && (((_local_20 == AvatarFigurePartType.RIGHT_HAND) || (_local_20 == AvatarFigurePartType.RIGHT_SLEEVE)) || (_local_20 == AvatarFigurePartType.RIGHT_COAT_SLEEVE))))
                            {
                                _local_8 = true;
                            }
                            else
                            {
                                if (((_local_10 == "blw") && (_local_20 == AvatarFigurePartType.RIGHT_HAND)))
                                {
                                    _local_8 = true;
                                }
                                else
                                {
                                    if (((_local_10 == "sig") && (_local_20 == AvatarFigurePartType.LEFT_HAND)))
                                    {
                                        _local_8 = true;
                                    }
                                    else
                                    {
                                        if (((_local_10 == "respect") && (_local_20 == AvatarFigurePartType.LEFT_HAND)))
                                        {
                                            _local_8 = true;
                                        }
                                        else
                                        {
                                            if (_local_20 == AvatarFigurePartType.RIGHT_HAND_ITEM)
                                            {
                                                _local_8 = true;
                                            }
                                            else
                                            {
                                                if (_local_20 == AvatarFigurePartType.LEFT_HAND_ITEM)
                                                {
                                                    _local_8 = true;
                                                }
                                                else
                                                {
                                                    if (_local_20 == AvatarFigurePartType.CHEST_PRINT)
                                                    {
                                                        _local_8 = true;
                                                    }
                                                    else
                                                    {
                                                        if (direction == 4)
                                                        {
                                                            assetDirection = 2;
                                                        }
                                                        else
                                                        {
                                                            if (direction == 5)
                                                            {
                                                                assetDirection = 1;
                                                            }
                                                            else
                                                            {
                                                                if (direction == 6)
                                                                {
                                                                    assetDirection = 0;
                                                                }
                                                            }
                                                        }
                                                        if (partContainer._Str_1666 !== _local_20)
                                                        {
                                                            _local_20 = partContainer._Str_1666;
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }

                    _local_24 = ((((((((((this._scale + "_") + _local_10) + "_") + _local_20) + "_") + _local_21) + "_") + assetDirection) + "_") + _local_23);

                    bitmapAsset = this._assets.getAsset(_local_24);

                    if(!bitmapAsset)
                    {
                        _local_24 = (((((((this._scale + "_std_") + _local_20) + "_") + _local_21) + "_") + assetDirection) + "_0");

                        bitmapAsset = this._assets.getAsset(_local_24);
                    }

                    if (!bitmapAsset)
                    {
                    }
                    else
                    {
                        bitmapData = bitmapAsset.texture;

                        if (bitmapData == null)
                        {
                            _local_12 = false;
                        }
                        else
                        {
                            if(partContainer.isColorable && (partContainer.color !== null)) color = partContainer.color._Str_915;

                            _local_28 = new PIXI.Point(bitmapAsset.offsetX, bitmapAsset.offsetY);

                            if(_local_8)
                            {
                                _local_28.x = (_local_28.x + ((this._scale === AvatarScaleType.LARGE) ? 65 : 31));
                            }

                            if(_arg_5)
                            {
                                const _local_31 = new RoomObjectSpriteData();

                                _local_31.name      = this._assets._Str_2125(_local_24);
                                _local_31.x         = (-(_local_28.x) - 33);
                                _local_31.y         = -(_local_28.y);
                                _local_31.z         = (this._serverRenderData.length * -0.0001);
                                _local_31.width     = bitmapAsset.rectangle.width;
                                _local_31.height    = bitmapAsset.rectangle.height;
                                _local_31.flipH     = _local_8;

                                if(_local_10 === "lay") _local_31.x = (_local_31.x + 53);

                                if (_local_7)
                                {
                                    _local_31.flipH = (!(_local_31.flipH));

                                    if(_local_31.flipH) _local_31.x = (-(_local_31.x) - bitmapData.width);
                                    else _local_31.x = (_local_31.x + 65);
                                }

                                if(partContainer.isColorable) _local_31.color = `${ color }`;

                                this._serverRenderData.push(_local_31);
                            }

                            this._unionImages.push(new ImageData(bitmapData, bitmapAsset.rectangle, _local_28, _local_8, color));
                        }
                    }
                }
            }
            _local_9--;
        }
        if (this._unionImages.length == 0)
        {
            return null;
        }


        var _local_14:ImageData = this._Str_1236(this._unionImages, _local_7);
        var _local_15: number = ((this._scale == AvatarScaleType.LARGE) ? (this._canvas.height - 16) : (this._canvas.height - 8));
        var _local_16 = new PIXI.Point(-(_local_14._Str_1076.x), (_local_15 - _local_14._Str_1076.y));
        if (((_local_7) && (!(_local_10 == "lay"))))
        {
            _local_16.x = (_local_16.x + ((this._scale == AvatarScaleType.LARGE) ? 67 : 31));
        }
        _local_9 = (this._unionImages.length - 1);
        while (_local_9 >= 0)
        {
            _local_17 = this._unionImages.pop();
            if (_local_17)
            {
                _local_17.dispose();
            }
            _local_9--;
        }

        // const graphic = new PIXI.Graphics()
        //     .beginTextureFill({ texture: _local_14.bitmap })
        //     .drawRect(0, 0, _local_14.rect.width, _local_14.rect.height)
        //     .endFill();

        return new AvatarImageBodyPartContainer(_local_14.bitmap, _local_16, _local_12);
    }

    private _Str_1652(k: number): string
    {
        var _local_2: string = (k * 0xFF).toString(16);
        if (_local_2.length < 2)
        {
            _local_2 = ("0" + _local_2);
        }
        return _local_2;
    }

    private _Str_1236(k: ImageData[], flipH: boolean): ImageData
    {
        const bounds = new PIXI.Rectangle();
        
        for(let _local_4 of k) _local_4 && bounds.enlarge(_local_4._Str_1567);

        const _local_6 = new PIXI.Point(-(bounds.left), -(bounds.top));

        const container = new PIXI.Container();

        for(let _local_4 of k)
        {
            const point = _local_6.clone();

            point.x -= _local_4._Str_1076.x;
            point.y -= _local_4._Str_1076.x;

            const isFlip = (!(flipH && _local_4.flipH) && (flipH || _local_4.flipH));

            const sprite = PIXI.Sprite.from(_local_4.bitmap);

            sprite.tint = _local_4.color;
            sprite.position.set(_local_4._Str_1076.x, _local_4._Str_1076.y);

            if(isFlip)
            {
                sprite.scale.x     = -1;
                sprite.x *= -1;
            }

            container.addChild(sprite);
        }

        const texture = NitroInstance.instance.renderer.renderer.generateTexture(container, 1, 1);

        return new ImageData(texture, bounds, _local_6, flipH, null);
    }
}