import { AlphaTolerance } from '../../../../../room/object/enum/AlphaTolerance';
import { RoomObjectSpriteType } from '../../../../../room/object/enum/RoomObjectSpriteType';
import { IRoomObjectModel } from '../../../../../room/object/IRoomObjectModel';
import { IPlaneVisualization } from '../../../../../room/object/visualization/IPlaneVisualization';
import { IRoomObjectSprite } from '../../../../../room/object/visualization/IRoomObjectSprite';
import { IObjectVisualizationData } from '../../../../../room/object/visualization/IRoomObjectVisualizationData';
import { IRoomPlane } from '../../../../../room/object/visualization/IRoomPlane';
import { RoomObjectSpriteVisualization } from '../../../../../room/object/visualization/RoomObjectSpriteVisualization';
import { IRoomGeometry } from '../../../../../room/utils/IRoomGeometry';
import { Vector3d } from '../../../../../room/utils/Vector3d';
import { RoomMapMaskData } from '../../RoomMapMaskData';
import { RoomObjectVariable } from '../../RoomObjectVariable';
import { RoomPlaneBitmapMaskData } from '../../RoomPlaneBitmapMaskData';
import { RoomPlaneBitmapMaskParser } from '../../RoomPlaneBitmapMaskParser';
import { RoomPlaneData } from '../../RoomPlaneData';
import { RoomPlaneParser } from '../../RoomPlaneParser';
import { RoomPlane } from './RoomPlane';
import { RoomVisualizationData } from './RoomVisualizationData';

export class RoomVisualization extends RoomObjectSpriteVisualization implements IPlaneVisualization
{
    public static _Str_18544: number    = 0xFFFFFF;
    public static _Str_18640: number    = 0xDDDDDD;
    public static _Str_16664: number    = 0xBBBBBB;
    private static _Str_14503: number   = 0xFFFFFF;
    private static _Str_15851: number   = 0xCCCCCC;
    private static _Str_13715: number   = 0x999999;
    private static _Str_14868: number   = 0x999999;
    public static _Str_17403: number    = 0xFFFFFF;
    public static _Str_16113: number    = 0xCCCCCC;
    public static _Str_18370: number    = 0x999999;
    private static _Str_8621: number    = 1000;

    protected _data: RoomVisualizationData;

    private _roomPlaneParser: RoomPlaneParser;
    private _roomPlaneBitmapMaskParser: RoomPlaneBitmapMaskParser;

    private _geometryUpdateId: number;
    private _directionX: number;
    private _directionY: number;
    private _directionZ: number;
    private _floorThickness: number;
    private _wallThickness: number;
    private _holeUpdateTime: number;
    private _Str_2540: RoomPlane[];
    private _Str_4864: RoomPlane[];
    private _Str_6648: number[];
    private _roomScale: number;
    private _lastUpdateTime: number;
    private _updateIntervalTime: number;
    private _wallType: string;
    private _floorType: string;
    private _landscapeType: string;
    private _colorBackgroundOnly: boolean;
    private _color: number;
    private _redColor: number;
    private _greenColor: number;
    private _blueColor: number;
    private _typeVisibility: boolean[];
    private _Str_5928: number;
    private _maskData: RoomMapMaskData;
    private _isPlaneSet: boolean;

    constructor()
    {
        super();

        this._data                      = null;

        this._roomPlaneParser           = new RoomPlaneParser();
        this._roomPlaneBitmapMaskParser = new RoomPlaneBitmapMaskParser();

        this._geometryUpdateId          = -1;
        this._directionX                = 0;
        this._directionY                = 0;
        this._directionZ                = 0;
        this._floorThickness            = 1;
        this._wallThickness             = 1;
        this._holeUpdateTime            = NaN;
        this._Str_2540                  = [];
        this._Str_4864                  = [];
        this._Str_6648                  = [];
        this._roomScale                     = 0;
        this._lastUpdateTime            = -1000;
        this._updateIntervalTime        = 250;
        this._wallType                  = null;
        this._floorType                 = null;
        this._landscapeType             = null;
        this._colorBackgroundOnly       = true;
        this._color                     = 0xFFFFFF;
        this._redColor                  = 0xFF;
        this._greenColor                = 0xFF;
        this._blueColor                 = 0xFF;
        this._typeVisibility            = [];
        this._Str_5928                  = 0;
        this._maskData                  = null;
        this._isPlaneSet                = false;

        this._typeVisibility[RoomPlane.TYPE_UNDEFINED]  = false;
        this._typeVisibility[RoomPlane.TYPE_FLOOR]      = true;
        this._typeVisibility[RoomPlane.TYPE_WALL]       = true;
        this._typeVisibility[RoomPlane.TYPE_LANDSCAPE]  = true;
    }

