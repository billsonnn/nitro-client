import * as PIXI from 'pixi.js-legacy';
import { IVector3D } from '../../../room/utils/IVector3D';
import { Vector3d } from '../../../room/utils/Vector3d';
import { RoomFloorHole } from './RoomFloorHole';
import { RoomMapData } from './RoomMapData';
import { RoomPlaneData } from './RoomPlaneData';
import { RoomWallData } from './RoomWallData';

export class RoomPlaneParser 
{
    private static _Str_6100: number = 0.25;
    private static _Str_6429: number = 0.25;
    private static _Str_13826: number = 20;
    public static _Str_3134: number = -110;
    public static _Str_5500: number = -100;

    private _tileMatrix: number[][];
    private _tileMatrixOriginal: number[][];
    private _width: number = 0;
    private _height: number = 0;
    private _minX: number = 0;
    private _maxX: number = 0;
    private _minY: number = 0;
    private _maxY: number = 0;
    private _planes: RoomPlaneData[];
    private _wallHeight: number = 0;
    private _wallThicknessMultiplier: number = 1;
    private _floorThicknessMultiplier: number = 1;
    private _fixedWallHeight: number = -1;
    private _floorHeight: number = 0;
    private _floorHoles: Map<number, RoomFloorHole>;
    private _floorHoleMatrix: boolean[][];

    constructor()
    {
        this._tileMatrix = [];
        this._tileMatrixOriginal = [];
        this._planes = [];
        this._floorHoleMatrix = [];
        this._wallHeight = 3.6;
        this._wallThicknessMultiplier = 1;
        this._floorThicknessMultiplier = 1;
        this._floorHoles = new Map();
    }

    private static _Str_14393(k: number[][]): number
    {
        var _local_8: number;
        var _local_2: number;
        var _local_3: number;
        var _local_4: number[];
        var _local_5: number = k.length;
        var _local_6: number;
        if (_local_5 == 0)
        {
            return 0;
        }
        var _local_7: number = 0;
        _local_3 = 0;
        while (_local_3 < _local_5)
        {
            _local_4 = k[_local_3];
            _local_2 = 0;
            while (_local_2 < _local_4.length)
            {
                _local_8 = Number(_local_4[_local_2]);
                if (_local_8 > _local_7)
                {
                    _local_7 = _local_8;
                }
                _local_2++;
            }
            _local_3++;
        }
        return _local_7;
    }

    private static _Str_19173(k: number[][]): PIXI.Point
    {
        if (k == null)
        {
            return null;
        }
        var _local_2: number;
        var _local_3: number;
        var _local_4: number[];
        var _local_5: number = k.length;
        if (_local_5 == 0)
        {
            return null;
        }
        var _local_6: number[] = [];
        _local_3 = 0;
        while (_local_3 < _local_5)
        {
            _local_4 = k[_local_3];
            if (((_local_4 == null) || (_local_4.length == 0)))
            {
                return null;
            }
            _local_2 = 0;
            while (_local_2 < _local_4.length)
            {
                if (Number(_local_4[_local_2]) >= 0)
                {
                    _local_6.push(_local_2);
                    break;
                }
                _local_2++;
            }
            if (_local_6.length < (_local_3 + 1))
            {
                _local_6.push((_local_4.length + 1));
            }
            _local_3++;
        }
        _local_3 = 1;
        while (_local_3 < (_local_6.length - 1))
        {
            if (((Math.floor(_local_6[_local_3]) <= (Math.floor(_local_6[(_local_3 - 1)]) - 1)) && (Math.floor(_local_6[_local_3]) <= (Math.floor(_local_6[(_local_3 + 1)]) - 1))))
            {
                return new PIXI.Point(Math.floor(_local_6[_local_3]), _local_3);
            }
            _local_3++;
        }
        return null;
    }

    private static _Str_21256(k: number[][]): number[][]
    {
        var _local_2: number;
        var _local_5: number;
        var _local_6: number;
        var _local_7: number;
        var _local_8: number;
        var _local_10: number;
        var _local_11: number;
        var _local_12: number;
        var _local_13: number;
        var _local_14: number;
        var _local_15: number;
        var _local_16: number;
        var _local_17: number;
        _local_2 = k.length;
        var _local_3: number = k[0].length;
        var _local_4: number[][] = [];
        _local_6 = 0;
        while (_local_6 < (_local_2 * 4))
        {
            _local_4[_local_6] = [];
            _local_6++;
        }
        var _local_9: number = 0;
        _local_6 = 0;
        while (_local_6 < _local_2)
        {
            _local_10 = 0;
            _local_5 = 0;
            while (_local_5 < _local_3)
            {
                _local_11 = k[_local_6][_local_5];
                if (((_local_11 < 0) || (_local_11 <= 0xFF)))
                {
                    _local_8 = 0;
                    while (_local_8 < 4)
                    {
                        _local_7 = 0;
                        while (_local_7 < 4)
                        {
                            if(_local_4[(_local_9 + _local_8)] === undefined) _local_4[(_local_9 + _local_8)] = [];
                            
                            _local_4[(_local_9 + _local_8)][(_local_10 + _local_7)] = ((_local_11 < 0) ? _local_11 : (_local_11 * 4));
                            _local_7++;
                        }
                        _local_8++;
                    }
                }
                else
                {
                    _local_12 = ((_local_11 & 0xFF) * 4);
                    _local_13 = (_local_12 + (((_local_11 >> 11) & 0x01) * 3));
                    _local_14 = (_local_12 + (((_local_11 >> 10) & 0x01) * 3));
                    _local_15 = (_local_12 + (((_local_11 >> 9) & 0x01) * 3));
                    _local_16 = (_local_12 + (((_local_11 >> 8) & 0x01) * 3));
                    _local_7 = 0;
                    while (_local_7 < 3)
                    {
                        _local_17 = (_local_7 + 1);

                        _local_4[_local_9][(_local_10 + _local_7)] = (((_local_13 * (3 - _local_7)) + (_local_14 * _local_7)) / 3);
                        _local_4[(_local_9 + 3)][(_local_10 + _local_17)] = (((_local_15 * (3 - _local_17)) + (_local_16 * _local_17)) / 3);
                        _local_4[(_local_9 + _local_17)][_local_10] = (((_local_13 * (3 - _local_17)) + (_local_15 * _local_17)) / 3);
                        _local_4[(_local_9 + _local_7)][(_local_10 + 3)] = (((_local_14 * (3 - _local_7)) + (_local_16 * _local_7)) / 3);
                        _local_7++;
                    }
                    _local_4[(_local_9 + 1)][(_local_10 + 1)] = ((_local_13 > _local_12) ? (_local_12 + 2) : (_local_12 + 1));
                    _local_4[(_local_9 + 1)][(_local_10 + 2)] = ((_local_14 > _local_12) ? (_local_12 + 2) : (_local_12 + 1));
                    _local_4[(_local_9 + 2)][(_local_10 + 1)] = ((_local_15 > _local_12) ? (_local_12 + 2) : (_local_12 + 1));
                    _local_4[(_local_9 + 2)][(_local_10 + 2)] = ((_local_16 > _local_12) ? (_local_12 + 2) : (_local_12 + 1));
                }
                _local_10 = (_local_10 + 4);
                _local_5++;
            }
            _local_9 = (_local_9 + 4);
            _local_6++;
        }
        return _local_4;
    }