    public initialize(data: IObjectVisualizationData): boolean
    {
        if(!(data instanceof RoomVisualizationData)) return false;
        
        this._data = data;

        super.initialize(data);

        this._data.setGraphicAssetCollection(this.asset);

        return true;
    }

    public dispose(): void
    {
        super.dispose();

        this.clearPlanes();

        this._Str_2540  = null;
        this._Str_4864  = null;
        this._Str_6648  = null;

        if(this._roomPlaneParser)
        {
            this._roomPlaneParser.dispose();

            this._roomPlaneParser = null;
        }

        if(this._roomPlaneBitmapMaskParser)
        {
            this._roomPlaneBitmapMaskParser.dispose();

            this._roomPlaneBitmapMaskParser = null;
        }

        if(this._data)
        {
            this._data._Str_3355();

            this._data = null;
        }
    }

    protected reset(): void
    {
        super.reset();
        
        this._floorType         = null;
        this._wallType          = null;
        this._landscapeType     = null;
        this._maskData          = null;
        this._geometryUpdateId  = -1;
        this._roomScale             = 0;
    }

    public update(geometry: IRoomGeometry, time: number, update: boolean, skipUpdate: boolean): void
    {
        if(!this.object || !geometry) return;

        const geometryUpdate    = this.updateGeometry(geometry);
        const objectModel       = this.object.model;

        let needsUpdate = false;

        if(this.updateThickness(objectModel)) needsUpdate = true;

        if(this.updateHole(objectModel)) needsUpdate = true;

        this._Str_25732();

        needsUpdate = this.updateMasks(objectModel);

        if(((time < (this._lastUpdateTime + this._updateIntervalTime)) && (!geometryUpdate)) && (!needsUpdate)) return;

        if(this.updatePlanes(objectModel)) needsUpdate = true;

        if(this._Str_16913(geometry, geometryUpdate, time)) needsUpdate = true;

        if(needsUpdate)
        {
            let index = 0;

            while(index < this._Str_4864.length)
            {
                const spriteIndex   = this._Str_6648[index];
                const sprite        = this.getSprite(spriteIndex);
                const plane         = this._Str_4864[index];

                if(sprite && plane && (plane.type !== RoomPlane.TYPE_LANDSCAPE))
                {
                    if(this._colorBackgroundOnly)
                    {
                        let _local_14 = plane.color;

                        const _local_15 = (((_local_14 & 0xFF) * this._redColor) / 0xFF);
                        const _local_16 = ((((_local_14 >> 8) & 0xFF) * this._greenColor) / 0xFF);
                        const _local_17 = ((((_local_14 >> 16) & 0xFF) * this._blueColor) / 0xFF);
                        const _local_18 = (_local_14 >> 24);

                        _local_14 = ((((_local_18 << 24) + (_local_17 << 16)) + (_local_16 << 8)) + _local_15);
                        
                        sprite.color = _local_14;
                    }
                    else
                    {
                        sprite.color = plane.color;
                    }
                }

                index++;
            }

            this.updateSpriteCounter++;
        }
        
        this.updateModelCounter = objectModel.updateCounter;
        this._lastUpdateTime    = time;
    }

    private updateGeometry(k: IRoomGeometry): boolean
    {
        if(!k) return false;

        if(this._geometryUpdateId === k.updateId) return false;

        this._geometryUpdateId = k.updateId;

        const direction = k.direction;

        if(direction && ((direction.x !== this._directionX) || (direction.y !== this._directionY) || (direction.z !== this._directionZ) || (k.scale !== this._roomScale)))
        {
            this._directionX    = direction.x;
            this._directionY    = direction.y;
            this._directionZ    = direction.z;
            this._roomScale     = k.scale;

            return true;
        }
        
        return false;
    }

    private updateThickness(k: IRoomObjectModel): boolean
    {
        if(this.updateModelCounter === k.updateCounter) return false;

        const floorThickness    = k.getValue(RoomObjectVariable.ROOM_FLOOR_THICKNESS) as number;
        const wallThickness     = k.getValue(RoomObjectVariable.ROOM_WALL_THICKNESS) as number;

        if(!isNaN(floorThickness) && !isNaN(wallThickness) && (floorThickness !== this._floorThickness) || (wallThickness !== this._wallThickness))
        {            
            this._floorThickness    = floorThickness;
            this._wallThickness     = wallThickness;

            this.clearPlanes();

            return true;
        }

        return false;
    }

    private updateHole(k: IRoomObjectModel): boolean
    {
        if(this.updateModelCounter === k.updateCounter) return false;

        const holeUpdate = k.getValue(RoomObjectVariable.ROOM_FLOOR_HOLE_UPDATE_TIME);

        if(!isNaN(holeUpdate) && (holeUpdate !== this._holeUpdateTime))
        {
            this._holeUpdateTime = holeUpdate;

            this.clearPlanes();

            return true;
        }

        return false;
    }

    private updateMasks(k: IRoomObjectModel): boolean
    {
        if(this.updateModelCounter === k.updateCounter) return false;

        let didUpdate = false;

        const planeMask = k.getValue(RoomObjectVariable.ROOM_PLANE_MASK_XML) as RoomMapMaskData;

        if(planeMask !== this._maskData)
        {
            this._Str_15935(planeMask);

            this._maskData = planeMask;

            didUpdate = true;
        }

        const backgroundColor = k.getValue(RoomObjectVariable.ROOM_BACKGROUND_COLOR) as number;

        if(backgroundColor !== this._color)
        {
            this._color         = backgroundColor;
            this._redColor      = (this._color & 0xFF);
            this._greenColor    = ((this._color >> 8) & 0xFF);
            this._blueColor     = ((this._color >> 16) & 0xFF);

            didUpdate = true;
        }

        const backgroundOnly = k.getValue(RoomObjectVariable.ROOM_COLORIZE_BG_ONLY) || false;

        if(backgroundOnly !== this._colorBackgroundOnly)
        {

            this._colorBackgroundOnly = backgroundOnly;

            didUpdate = true;
        }

        return didUpdate;
    }

    private updatePlanes(k: IRoomObjectModel): boolean
    {
        if(this.updateModelCounter === k.updateCounter) return false;

        const floorType     = k.getValue(RoomObjectVariable.ROOM_FLOOR_TYPE) as string;
        const wallType      = k.getValue(RoomObjectVariable.ROOM_WALL_TYPE) as string;
        const landscapeType = k.getValue(RoomObjectVariable.ROOM_LANDSCAPE_TYPE) as string;

        this.updatePlaneTypes(floorType, wallType, landscapeType);

        const floorVisibility       = k.getValue(RoomObjectVariable.ROOM_FLOOR_VISIBILITY) === 1;
        const wallVisibility        = k.getValue(RoomObjectVariable.ROOM_WALL_VISIBILITY) === 1;
        const landscapeVisibility   = k.getValue(RoomObjectVariable.ROOM_LANDSCAPE_VISIBILITY) === 1;

        this.updatePlaneVisibility(floorVisibility, wallVisibility, landscapeVisibility)

        return true;
    }

    private clearPlanes(): void
    {
        if(this._Str_2540)
        {
            let index = 0;

            while(index < this._Str_2540.length)
            {
                const plane = this._Str_2540[index];

                if(plane) plane.dispose();

                index++;
            }

            this._Str_2540 = [];
        }
        
        this._isPlaneSet    = false;
        this._Str_5928      = (this._Str_5928 + 1);

        this.reset();
    }