    private static _Str_19834(k: number[][]):void
    {
        var _local_4: number;
        var _local_5: number;
        var _local_6: number;
        var _local_7: number;
        var _local_8: number;
        var _local_9: number;
        var _local_10: number;
        var _local_11: number;
        var _local_12: number;
        var _local_13: number;
        var _local_14: number;
        var _local_15: number;
        var _local_16: number;
        var _local_17: number;
        var _local_2: number = (k.length - 1);
        var _local_3: number = (k[0].length - 1);
        _local_5 = 1;
        while (_local_5 < _local_2)
        {
            _local_4 = 1;
            while (_local_4 < _local_3)
            {
                _local_6 = k[_local_5][_local_4];
                if (_local_6 < 0)
                {
                }
                else
                {
                    _local_7 = (k[(_local_5 - 1)][(_local_4 - 1)] & 0xFF);
                    _local_8 = (k[(_local_5 - 1)][_local_4] & 0xFF);
                    _local_9 = (k[(_local_5 - 1)][(_local_4 + 1)] & 0xFF);
                    _local_10 = (k[_local_5][(_local_4 - 1)] & 0xFF);
                    _local_11 = (k[_local_5][(_local_4 + 1)] & 0xFF);
                    _local_12 = (k[(_local_5 + 1)][(_local_4 - 1)] & 0xFF);
                    _local_13 = (k[(_local_5 + 1)][_local_4] & 0xFF);
                    _local_14 = (k[(_local_5 + 1)][(_local_4 + 1)] & 0xFF);
                    _local_15 = (_local_6 + 1);
                    _local_16 = (_local_6 - 1);
                    _local_17 = (((((((_local_7 == _local_15) || (_local_8 == _local_15)) || (_local_10 == _local_15)) ? 8 : 0) | ((((_local_9 == _local_15) || (_local_8 == _local_15)) || (_local_11 == _local_15)) ? 4 : 0)) | ((((_local_12 == _local_15) || (_local_13 == _local_15)) || (_local_10 == _local_15)) ? 2 : 0)) | ((((_local_14 == _local_15) || (_local_13 == _local_15)) || (_local_11 == _local_15)) ? 1 : 0));
                    if (_local_17 == 15)
                    {
                        _local_17 = 0;
                    }
                    k[_local_5][_local_4] = (_local_6 | (_local_17 << 8));
                }
                _local_4++;
            }
            _local_5++;
        }
    }

    private static _Str_20168(k: number[][]):void
    {
        k.shift();
        k.pop();

        for(let _local_2 of k)
        {
            _local_2.shift();
            _local_2.pop();
        }
    }

    private static _Str_20749(k: number[][]):void
    {
        var _local_2: number[] = [];
        var _local_3: number[] = [];
        for(let _local_4 of k)
        {
            _local_4.push(RoomPlaneParser._Str_3134);
            _local_4.unshift(RoomPlaneParser._Str_3134);
        }
        for(let _local_5 of k[0])
        {
            _local_2.push(RoomPlaneParser._Str_3134);
            _local_3.push(RoomPlaneParser._Str_3134);
        }
        k.push(_local_3);
        k.unshift(_local_2);
    }


    public get minX(): number
    {
        return this._minX;
    }

    public get maxX(): number
    {
        return this._maxX;
    }

    public get minY(): number
    {
        return this._minY;
    }

    public get maxY(): number
    {
        return this._maxY;
    }

    public get _Str_23886(): number
    {
        return this._width;
    }

    public get _Str_25092(): number
    {
        return this._height;
    }

    public get _Str_3828(): number
    {
        return this._planes.length;
    }

    public get _Str_7678(): number
    {
        if (this._fixedWallHeight != -1)
        {
            return this._fixedWallHeight;
        }
        return this._floorHeight;
    }

    public get wallHeight(): number
    {
        if (this._fixedWallHeight != -1)
        {
            return this._fixedWallHeight + 3.6;
        }
        return this._wallHeight;
    }

    public set wallHeight(k: number)
    {
        if (k < 0)
        {
            k = 0;
        }
        this._wallHeight = k;
    }

    public get _Str_9955(): number
    {
        return this._wallThicknessMultiplier;
    }

    public set _Str_9955(k: number)
    {
        if (k < 0)
        {
            k = 0;
        }
        this._wallThicknessMultiplier = k;
    }

    public get _Str_9990(): number
    {
        return this._floorThicknessMultiplier;
    }

    public set _Str_9990(k: number)
    {
        if (k < 0)
        {
            k = 0;
        }
        this._floorThicknessMultiplier = k;
    }

    public dispose():void
    {
        this._planes = null;
        this._tileMatrix = null;
        this._tileMatrixOriginal = null;
        this._floorHoleMatrix = null;
        if (this._floorHoles != null)
        {
            this._floorHoles.clear();
            this._floorHoles = null;
        }
    }

    public reset():void
    {
        this._planes = [];
        this._tileMatrix = [];
        this._tileMatrixOriginal = [];
        this._tileMatrix = [];
        this._tileMatrixOriginal = [];
        this._width = 0;
        this._height = 0;
        this._minX = 0;
        this._maxX = 0;
        this._minY = 0;
        this._maxY = 0;
        this._floorHeight = 0;
        this._floorHoleMatrix = [];
    }

    public _Str_13735(width: number, height: number): boolean
    {
        var _local_4: number[];
        var _local_5: number[];
        var _local_6: boolean[];
        var _local_7: number;
        if (width < 0)
        {
            width = 0;
        }
        if (height < 0)
        {
            height = 0;
        }
        this._tileMatrix = [];
        this._tileMatrixOriginal = [];
        this._floorHoleMatrix = [];
        var _local_3: number = 0;
        while (_local_3 < height)
        {
            _local_4 = [];
            _local_5 = [];
            _local_6 = [];
            _local_7 = 0;
            while (_local_7 < width)
            {
                _local_4[_local_7] = RoomPlaneParser._Str_3134;
                _local_5[_local_7] = RoomPlaneParser._Str_3134;
                _local_6[_local_7] = false;
                _local_7++;
            }
            this._tileMatrix.push(_local_4);
            this._tileMatrixOriginal.push(_local_5);
            this._floorHoleMatrix.push(_local_6);
            _local_3++;
        }
        this._width = width;
        this._height = height;
        this._minX = this._width;
        this._maxX = -1;
        this._minY = this._height;
        this._maxY = -1;
        return true;
    }