    protected _Str_25732(): void
    {
        if(!this.object || this._isPlaneSet) return;

        if(!isNaN(this._floorThickness)) this._roomPlaneParser.floorThicknessMultiplier = this._floorThickness;

        if(!isNaN(this._wallThickness)) this._roomPlaneParser.wallThicknessMultiplier = this._wallThickness;

        const mapData = this.object.model.getValue(RoomObjectVariable.ROOM_MAP_DATA);

        if(!this._roomPlaneParser.initializeFromMapData(mapData)) return;

        const _local_3 = this._Str_23949();
        const _local_4 = this._Str_23063();

        let _local_5    = 0;
        let _local_6    = this.object.model.getValue(RoomObjectVariable.ROOM_RANDOM_SEED) as number;
        let index       = 0;

        while(index < this._roomPlaneParser.planeCount)
        {
            const _local_8  = this._roomPlaneParser.getPlaneLocation(index);
            const _local_9  = this._roomPlaneParser.getPlaneLeftSide(index);
            const _local_10 = this._roomPlaneParser.getPlaneRightSide(index);
            const _local_11 = this._roomPlaneParser.getPlaneSecondaryNormals(index);
            const planeType = this._roomPlaneParser.getPlaneType(index);

            let _local_13 = null;
            
            if(_local_8 && _local_9 && _local_10)
            {
                const _local_14 = Vector3d.crossProduct(_local_9, _local_10);

                _local_6    = ((_local_6 * 7613) + 517);
                _local_13   = null;

                if(planeType === RoomPlaneData.PLANE_FLOOR)
                {
                    const _local_15 = ((_local_8.x + _local_9.x) + 0.5);
                    const _local_16 = ((_local_8.y + _local_10.y) + 0.5);
                    const _local_17 = (Math.trunc(_local_15) - _local_15);
                    const _local_18 = (Math.trunc(_local_16) - _local_16);

                    _local_13 = new RoomPlane(this.object.getLocation(), _local_8, _local_9, _local_10, RoomPlane.TYPE_FLOOR, true, _local_11, _local_6, -(_local_17), -(_local_18));

                    if(_local_14.z !== 0)
                    {
                        _local_13.color = RoomVisualization._Str_18544;
                    }
                    else
                    {
                        _local_13.color = ((_local_14.x !== 0) ? RoomVisualization._Str_16664 : RoomVisualization._Str_18640);
                    }

                    if(this._data) _local_13.rasterizer = this._data.floorRasterizer;
                }
                
                else if (planeType === RoomPlaneData.PLANE_WALL)
                {
                    /*_local_13 = new RoomPlane(this.object.getLocation(), _local_8, _local_9, _local_10, RoomPlane.TYPE_WALL, true, _local_11, _local_6);

                    if((_local_9.length < 1) || (_local_10.length < 1))
                    {
                        _local_13._Str_18448 = false;
                    }

                    if((_local_14.x === 0) && (_local_14.y === 0))
                    {
                        _local_13.color = RoomVisualization._Str_14868;
                    }
                    else
                    {
                        if (_local_14.y > 0)
                        {
                            _local_13.color = RoomVisualization._Str_14503;
                        }
                        else
                        {
                            if(_local_14.y === 0)
                            {
                                _local_13.color = RoomVisualization._Str_15851;
                            }
                            else
                            {
                                _local_13.color = RoomVisualization._Str_13715;
                            }
                        }
                    }

                    if(this._data) _local_13.rasterizer = this._data.wallRasterizer;*/
                }
                
                else if(planeType === RoomPlaneData.PLANE_LANDSCAPE)
                {
                    _local_13 = new RoomPlane(this.object.getLocation(), _local_8, _local_9, _local_10, RoomPlane.TYPE_LANDSCAPE, true, _local_11, _local_6, _local_5, 0, _local_3, _local_4);
                    if (_local_14.y > 0)
                    {
                        _local_13.color = RoomVisualization._Str_17403;
                    }
                    else
                    {
                        if (_local_14.y == 0)
                        {
                            _local_13.color = RoomVisualization._Str_16113;
                        }
                        else
                        {
                            _local_13.color = RoomVisualization._Str_18370;
                        }
                    }

                    if(this._data) _local_13.rasterizer = this._data.landscapeRasterizer;
                    
                    _local_5 = (_local_5 + _local_9.length);
                }
                
                else if (planeType == RoomPlaneData.PLANE_BILLBOARD)
                {
                    _local_13 = new RoomPlane(this.object.getLocation(), _local_8, _local_9, _local_10, RoomPlane.TYPE_WALL, true, _local_11, _local_6);
                    if (((_local_9.length < 1) || (_local_10.length < 1)))
                    {
                        _local_13._Str_18448 = false;
                    }
                    if (((_local_14.x == 0) && (_local_14.y == 0)))
                    {
                        _local_13.color = RoomVisualization._Str_14868;
                    }
                    else
                    {
                        if (_local_14.y > 0)
                        {
                            _local_13.color = RoomVisualization._Str_14503;
                        }
                        else
                        {
                            if (_local_14.y == 0)
                            {
                                _local_13.color = RoomVisualization._Str_15851;
                            }
                            else
                            {
                                _local_13.color = RoomVisualization._Str_13715;
                            }
                        }
                    }
                    // if (this._Str_594 != null)
                    // {
                    //     _local_13.rasterizer = this._Str_594._Str_23913;
                    // }
                }


                if(_local_13)
                {
                    _local_13._Str_16279 = this._data.maskManager;

                    let _local_19 = 0;
                    
                    while (_local_19 < this._roomPlaneParser.getPlaneMaskCount(index))
                    {
                        const _local_20 = this._roomPlaneParser.getPlaneMaskLeftSideLoc(index, _local_19);
                        const _local_21 = this._roomPlaneParser.getPlaneMaskRightSideLoc(index, _local_19);
                        const _local_22 = this._roomPlaneParser.getPlaneMaskLeftSideLength(index, _local_19);
                        const _local_23 = this._roomPlaneParser.getPlaneMaskRightSideLength(index, _local_19);

                        _local_13._Str_24758(_local_20, _local_21, _local_22, _local_23);
                        
                        _local_19++;
                    }

                    this._Str_2540.push(_local_13);
                }
            }
            else
            {
                return;
            }

            index++;
        }

        this._isPlaneSet = true;
        this._Str_18024();
    }