    public _Str_3982(k: number, _arg_2: number, _arg_3: number): boolean
    {
        var _local_4: number[];
        var _local_5: boolean;
        var _local_6: number;
        var _local_7: boolean;
        var _local_8: number;
        if (((((k >= 0) && (k < this._width)) && (_arg_2 >= 0)) && (_arg_2 < this._height)))
        {
            if(this._tileMatrix[_arg_2] === undefined) this._tileMatrix[_arg_2] = [];

            _local_4 = this._tileMatrix[_arg_2];
            
            _local_4[k] = _arg_3;
            if (_arg_3 >= 0)
            {
                if (k < this._minX)
                {
                    this._minX = k;
                }
                if (k > this._maxX)
                {
                    this._maxX = k;
                }
                if (_arg_2 < this._minY)
                {
                    this._minY = _arg_2;
                }
                if (_arg_2 > this._maxY)
                {
                    this._maxY = _arg_2;
                }
            }
            else
            {
                if (((k == this._minX) || (k == this._maxX)))
                {
                    _local_5 = false;
                    _local_6 = this._minY;
                    while (_local_6 < this._maxY)
                    {
                        if (this._Str_4480(k, _local_6) >= 0)
                        {
                            _local_5 = true;
                            break;
                        }
                        _local_6++;
                    }
                    if (!_local_5)
                    {
                        if (k == this._minX)
                        {
                            this._minX++;
                        }
                        if (k == this._maxX)
                        {
                            this._maxX--;
                        }
                    }
                }
                if (((_arg_2 == this._minY) || (_arg_2 == this._maxY)))
                {
                    _local_7 = false;
                    _local_8 = this._minX;
                    while (_local_8 < this._maxX)
                    {
                        if (this._Str_2754(_local_8, _arg_2) >= 0)
                        {
                            _local_7 = true;
                            break;
                        }
                        _local_8++;
                    }
                    if (!_local_7)
                    {
                        if (_arg_2 == this._minY)
                        {
                            this._minY++;
                        }
                        if (_arg_2 == this._maxY)
                        {
                            this._maxY--;
                        }
                    }
                }
            }
            return true;
        }
        return false;
    }

    public _Str_2754(k: number, _arg_2: number): number
    {
        if (((((k < 0) || (k >= this._width)) || (_arg_2 < 0)) || (_arg_2 >= this._height)))
        {
            return RoomPlaneParser._Str_3134;
        }
        var _local_3 = this._tileMatrix[_arg_2];
        return Math.abs(_local_3[k]);
    }

    private _Str_25886(k: number, _arg_2: number): number
    {
        if (((((k < 0) || (k >= this._width)) || (_arg_2 < 0)) || (_arg_2 >= this._height)))
        {
            return RoomPlaneParser._Str_3134;
        }
        if (this._floorHoleMatrix[_arg_2][k])
        {
            return RoomPlaneParser._Str_5500;
        }
        var _local_3 = this._tileMatrixOriginal[_arg_2];
        return _local_3[k];
    }

    private _Str_4480(k: number, _arg_2: number): number
    {
        if (((((k < 0) || (k >= this._width)) || (_arg_2 < 0)) || (_arg_2 >= this._height)))
        {
            return RoomPlaneParser._Str_3134;
        }
        var _local_3 = this._tileMatrix[_arg_2];
        return _local_3[k];
    }

    public _Str_12919(k: number=-1): boolean
    {
        var _local_2: number;
        var _local_3: number;
        this._fixedWallHeight = k;
        _local_3 = 0;
        while (_local_3 < this._height)
        {
            _local_2 = 0;
            while (_local_2 < this._width)
            {
                if(this._tileMatrixOriginal[_local_3] === undefined) this._tileMatrixOriginal[_local_3] = [];
                this._tileMatrixOriginal[_local_3][_local_2] = this._tileMatrix[_local_3][_local_2];
                _local_2++;
            }
            _local_3++;
        }
        var _local_4: PIXI.Point = RoomPlaneParser._Str_19173(this._tileMatrix);
        _local_3 = 0;
        while (_local_3 < this._height)
        {
            _local_2 = 0;
            while (_local_2 < this._width)
            {
                if(this._floorHoleMatrix[_local_3] === undefined) this._floorHoleMatrix[_local_3] = [];
                if (this._floorHoleMatrix[_local_3][_local_2])
                {
                    this._Str_3982(_local_2, _local_3, RoomPlaneParser._Str_5500);
                }
                _local_2++;
            }
            _local_3++;
        }

        return this.initialize(_local_4);
    }

    private initialize(k: PIXI.Point): boolean
    {
        var _local_5: number[][];
        var _local_2: number = 0;
        if (k != null)
        {
            _local_2 = this._Str_2754(k.x, k.y);
            this._Str_3982(k.x, k.y, RoomPlaneParser._Str_3134);
        }
        this._floorHeight = RoomPlaneParser._Str_14393(this._tileMatrix);
        this._Str_23133();
        var _local_3: number[][] = [];
        for(let _local_4 of this._tileMatrix)
        {
            _local_3.push(_local_4);
        }
        RoomPlaneParser._Str_20749(_local_3);
        RoomPlaneParser._Str_19834(_local_3);
        RoomPlaneParser._Str_20168(_local_3);
        _local_5 = RoomPlaneParser._Str_21256(_local_3);
        this._Str_25564(_local_5);
        if (k != null)
        {
            this._Str_3982(k.x, k.y, _local_2);
            this._Str_22077(new Vector3d((k.x + 0.5), (k.y + 0.5), _local_2), new Vector3d(-1, 0, 0), new Vector3d(0, -1, 0), false, false, false, false);
        }
        return true;
    }

    private _Str_19326(k: PIXI.Point, _arg_2: boolean): RoomWallData
    {
        var _local_8: boolean;
        var _local_9: boolean;
        var _local_10: number;
        var _local_11: PIXI.Point;
        var _local_12: number;
        var _local_3: RoomWallData = new RoomWallData();
        var _local_4: Function[] = [this._Str_24038.bind(this), this._Str_24221.bind(this), this._Str_25705.bind(this), this._Str_22333.bind(this)];
        var _local_5: number = 0;
        var _local_6: PIXI.Point = new PIXI.Point(k.x, k.y);
        var _local_7: number = 0;
        while (_local_7++ < 1000)
        {
            _local_8 = false;
            _local_9 = false;
            _local_10 = _local_5;
            if (((((_local_6.x < this.minX) || (_local_6.x > this.maxX)) || (_local_6.y < this.minY)) || (_local_6.y > this.maxY)))
            {
                _local_8 = true;
            }
            _local_11 = _local_4[_local_5](_local_6, _arg_2);
            if (_local_11 == null)
            {
                return null;
            }
            _local_12 = (Math.abs((_local_11.x - _local_6.x)) + Math.abs((_local_11.y - _local_6.y)));
            if (((_local_6.x == _local_11.x) || (_local_6.y == _local_11.y)))
            {
                _local_5 = (((_local_5 - 1) + _local_4.length) % _local_4.length);
                _local_12 = (_local_12 + 1);
                _local_9 = true;
            }
            else
            {
                _local_5 = ((_local_5 + 1) % _local_4.length);
                _local_12--;
            }
            _local_3._Str_17862(_local_6, _local_10, _local_12, _local_8, _local_9);
            if ((((_local_11.x == k.x) && (_local_11.y == k.y)) && ((!(_local_11.x == _local_6.x)) || (!(_local_11.y == _local_6.y)))))
            {
                break;
            }
            _local_6 = _local_11;
        }
        if (_local_3.count == 0)
        {
            return null;
        }
        return _local_3;
    }

    private _Str_25300(k: RoomWallData):void
    {
        var _local_4: number;
        var _local_5: number;
        var _local_6: number;
        var _local_7: boolean;
        var _local_8: number;
        var _local_2: number = 0;
        var _local_3: number = k.count;
        while (_local_2 < _local_3)
        {
            _local_4 = _local_2;
            _local_5 = _local_2;
            _local_6 = 0;
            _local_7 = false;
            while (((!(k._Str_25208(_local_2))) && (_local_2 < _local_3)))
            {
                if (k._Str_17084(_local_2))
                {
                    _local_6++;
                }
                else
                {
                    if (_local_6 > 0)
                    {
                        _local_6--;
                    }
                }
                if (_local_6 > 1)
                {
                    _local_7 = true;
                }
                _local_5 = _local_2;
                _local_2++;
            }
            if (_local_7)
            {
                _local_8 = _local_4;
                while (_local_8 <= _local_5)
                {
                    k._Str_15901(_local_8, true);
                    _local_8++;
                }
            }
            _local_2++;
        }
    }

    private _Str_25293(k: RoomWallData):void
    {
        var _local_4: PIXI.Point;
        var _local_5: number;
        var _local_6: number;
        var _local_7: IVector3D;
        var _local_8: IVector3D;
        var _local_9: number;
        var _local_10: number;
        var _local_2: number = k.count;
        var _local_3: number = 0;
        while (_local_3 < _local_2)
        {
            if (!k._Str_10019(_local_3))
            {
                _local_4 = k._Str_10778(_local_3);
                _local_5 = k.getDirection(_local_3);
                _local_6 = k._Str_13743(_local_3);
                _local_7 = RoomWallData._Str_5077[_local_5];
                _local_8 = RoomWallData._Str_5543[_local_5];
                _local_9 = 0;
                _local_10 = 0;
                while (_local_10 < _local_6)
                {
                    if (this._Str_4480(((_local_4.x + (_local_10 * _local_7.x)) - _local_8.x), ((_local_4.y + (_local_10 * _local_7.y)) - _local_8.y)) == RoomPlaneParser._Str_5500)
                    {
                        if (((_local_10 > 0) && (_local_9 == 0)))
                        {
                            k._Str_24531(_local_3, _local_10);
                            break;
                        }
                        _local_9++;
                    }
                    else
                    {
                        if (_local_9 > 0)
                        {
                            k._Str_23976(_local_3, _local_9);
                            break;
                        }
                    }
                    _local_10++;
                }
                if (_local_9 == _local_6)
                {
                    k._Str_15901(_local_3, true);
                }
            }
            _local_3++;
        }
    }

    private _Str_20164(k: PIXI.Point, _arg_2: PIXI.Point, _arg_3: RoomWallData): number
    {
        var _local_10: PIXI.Point;
        var _local_11: PIXI.Point;
        var _local_12: number;
        var _local_13: number;
        var _local_14: number;
        var _local_15: number;
        var _local_4: number = Math.min(k.y, _arg_2.y);
        var _local_5: number = Math.max(k.y, _arg_2.y);
        var _local_6: number = Math.min(k.x, _arg_2.x);
        var _local_7: number = Math.max(k.x, _arg_2.x);
        var _local_8: number = _arg_3.count;
        var _local_9: number = 0;
        while (_local_9 < _local_8)
        {
            _local_10 = _arg_3._Str_10778(_local_9);
            _local_11 = _arg_3._Str_19138(_local_9);
            if (k.x == _arg_2.x)
            {
                if (((_local_10.x == k.x) && (_local_11.x == k.x)))
                {
                    _local_12 = Math.min(_local_10.y, _local_11.y);
                    _local_13 = Math.max(_local_10.y, _local_11.y);
                    if (((_local_12 <= _local_4) && (_local_5 <= _local_13)))
                    {
                        return _local_9;
                    }
                }
            }
            else
            {
                if (k.y == _arg_2.y)
                {
                    if (((_local_10.y == k.y) && (_local_11.y == k.y)))
                    {
                        _local_14 = Math.min(_local_10.x, _local_11.x);
                        _local_15 = Math.max(_local_10.x, _local_11.x);
                        if (((_local_14 <= _local_6) && (_local_7 <= _local_15)))
                        {
                            return _local_9;
                        }
                    }
                }
            }
            _local_9++;
        }
        return -1;
    }

    private _Str_24096(k: RoomWallData, _arg_2: RoomWallData):void
    {
        var _local_5: PIXI.Point;
        var _local_6: PIXI.Point;
        var _local_7: IVector3D;
        var _local_8: number;
        var _local_9: number;
        var _local_3: number = k.count;
        var _local_4: number = 0;
        while (_local_4 < _local_3)
        {
            if (!k._Str_10019(_local_4))
            {
                _local_5 = k._Str_10778(_local_4);
                _local_6 = new PIXI.Point(_local_5.x, _local_5.y);
                _local_7 = RoomWallData._Str_5077[k.getDirection(_local_4)];
                _local_8 = k._Str_13743(_local_4);
                _local_6.x = (_local_6.x + (_local_7.x * _local_8));
                _local_6.y = (_local_6.y + (_local_7.y * _local_8));
                _local_9 = this._Str_20164(_local_5, _local_6, _arg_2);
                if (_local_9 >= 0)
                {
                    if (_arg_2._Str_10019(_local_9))
                    {
                        k._Str_15901(_local_4, true);
                    }
                }
                else
                {
                    k._Str_15901(_local_4, true);
                }
            }
            _local_4++;
        }
    }