    protected _Str_18024(): void
    {
        this.setSpriteCount(this._Str_2540.length);

        let planeIndex = 0;

        while(planeIndex < this._Str_2540.length)
        {
            const plane     = this._Str_2540[planeIndex];
            const sprite    = this.getSprite(planeIndex);

            if(plane && sprite && plane._Str_5424 && plane._Str_4968)
            {
                if((plane.type === RoomPlane.TYPE_WALL) && ((plane._Str_5424.length < 1) || (plane._Str_4968.length < 1)))
                {
                    sprite.alphaTolerance = AlphaTolerance._Str_9268;
                }
                else
                {
                   sprite.alphaTolerance = AlphaTolerance._Str_9735;
                }
                
                if(plane.type === RoomPlane.TYPE_WALL)
                {
                    sprite.tag = 'plane.wall@' + (planeIndex + 1);
                }

                else if(plane.type === RoomPlane.TYPE_FLOOR)
                {
                    sprite.tag = 'plane.floor@' + (planeIndex + 1);
                }

                else
                {
                    sprite.tag = 'plane@' + (planeIndex + 1);
                }
                
                sprite.spriteType = RoomObjectSpriteType._Str_8616;
            }

            planeIndex++;
        }
    }

    private _Str_23949(): number
    {
        let length  = 0;
        let index   = 0;

        while(index < this._roomPlaneParser.planeCount)
        {
            const type = this._roomPlaneParser.getPlaneType(index);

            if(type === RoomPlaneData.PLANE_LANDSCAPE)
            {
                const vector = this._roomPlaneParser.getPlaneLeftSide(index);

                length += vector.length;
            }

            index++;
        }

        return length;
    }

    private _Str_23063(): number
    {
        let length  = 0;
        let index   = 0;

        while(index < this._roomPlaneParser.planeCount)
        {
            const type = this._roomPlaneParser.getPlaneType(index);

            if(type === RoomPlaneData.PLANE_LANDSCAPE)
            {
                const vector = this._roomPlaneParser.getPlaneRightSide(index);

                if(vector.length > length) length = vector.length;
            }

            index++;
        }

        if(length > 5) length = 5;

        return length;
    }