    private _Str_25611(k: RoomWallData, _arg_2: RoomWallData):void
    {
        this._Str_25300(_arg_2);
        this._Str_25293(k);
        this._Str_24096(k, _arg_2);
    }

    private _Str_24673(k: RoomWallData, _arg_2: RoomWallData):void
    {
        var _local_5: number;
        var _local_6: number;
        var _local_8: PIXI.Point;
        var _local_9: number;
        var _local_10: number;
        var _local_11: IVector3D;
        var _local_12: IVector3D;
        var _local_13: number;
        var _local_14: number;
        var _local_15: number;
        var _local_16:Vector3d;
        var _local_17: number;
        var _local_18:Vector3d;
        var _local_19:Vector3d;
        var _local_20: number;
        var _local_21:Vector3d;
        var _local_22: boolean;
        var _local_23: boolean;
        var _local_24: boolean;
        var _local_25: boolean;
        var _local_26: boolean;
        var _local_27: number;
        var _local_3: number = k.count;
        var _local_4: number = _arg_2.count;
        var _local_7: number = 0;
        while (_local_7 < _local_3)
        {
            if (!k._Str_10019(_local_7))
            {
                _local_8 = k._Str_10778(_local_7);
                _local_9 = k.getDirection(_local_7);
                _local_10 = k._Str_13743(_local_7);
                _local_11 = RoomWallData._Str_5077[_local_9];
                _local_12 = RoomWallData._Str_5543[_local_9];
                _local_13 = -1;
                _local_14 = 0;
                while (_local_14 < _local_10)
                {
                    _local_27 = this._Str_4480(((_local_8.x + (_local_14 * _local_11.x)) + _local_12.x), ((_local_8.y + (_local_14 * _local_11.y)) + _local_12.y));
                    if (((_local_27 >= 0) && ((_local_27 < _local_13) || (_local_13 < 0))))
                    {
                        _local_13 = _local_27;
                    }
                    _local_14++;
                }
                _local_15 = _local_13;
                _local_16 = new Vector3d(_local_8.x, _local_8.y, _local_15);
                _local_16 = Vector3d.sum(_local_16, Vector3d.product(_local_12, 0.5));
                _local_16 = Vector3d.sum(_local_16, Vector3d.product(_local_11, -0.5));
                _local_17 = ((this.wallHeight + Math.min(RoomPlaneParser._Str_13826, this._Str_7678)) - _local_13);
                _local_18 = Vector3d.product(_local_11, -(_local_10));
                _local_19 = new Vector3d(0, 0, _local_17);
                _local_16 = Vector3d.dif(_local_16, _local_18);
                _local_20 = this._Str_20164(_local_8, k._Str_19138(_local_7), _arg_2);
                if (_local_20 >= 0)
                {
                    _local_5 = _arg_2.getDirection(((_local_20 + 1) % _local_4));
                    _local_6 = _arg_2.getDirection((((_local_20 - 1) + _local_4) % _local_4));
                }
                else
                {
                    _local_5 = k.getDirection(((_local_7 + 1) % _local_3));
                    _local_6 = k.getDirection((((_local_7 - 1) + _local_3) % _local_3));
                }
                _local_21 = null;
                if ((((_local_5 - _local_9) + 4) % 4) == 3)
                {
                    _local_21 = RoomWallData._Str_5543[_local_5];
                }
                else
                {
                    if ((((_local_9 - _local_6) + 4) % 4) == 3)
                    {
                        _local_21 = RoomWallData._Str_5543[_local_6];
                    }
                }
                _local_22 = k._Str_17084(_local_7);
                _local_23 = k._Str_17084((((_local_7 - 1) + _local_3) % _local_3));
                _local_24 = k._Str_10019(((_local_7 + 1) % _local_3));
                _local_25 = k._Str_25455(_local_7);
                _local_26 = k._Str_24163(_local_7);
                this._Str_17862(_local_16, _local_18, _local_19, _local_21, ((!(_local_23)) || (_local_25)), ((!(_local_22)) || (_local_26)), (!(_local_24)));
            }
            _local_7++;
        }
    }

    private _Str_23133(): boolean
    {
        var _local_13: number;
        var _local_14: number;
        var k = this._tileMatrix;
        if (k == null)
        {
            return false;
        }
        var _local_2: number;
        var _local_3: number;
        var _local_4: number[];
        var _local_5: number = k.length;
        var _local_6: number;
        if (_local_5 == 0)
        {
            return false;
        }
        _local_2 = 0;
        while (_local_2 < _local_5)
        {
            _local_4 = k[_local_2];
            if (((_local_4 == null) || (_local_4.length == 0)))
            {
                return false;
            }
            if (_local_6 > 0)
            {
                _local_6 = Math.min(_local_6, _local_4.length);
            }
            else
            {
                _local_6 = _local_4.length;
            }
            _local_2++;
        }
        var _local_7: number = Math.min(RoomPlaneParser._Str_13826, ((this._fixedWallHeight != -1) ? this._fixedWallHeight : RoomPlaneParser._Str_14393(k)));
        var _local_8: number = this.minX;
        var _local_9: number = this.minY;
        _local_9 = this.minY;
        while (_local_9 <= this.maxY)
        {
            if (this._Str_4480(_local_8, _local_9) > RoomPlaneParser._Str_5500)
            {
                _local_9--;
                break;
            }
            _local_9++;
        }
        if (_local_9 > this.maxY)
        {
            return false;
        }
        var _local_10: PIXI.Point = new PIXI.Point(_local_8, _local_9);
        var _local_11: RoomWallData = this._Str_19326(_local_10, true);
        var _local_12: RoomWallData = this._Str_19326(_local_10, false);
        if (_local_11 != null)
        {
            _local_13 = _local_11.count;
            _local_14 = _local_12.count;
            this._Str_25611(_local_11, _local_12);
            this._Str_24673(_local_11, _local_12);
        }
        _local_3 = 0;
        while (_local_3 < this._Str_25092)
        {
            _local_2 = 0;
            while (_local_2 < this._Str_23886)
            {
                if (this._Str_4480(_local_2, _local_3) < 0)
                {
                    this._Str_3982(_local_2, _local_3, -(_local_7 + this.wallHeight));
                }
                _local_2++;
            }
            _local_3++;
        }
        return true;
    }