    protected updatePlaneTypes(floorType: string, wallType: string, landscapeType: string): boolean
    {
        if(floorType !== this._floorType) this._floorType = floorType;
        else floorType = null;

        if(wallType !== this._wallType) this._wallType = wallType;
        else wallType = null;

        if(landscapeType !== this._landscapeType) this._landscapeType = landscapeType;
        else landscapeType = null;

        if(!floorType && !wallType && !landscapeType) return false;

        let index = 0;

        while (index < this._Str_2540.length)
        {
            const plane = this._Str_2540[index];

            if(plane)
            {
                if((plane.type === RoomPlane.TYPE_FLOOR) && floorType)
                {
                    plane.id = floorType;
                }

                else if((plane.type === RoomPlane.TYPE_WALL) && wallType)
                {
                    plane.id = wallType;
                }

                else if((plane.type === RoomPlane.TYPE_LANDSCAPE) && landscapeType)
                {
                    plane.id = landscapeType;
                }
            }

            index++;
        }

        return true;
    }

    private updatePlaneVisibility(k: boolean, _arg_2: boolean, _arg_3: boolean): void
    {
        if((k === this._typeVisibility[RoomPlane.TYPE_FLOOR]) && (_arg_2 === this._typeVisibility[RoomPlane.TYPE_WALL]) && (_arg_3 === this._typeVisibility[RoomPlane.TYPE_LANDSCAPE])) return;
        
        this._typeVisibility[RoomPlane.TYPE_FLOOR]      = k;
        this._typeVisibility[RoomPlane.TYPE_WALL]       = _arg_2;
        this._typeVisibility[RoomPlane.TYPE_LANDSCAPE]  = _arg_3;
        
        this._Str_4864 = [];
        this._Str_6648 = [];
    }

    protected _Str_16913(k: IRoomGeometry, _arg_2: boolean, _arg_3: number): boolean
    {
        if(!k || !this.object) return;

        this._Str_5928++;

        if(_arg_2)
        {
            this._Str_4864 = [];
            this._Str_6648 = [];
        }

        const _local_8 = (this._Str_4864.length > 0);

        let _local_6 = this._Str_4864;

        if(!this._Str_4864.length) _local_6 = this._Str_2540;

        let depth   = 0;
        let updated = false;
        let index   = 0;

        while (index < _local_6.length)
        {
            let _local_10 = index;

            if(_local_8) _local_10 = this._Str_6648[index];

            const _local_11 = this.getSprite(_local_10);

            if(_local_11)
            {
                const _local_12 = _local_6[index];

                if(_local_12)
                {
                    _local_11.id = _local_12.uniqueId;

                    if(_local_12.update(k, _arg_3))
                    {
                        if(_local_12.visible)
                        {
                            depth = ((_local_12.relativeDepth + this._Str_24891) + (_local_10 / 1000));

                            if(_local_12.type !== RoomPlane.TYPE_FLOOR)
                            {
                                depth = ((_local_12.relativeDepth + this._Str_25403) + (_local_10 / 1000));

                                if((_local_12._Str_5424.length < 1) || (_local_12._Str_4968.length < 1))
                                {
                                    depth = (depth + (RoomVisualization._Str_8621 * 0.5));
                                }
                            }

                            const _local_14 = ((("plane " + _local_10) + " ") + k.scale);

                            this._Str_7421(_local_11, _local_12, _local_14, depth);
                        }
                        updated = true;
                    }
                    if (_local_11.visible != ((_local_12.visible) && (this._typeVisibility[_local_12.type])))
                    {
                        _local_11.visible = (!(_local_11.visible));
                        updated = true;
                    }
                    if (_local_11.visible)
                    {
                        if (!_local_8)
                        {
                            this._Str_4864.push(_local_12);
                            this._Str_6648.push(index);
                        }
                    }
                }
                else
                {
                    _local_11.id = 0;
                    if (_local_11.visible)
                    {
                        _local_11.visible = false;
                        updated = true;
                    }
                }
            }
            index++;
        }
        
        return updated;
    }