    private _Str_24038(k: PIXI.Point, _arg_2: boolean): PIXI.Point
    {
        if (k == null)
        {
            return null;
        }
        var _local_3: number = 1;
        var _local_4: number = RoomPlaneParser._Str_5500;
        if (!_arg_2)
        {
            _local_4 = RoomPlaneParser._Str_3134;
        }
        while (_local_3 < 1000)
        {
            if (this._Str_4480((k.x + _local_3), k.y) > _local_4)
            {
                return new PIXI.Point(((k.x + _local_3) - 1), k.y);
            }
            if (this._Str_4480((k.x + _local_3), (k.y + 1)) <= _local_4)
            {
                return new PIXI.Point((k.x + _local_3), (k.y + 1));
            }
            _local_3++;
        }
        return null;
    }

    private _Str_24221(k: PIXI.Point, _arg_2: boolean): PIXI.Point
    {
        if (k == null)
        {
            return null;
        }
        var _local_3: number = 1;
        var _local_4: number = RoomPlaneParser._Str_5500;
        if (!_arg_2)
        {
            _local_4 = RoomPlaneParser._Str_3134;
        }
        while (_local_3 < 1000)
        {
            if (this._Str_4480(k.x, (k.y + _local_3)) > _local_4)
            {
                return new PIXI.Point(k.x, (k.y + (_local_3 - 1)));
            }
            if (this._Str_4480((k.x - 1), (k.y + _local_3)) <= _local_4)
            {
                return new PIXI.Point((k.x - 1), (k.y + _local_3));
            }
            _local_3++;
        }
        return null;
    }

    private _Str_25705(k: PIXI.Point, _arg_2: boolean): PIXI.Point
    {
        if (k == null)
        {
            return null;
        }
        var _local_3: number = 1;
        var _local_4: number = RoomPlaneParser._Str_5500;
        if (!_arg_2)
        {
            _local_4 = RoomPlaneParser._Str_3134;
        }
        while (_local_3 < 1000)
        {
            if (this._Str_4480((k.x - _local_3), k.y) > _local_4)
            {
                return new PIXI.Point((k.x - (_local_3 - 1)), k.y);
            }
            if (this._Str_4480((k.x - _local_3), (k.y - 1)) <= _local_4)
            {
                return new PIXI.Point((k.x - _local_3), (k.y - 1));
            }
            _local_3++;
        }
        return null;
    }

    private _Str_22333(k: PIXI.Point, _arg_2: boolean): PIXI.Point
    {
        if (k == null)
        {
            return null;
        }
        var _local_3: number = 1;
        var _local_4: number = RoomPlaneParser._Str_5500;
        if (!_arg_2)
        {
            _local_4 = RoomPlaneParser._Str_3134;
        }
        while (_local_3 < 1000)
        {
            if (this._Str_4480(k.x, (k.y - _local_3)) > _local_4)
            {
                return new PIXI.Point(k.x, (k.y - (_local_3 - 1)));
            }
            if (this._Str_4480((k.x + 1), (k.y - _local_3)) <= _local_4)
            {
                return new PIXI.Point((k.x + 1), (k.y - _local_3));
            }
            _local_3++;
        }
        return null;
    }

    private _Str_17862(k: IVector3D, _arg_2: IVector3D, _arg_3: IVector3D, _arg_4: IVector3D, _arg_5: boolean, _arg_6: boolean, _arg_7: boolean):void
    {
        var _local_12:Vector3d;
        this._Str_3453(RoomPlaneData.PLANE_WALL, k, _arg_2, _arg_3, [_arg_4]);
        this._Str_3453(RoomPlaneData.PLANE_LANDSCAPE, k, _arg_2, _arg_3, [_arg_4]);
        var _local_8: number = (RoomPlaneParser._Str_6429 * this._wallThicknessMultiplier);
        var _local_9: number = (RoomPlaneParser._Str_6100 * this._floorThicknessMultiplier);
        var _local_10:Vector3d = Vector3d.crossProduct(_arg_2, _arg_3);
        var _local_11:Vector3d = Vector3d.product(_local_10, ((1 / _local_10.length) * -(_local_8)));
        this._Str_3453(RoomPlaneData.PLANE_WALL, Vector3d.sum(k, _arg_3), _arg_2, _local_11, [_local_10, _arg_4]);
        if (_arg_5)
        {
            this._Str_3453(RoomPlaneData.PLANE_WALL, Vector3d.sum(Vector3d.sum(k, _arg_2), _arg_3), Vector3d.product(_arg_3, (-(_arg_3.length + _local_9) / _arg_3.length)), _local_11, [_local_10, _arg_4]);
        }
        if (_arg_6)
        {
            this._Str_3453(RoomPlaneData.PLANE_WALL, Vector3d.sum(k, Vector3d.product(_arg_3, (-(_local_9) / _arg_3.length))), Vector3d.product(_arg_3, ((_arg_3.length + _local_9) / _arg_3.length)), _local_11, [_local_10, _arg_4]);
            if (_arg_7)
            {
                _local_12 = Vector3d.product(_arg_2, (_local_8 / _arg_2.length));
                this._Str_3453(RoomPlaneData.PLANE_WALL, Vector3d.sum(Vector3d.sum(k, _arg_3), Vector3d.product(_local_12, -1)), _local_12, _local_11, [_local_10, _arg_2, _arg_4]);
            }
        }
    }

    private _Str_22077(k: IVector3D, _arg_2: IVector3D, _arg_3: IVector3D, _arg_4: boolean, _arg_5: boolean, _arg_6: boolean, _arg_7: boolean):void
    {
        var _local_9: number;
        var _local_10:Vector3d;
        var _local_11:Vector3d;
        var _local_8: RoomPlaneData = this._Str_3453(RoomPlaneData.PLANE_FLOOR, k, _arg_2, _arg_3);
        if (_local_8 != null)
        {
            _local_9 = (RoomPlaneParser._Str_6100 * this._floorThicknessMultiplier);
            _local_10 = new Vector3d(0, 0, _local_9);
            _local_11 = Vector3d.dif(k, _local_10);
            if (_arg_6)
            {
                this._Str_3453(RoomPlaneData.PLANE_FLOOR, _local_11, _arg_2, _local_10);
            }
            if (_arg_7)
            {
                this._Str_3453(RoomPlaneData.PLANE_FLOOR, Vector3d.sum(_local_11, Vector3d.sum(_arg_2, _arg_3)), Vector3d.product(_arg_2, -1), _local_10);
            }
            if (_arg_4)
            {
                this._Str_3453(RoomPlaneData.PLANE_FLOOR, Vector3d.sum(_local_11, _arg_3), Vector3d.product(_arg_3, -1), _local_10);
            }
            if (_arg_5)
            {
                this._Str_3453(RoomPlaneData.PLANE_FLOOR, Vector3d.sum(_local_11, _arg_2), _arg_3, _local_10);
            }
        }
    }

    public _Str_16659(data: RoomMapData): boolean
    {
        if(!data) return false;

        this.reset();

        this._Str_25334();

        const width             = data.width;
        const height            = data.height;
        const wallHeight        = data.wallHeight;
        const fixedWallsHeight  = data.fixedWallsHeight;

        this._Str_13735(width, height);

        if(data.tileMap)
        {
            let y = 0;

            while(y < data.tileMap.length)
            {
                const row = data.tileMap[y];

                if(row)
                {
                    let x = 0;

                    while(x < row.length)
                    {
                        const column = row[x];

                        if(column) this._Str_3982(x, y, column.height);

                        x++;
                    }
                }

                y++;
            }
        }

        if(data.holeMap && data.holeMap.length)
        {
            let index = 0;

            while(index < data.holeMap.length)
            {
                const hole = data.holeMap[index];

                if(!hole) continue;

                this._Str_12390(hole.id, hole.x, hole.y, hole.width, hole.height);

                index++;
            }

            this._Str_25711();
        }

        this.wallHeight = wallHeight;

        this._Str_12919(fixedWallsHeight);
        
        return true;
    }

    private _Str_3453(k: number, _arg_2: IVector3D, _arg_3: IVector3D, _arg_4: IVector3D, _arg_5: IVector3D[] = null): RoomPlaneData
    {
        if (((_arg_3.length == 0) || (_arg_4.length == 0)))
        {
            return null;
        }
        var _local_6: RoomPlaneData = new RoomPlaneData(k, _arg_2, _arg_3, _arg_4, _arg_5);
        this._planes.push(_local_6);
        return _local_6;
    }

    public _Str_5598(): RoomMapData
    {
        const data = new RoomMapData();

        data.width              = this._width;
        data.height             = this._height;
        data.wallHeight         = this._wallHeight;
        data.fixedWallsHeight   = this._fixedWallHeight;
        data.dimensions.minX    = this.minX;
        data.dimensions.maxX    = this.maxX;
        data.dimensions.minY    = this.minY;
        data.dimensions.maxY    = this.maxY;

        let y = 0;

        while(y < this._height)
        {
            const tileRow: { height: number }[] = [];
            const tileMatrix                    = this._tileMatrixOriginal[y];

            let x = 0;

            while(x < this._width)
            {
                const tileHeight = tileMatrix[x];

                tileRow.push({ height: tileHeight });

                x++;
            }

            data.tileMap.push(tileRow);

            y++;
        }

        for(let [ holeId, holeData ] of this._floorHoles.entries())
        {
            if(!holeData) continue;

            data.holeMap.push({
                id: holeId,
                x: holeData.x,
                y: holeData.y,
                width: holeData.width,
                height: holeData.height
            });
        }

        return data;
    }

    public _Str_20362(k: number): IVector3D
    {
        if (((k < 0) || (k >= this._Str_3828)))
        {
            return null;
        }
        var _local_2: RoomPlaneData = (this._planes[k] as RoomPlaneData);
        if (_local_2 != null)
        {
            return _local_2.loc;
        }
        return null;
    }

    public _Str_26428(k: number): IVector3D
    {
        if (((k < 0) || (k >= this._Str_3828)))
        {
            return null;
        }
        var _local_2: RoomPlaneData = (this._planes[k] as RoomPlaneData);
        if (_local_2 != null)
        {
            return _local_2.normal;
        }
        return null;
    }

    public _Str_16904(k: number): IVector3D
    {
        if (((k < 0) || (k >= this._Str_3828)))
        {
            return null;
        }
        var _local_2: RoomPlaneData = (this._planes[k] as RoomPlaneData);
        if (_local_2 != null)
        {
            return _local_2._Str_5424;
        }
        return null;
    }

    public _Str_18119(k: number): IVector3D
    {
        if (((k < 0) || (k >= this._Str_3828)))
        {
            return null;
        }
        var _local_2: RoomPlaneData = (this._planes[k] as RoomPlaneData);
        if (_local_2 != null)
        {
            return _local_2._Str_4968;
        }
        return null;
    }

    public _Str_23741(k: number): IVector3D
    {
        if (((k < 0) || (k >= this._Str_3828)))
        {
            return null;
        }
        var _local_2: RoomPlaneData = (this._planes[k] as RoomPlaneData);
        if (_local_2 != null)
        {
            return _local_2._Str_25207;
        }
        return null;
    }

    public _Str_24698(k: number): IVector3D[]
    {
        var _local_3: IVector3D[];
        var _local_4: number;
        if (((k < 0) || (k >= this._Str_3828)))
        {
            return null;
        }
        var _local_2: RoomPlaneData = (this._planes[k] as RoomPlaneData);
        if (_local_2 != null)
        {
            _local_3 = [];
            _local_4 = 0;
            while (_local_4 < _local_2._Str_20277)
            {
                _local_3.push(_local_2._Str_22585(_local_4));
                _local_4++;
            }
            return _local_3;
        }
        return null;
    }

    public _Str_13037(k: number): number
    {
        if (((k < 0) || (k >= this._Str_3828)))
        {
            return RoomPlaneData.PLANE_UNDEFINED;
        }
        var _local_2: RoomPlaneData = (this._planes[k] as RoomPlaneData);
        if (_local_2 != null)
        {
            return _local_2.type;
        }
        return RoomPlaneData.PLANE_UNDEFINED;
    }

    public _Str_25447(k: number): number
    {
        if (((k < 0) || (k >= this._Str_3828)))
        {
            return 0;
        }
        var _local_2: RoomPlaneData = (this._planes[k] as RoomPlaneData);
        if (_local_2 != null)
        {
            return _local_2._Str_6845;
        }
        return 0;
    }

    public _Str_23769(k: number, _arg_2: number): number
    {
        if (((k < 0) || (k >= this._Str_3828)))
        {
            return -1;
        }
        var _local_3: RoomPlaneData = (this._planes[k] as RoomPlaneData);
        if (_local_3 != null)
        {
            return _local_3._Str_25133(_arg_2);
        }
        return -1;
    }

    public _Str_23247(k: number, _arg_2: number): number
    {
        if (((k < 0) || (k >= this._Str_3828)))
        {
            return -1;
        }
        var _local_3: RoomPlaneData = (this._planes[k] as RoomPlaneData);
        if (_local_3 != null)
        {
            return _local_3._Str_23609(_arg_2);
        }
        return -1;
    }