    protected _Str_15935(k: RoomMapMaskData): void
    {
        if(!k) return;

        this._roomPlaneBitmapMaskParser.initialize(k);

        const _local_4: number[] = [];
        const _local_5: number[] = [];

        let _local_6    = false;
        let index       = 0;

        while(index < this._Str_2540.length)
        {
            const plane = this._Str_2540[index];

            if(plane)
            {
                plane._Str_25213();

                if(plane.type === RoomPlane.TYPE_LANDSCAPE) _local_4.push(index);
            }

            index++;
        }

        for(let mask of this._roomPlaneBitmapMaskParser.masks.values())
        {
            const _local_10 = this._roomPlaneBitmapMaskParser._Str_21678(mask);
            const _local_11 = this._roomPlaneBitmapMaskParser._Str_19038(mask);
            const _local_12 = this._roomPlaneBitmapMaskParser._Str_21644(mask);

            if(_local_11)
            {
                let _local_13 = 0;

                while (_local_13 < this._Str_2540.length)
                {
                    const _local_3 = this._Str_2540[_local_13];

                    if((_local_3.type === RoomPlane.TYPE_WALL) || (_local_3.type === RoomPlane.TYPE_LANDSCAPE))
                    {
                        if(_local_3 && _local_3.location && _local_3.normal)
                        {
                            const _local_14 = Vector3d.dif(_local_11, _local_3.location);
                            const _local_15 = Math.abs(Vector3d.scalarProjection(_local_14, _local_3.normal));

                            if(_local_15 < 0.01)
                            {
                                if(_local_3._Str_5424 && _local_3._Str_4968)
                                {
                                    const _local_16 = Vector3d.scalarProjection(_local_14, _local_3._Str_5424);
                                    const _local_17 = Vector3d.scalarProjection(_local_14, _local_3._Str_4968);

                                    if((_local_3.type === RoomPlane.TYPE_WALL) || ((_local_3.type === RoomPlane.TYPE_LANDSCAPE) && (_local_12 === RoomPlaneBitmapMaskData.HOLE)))
                                    {
                                        _local_3._Str_24569(_local_10, _local_16, _local_17);
                                    }
                                    else
                                    {
                                        if (_local_3.type === RoomPlane.TYPE_LANDSCAPE)
                                        {
                                            if(!_local_3._Str_14801) _local_6 = true;

                                            _local_3._Str_14801 = true;

                                            _local_5.push(_local_13);
                                        }
                                    }
                                }
                            }
                        }
                    }

                    _local_13++;
                }
            }
        }

        index = 0;

        while(index < _local_4.length)
        {
            const planeIndex = _local_4[index];

            if(_local_5.indexOf(planeIndex) < 0)
            {
                const plane = this._Str_2540[planeIndex];

                plane._Str_14801    = false;
                _local_6            = true;
            }

            index++;
        }

        if(_local_6)
        {
            this._Str_4864 = [];
            this._Str_6648 = [];
        }
    }

    private _Str_7421(k: IRoomObjectSprite, _arg_2: RoomPlane, _arg_3: string, _arg_4: number): void
    {
        const offset = _arg_2.offset;

        k.offsetX           = -(offset.x);
        k.offsetY           = -(offset.y);
        k.relativeDepth     = _arg_4;
        k.color             = _arg_2.color;
        k.texture           = this._Str_22446(_arg_2, _arg_3);
        k.name              = ((_arg_3 + "_") + this._Str_5928);
    }

    private _Str_22446(k: RoomPlane, _arg_2: string): PIXI.Texture
    {
        return k.bitmapData;
    }

    public get _Str_19113(): IRoomPlane[]
    {
        const planes: IRoomPlane[] = [];

        for(let plane of this._Str_4864) planes.push(plane);

        return planes;
    }

    public get _Str_24891(): number
    {
        return RoomVisualization._Str_8621 + 0.1;
    }

    public get _Str_25403(): number
    {
        return RoomVisualization._Str_8621 + 0.5;
    }
}