    public _Str_23431(k: number, _arg_2: number): number
    {
        if (((k < 0) || (k >= this._Str_3828)))
        {
            return -1;
        }
        var _local_3: RoomPlaneData = (this._planes[k] as RoomPlaneData);
        if (_local_3 != null)
        {
            return _local_3._Str_25097(_arg_2);
        }
        return -1;
    }

    public _Str_22914(k: number, _arg_2: number): number
    {
        if (((k < 0) || (k >= this._Str_3828)))
        {
            return -1;
        }
        var _local_3: RoomPlaneData = (this._planes[k] as RoomPlaneData);
        if (_local_3 != null)
        {
            return _local_3._Str_25617(_arg_2);
        }
        return -1;
    }

    public _Str_12390(k: number, _arg_2: number, _arg_3: number, _arg_4: number, _arg_5: number):void
    {
        this._Str_11339(k);
        var _local_6:RoomFloorHole = new RoomFloorHole(_arg_2, _arg_3, _arg_4, _arg_5);
        this._floorHoles.set(k, _local_6);
    }

    public _Str_11339(k: number):void
    {
        this._floorHoles.delete(k);
    }

    public _Str_25334():void
    {
        this._floorHoles.clear();
    }

    private _Str_25711():void
    {
        var k: number;
        var _local_2: number;
        var _local_3: boolean[];
        var _local_5:RoomFloorHole;
        var _local_6: number;
        var _local_7: number;
        var _local_8: number;
        var _local_9: number;
        _local_2 = 0;
        while (_local_2 < this._height)
        {
            _local_3 = this._floorHoleMatrix[_local_2];
            k = 0;
            while (k < this._width)
            {
                _local_3[k] = false;
                k++;
            }
            _local_2++;
        }
        for(let _local_4 of this._floorHoles.values())
        {
            _local_5 = _local_4;
            if (_local_5 != null)
            {
                _local_6 = _local_5.x;
                _local_7 = ((_local_5.x + _local_5.width) - 1);
                _local_8 = _local_5.y;
                _local_9 = ((_local_5.y + _local_5.height) - 1);
                _local_6 = ((_local_6 < 0) ? 0 : _local_6);
                _local_7 = ((_local_7 >= this._width) ? (this._width - 1) : _local_7);
                _local_8 = ((_local_8 < 0) ? 0 : _local_8);
                _local_9 = ((_local_9 >= this._height) ? (this._height - 1) : _local_9);
                _local_2 = _local_8;
                while (_local_2 <= _local_9)
                {
                    _local_3 = this._floorHoleMatrix[_local_2];
                    k = _local_6;
                    while (k <= _local_7)
                    {
                        _local_3[k] = true;
                        k++;
                    }
                    _local_2++;
                }
            }
        }
    }

    private _Str_25564(k: number[][]):void
    {
        var _local_2: number;
        var _local_7: number;
        var _local_8: number;
        var _local_9: number;
        var _local_10: number;
        var _local_11: boolean;
        var _local_12: boolean;
        var _local_13: boolean;
        var _local_14: boolean;
        var _local_15: number;
        var _local_16: number;
        var _local_17: boolean;
        var _local_18: number;
        var _local_19: number;
        var _local_20: number;
        var _local_21: number;
        _local_2 = k.length;
        var _local_3: number = k[0].length;
        var _local_4: boolean[][] = [];
        var _local_5: number = 0;
        while (_local_5 < _local_2)
        {
            _local_4[_local_5] = [];
            _local_5++;
        }
        var _local_6: number = 0;
        while (_local_6 < _local_2)
        {
            _local_7 = 0;
            while (_local_7 < _local_3)
            {
                _local_8 = k[_local_6][_local_7];
                if (((_local_8 < 0) || (_local_4[_local_6][_local_7])))
                {
                }
                else
                {
                    _local_11 = ((_local_7 == 0) || (!(k[_local_6][(_local_7 - 1)] == _local_8)));
                    _local_12 = ((_local_6 == 0) || (!(k[(_local_6 - 1)][_local_7] == _local_8)));
                    _local_9 = (_local_7 + 1);
                    while (_local_9 < _local_3)
                    {
                        if ((((!(k[_local_6][_local_9] == _local_8)) || (_local_4[_local_6][_local_9])) || ((_local_6 > 0) && ((k[(_local_6 - 1)][_local_9] == _local_8) == _local_12))))
                        {
                            break;
                        }
                        _local_9++;
                    }
                    _local_13 = ((_local_9 == _local_3) || (!(k[_local_6][_local_9] == _local_8)));
                    _local_17 = false;
                    _local_10 = (_local_6 + 1);
                    while (((_local_10 < _local_2) && (!(_local_17))))
                    {
                        _local_14 = (!(k[_local_10][_local_7] == _local_8));
                        _local_17 = (((_local_14) || ((_local_7 > 0) && ((k[_local_10][(_local_7 - 1)] == _local_8) == _local_11))) || ((_local_9 < _local_3) && ((k[_local_10][_local_9] == _local_8) == _local_13)));
                        _local_15 = _local_7;
                        while (_local_15 < _local_9)
                        {
                            if ((k[_local_10][_local_15] == _local_8) == _local_14)
                            {
                                _local_17 = true;
                                _local_9 = _local_15;
                                break;
                            }
                            _local_15++;
                        }
                        if (_local_17)
                        {
                            break;
                        }
                        _local_10++;
                    }
                    _local_14 = ((_local_14) || (_local_10 == _local_2));
                    _local_13 = ((_local_9 == _local_3) || (!(k[_local_6][_local_9] == _local_8)));
                    _local_16 = _local_6;
                    while (_local_16 < _local_10)
                    {
                        _local_15 = _local_7;
                        while (_local_15 < _local_9)
                        {
                            _local_4[_local_16][_local_15] = true;
                            _local_15++;
                        }
                        _local_16++;
                    }
                    _local_18 = ((_local_7 / 4) - 0.5);
                    _local_19 = ((_local_6 / 4) - 0.5);
                    _local_20 = ((_local_9 - _local_7) / 4);
                    _local_21 = ((_local_10 - _local_6) / 4);
                    this._Str_22077(new Vector3d((_local_18 + _local_20), (_local_19 + _local_21), (_local_8 / 4)), new Vector3d(-(_local_20), 0, 0), new Vector3d(0, -(_local_21), 0), _local_13, _local_11, _local_14, _local_12);
                }
                _local_7++;
            }
            _local_6++;
        }
    }
}