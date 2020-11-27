﻿import { Point } from 'pixi.js';
import { IVector3D } from '../../../room/utils/IVector3D';
import { Vector3d } from '../../../room/utils/Vector3d';
import { RoomFloorHole } from './RoomFloorHole';
import { RoomMapData } from './RoomMapData';
import { RoomPlaneData } from './RoomPlaneData';
import { RoomWallData } from './RoomWallData';

export class RoomPlaneParser 
{
    private static FLOOR_THICKNESS: number              = 0.25;
    private static WALL_THICKNESS: number               = 0.25;
    private static MAX_WALL_ADDITIONAL_HEIGHT: number   = 20;

    public static TILE_BLOCKED: number                  = -110;
    public static TILE_HOLE: number                     = -100;

    private _tileMatrix: number[][];
    private _tileMatrixOriginal: number[][];
    private _width: number = 0;
    private _height: number = 0;
    private _minX: number = 0;
    private _maxX: number = 0;
    private _minY: number = 0;
    private _maxY: number = 0;
    private _planes: RoomPlaneData[];
    private _wallHeight: number;
    private _wallThicknessMultiplier: number;
    private _floorThicknessMultiplier: number;
    private _fixedWallHeight: number = -1;
    private _floorHeight: number = 0;
    private _floorHoles: Map<number, RoomFloorHole>;
    private _floorHoleMatrix: boolean[][];
    private _restrictsDragging: boolean;
    private _restrictsScaling: boolean = false;
    private _restrictedScale: number = 1;

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

    private static getFloorHeight(matricies: number[][]): number
    {
        const length = matricies.length;

        if(!length) return 0;

        let tileHeight = 0;

        let i = 0;

        while(i < length)
        {
            const matrix = matricies[i];

            let j = 0;

            while(j < matrix.length)
            {
                const height = matrix[j];

                if(height > tileHeight) tileHeight = height;

                j++;
            }

            i++;
        }

        return tileHeight;
    }

    private static findEntranceTile(matricies: number[][]): Point
    {
        if(!matricies) return null;

        let length = matricies.length;

        if(!length) return null;

        var _local_6: number[] = [];

        let i = 0;

        while(i < length)
        {
            const matrix = matricies[i];

            if(!matrix || !matrix.length) return null;

            let j = 0;

            while(j < matrix.length)
            {
                if(matrix[j] >= 0)
                {
                    _local_6.push(j);

                    break;
                }

                j++;
            }

            if(_local_6.length < (i + 1)) _local_6.push((matrix.length + 1));

            i++;
        }

        i = 1;

        while(i < (_local_6.length - 1))
        {
            if(((Math.trunc(_local_6[i]) <= (Math.trunc(_local_6[(i - 1)]) - 1)) && (Math.trunc(_local_6[i]) <= (Math.trunc(_local_6[(i + 1)]) - 1)))) return new Point(Math.trunc((_local_6[i]) | 0), i);

            i++;
        }

        return null;
    }

    private static expandFloorTiles(k: number[][]): number[][]
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

    private static addTileTypes(k: number[][]): void
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

    private static unpadHeightMap(k: number[][]): void
    {
        k.shift();
        k.pop();

        for(let _local_2 of k)
        {
            _local_2.shift();
            _local_2.pop();
        }
    }

    private static padHeightMap(k: number[][]): void
    {
        var _local_2: number[] = [];
        var _local_3: number[] = [];
        for(let _local_4 of k)
        {
            _local_4.push(RoomPlaneParser.TILE_BLOCKED);
            _local_4.unshift(RoomPlaneParser.TILE_BLOCKED);
        }
        for(let _local_5 of k[0])
        {
            _local_2.push(RoomPlaneParser.TILE_BLOCKED);
            _local_3.push(RoomPlaneParser.TILE_BLOCKED);
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

    public get tileMapWidth(): number
    {
        return this._width;
    }

    public get tileMapHeight(): number
    {
        return this._height;
    }

    public get planeCount(): number
    {
        return this._planes.length;
    }

    public get floorHeight(): number
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

    public get wallThicknessMultiplier(): number
    {
        return this._wallThicknessMultiplier;
    }

    public set wallThicknessMultiplier(k: number)
    {
        if (k < 0)
        {
            k = 0;
        }
        this._wallThicknessMultiplier = k;
    }

    public get floorThicknessMultiplier(): number
    {
        return this._floorThicknessMultiplier;
    }

    public set floorThicknessMultiplier(k: number)
    {
        if (k < 0)
        {
            k = 0;
        }
        this._floorThicknessMultiplier = k;
    }

    public dispose(): void
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

    public reset(): void
    {
        this._planes = [];
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

    public initializeTileMap(width: number, height: number): boolean
    {
        if(width < 0) width = 0;

        if(height < 0) height = 0;

        this._tileMatrix            = [];
        this._tileMatrixOriginal    = [];
        this._floorHoleMatrix       = [];

        let y = 0;

        while (y < height)
        {
            let tileMatrix            = [];
            let tileMatrixOriginal    = [];
            let floorHoleMatrix       = [];

            let x = 0;

            while (x < width)
            {
                tileMatrix[x]           = RoomPlaneParser.TILE_BLOCKED;
                tileMatrixOriginal[x]   = RoomPlaneParser.TILE_BLOCKED;
                floorHoleMatrix[x]      = false;

                x++;
            }
            
            this._tileMatrix.push(tileMatrix);
            this._tileMatrixOriginal.push(tileMatrixOriginal);
            this._floorHoleMatrix.push(floorHoleMatrix);

            y++;
        }

        this._width     = width;
        this._height    = height;
        this._minX      = this._width;
        this._maxX      = -1;
        this._minY      = this._height;
        this._maxY      = -1;
        
        return true;
    }

    public setTileHeight(k: number, _arg_2: number, _arg_3: number): boolean
    {
        var _local_4: number[];
        var _local_5: boolean;
        var _local_6: number;
        var _local_7: boolean;
        var _local_8: number;
        if (((((k >= 0) && (k < this._width)) && (_arg_2 >= 0)) && (_arg_2 < this._height)))
        {
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
                        if (this.getTileHeightInternal(k, _local_6) >= 0)
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
                        if (this.getTileHeight(_local_8, _arg_2) >= 0)
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

    public getTileHeight(k: number, _arg_2: number): number
    {
        if (((((k < 0) || (k >= this._width)) || (_arg_2 < 0)) || (_arg_2 >= this._height)))
        {
            return RoomPlaneParser.TILE_BLOCKED;
        }

        var _local_3 = this._tileMatrix[_arg_2];

        if(_local_3[k] === undefined) return 0;

        return Math.abs(_local_3[k]);
    }

    private getTileHeightOriginal(k: number, _arg_2: number): number
    {
        if (((((k < 0) || (k >= this._width)) || (_arg_2 < 0)) || (_arg_2 >= this._height)))
        {
            return RoomPlaneParser.TILE_BLOCKED;
        }
        if (this._floorHoleMatrix[_arg_2][k])
        {
            return RoomPlaneParser.TILE_HOLE;
        }
        var _local_3 = this._tileMatrixOriginal[_arg_2];
        return _local_3[k];
    }

    private getTileHeightInternal(k: number, _arg_2: number): number
    {
        if (((((k < 0) || (k >= this._width)) || (_arg_2 < 0)) || (_arg_2 >= this._height)))
        {
            return RoomPlaneParser.TILE_BLOCKED;
        }
        var _local_3 = this._tileMatrix[_arg_2];
        return _local_3[k];
    }

    public initializeFromTileData(k: number=-1): boolean
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
        var _local_4: Point = RoomPlaneParser.findEntranceTile(this._tileMatrix);

        _local_3 = 0;
        while (_local_3 < this._height)
        {
            _local_2 = 0;
            while (_local_2 < this._width)
            {
                if(this._floorHoleMatrix[_local_3] === undefined) this._floorHoleMatrix[_local_3] = [];
                if (this._floorHoleMatrix[_local_3][_local_2])
                {
                    this.setTileHeight(_local_2, _local_3, RoomPlaneParser.TILE_HOLE);
                }
                _local_2++;
            }
            _local_3++;
        }

        return this.initialize(_local_4);
    }

    private initialize(k: Point): boolean
    {
        var _local_5: number[][];
        var _local_2: number = 0;
        if (k != null)
        {
            _local_2 = this.getTileHeight(k.x, k.y);
            this.setTileHeight(k.x, k.y, RoomPlaneParser.TILE_BLOCKED);
        }
        this._floorHeight = RoomPlaneParser.getFloorHeight(this._tileMatrix);
        this.createWallPlanes();
        var _local_3: number[][] = [];

        for(let _local_4 of this._tileMatrix) _local_3.push(_local_4.concat());

        RoomPlaneParser.padHeightMap(_local_3);
        RoomPlaneParser.addTileTypes(_local_3);
        RoomPlaneParser.unpadHeightMap(_local_3);
        _local_5 = RoomPlaneParser.expandFloorTiles(_local_3);
        this.extractPlanes(_local_5);
        if (k != null)
        {
            this.setTileHeight(k.x, k.y, _local_2);
            this.addFloor(new Vector3d((k.x + 0.5), (k.y + 0.5), _local_2), new Vector3d(-1, 0, 0), new Vector3d(0, -1, 0), false, false, false, false);
        }
        
        return true;
    }

    private generateWallData(k: Point, _arg_2: boolean): RoomWallData
    {
        var _local_8: boolean;
        var _local_9: boolean;
        var _local_10: number;
        var _local_11: Point;
        var _local_12: number;
        var _local_3: RoomWallData = new RoomWallData();
        var _local_4: Function[] = [this.extractTopWall.bind(this), this.extractRightWall.bind(this), this.extractBottomWall.bind(this), this.extractLeftWall.bind(this)];
        var _local_5: number = 0;
        var _local_6: Point = new Point(k.x, k.y);
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

    private hidePeninsulaWallChains(k: RoomWallData): void
    {
        var _local_5: number;
        var _local_6: number;
        var _local_7: boolean;
        var _local_8: number;
        var _local_2: number = 0;
        var _local_3: number = k.count;
        while (_local_2 < _local_3)
        {
            const _local_4 = _local_2;
            
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

    private updateWallsNextToHoles(k: RoomWallData): void
    {
        var _local_4: Point;
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
                _local_7 = RoomWallData.WALL_DIRECTION_VECTORS[_local_5];
                _local_8 = RoomWallData.WALL_NORMAL_VECTORS[_local_5];
                _local_9 = 0;
                _local_10 = 0;
                while (_local_10 < _local_6)
                {
                    if (this.getTileHeightInternal(((_local_4.x + (_local_10 * _local_7.x)) - _local_8.x), ((_local_4.y + (_local_10 * _local_7.y)) - _local_8.y)) == RoomPlaneParser.TILE_HOLE)
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

    private resolveOriginalWallIndex(k: Point, _arg_2: Point, _arg_3: RoomWallData): number
    {
        var _local_10: Point;
        var _local_11: Point;
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

    private hideOriginallyHiddenWalls(k: RoomWallData, _arg_2: RoomWallData): void
    {
        var _local_5: Point;
        var _local_6: Point;
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
                _local_6 = new Point(_local_5.x, _local_5.y);
                _local_7 = RoomWallData.WALL_DIRECTION_VECTORS[k.getDirection(_local_4)];
                _local_8 = k._Str_13743(_local_4);
                _local_6.x = (_local_6.x + (_local_7.x * _local_8));
                _local_6.y = (_local_6.y + (_local_7.y * _local_8));
                _local_9 = this.resolveOriginalWallIndex(_local_5, _local_6, _arg_2);
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

    private checkWallHiding(k: RoomWallData, _arg_2: RoomWallData): void
    {
        this.hidePeninsulaWallChains(_arg_2);
        this.updateWallsNextToHoles(k);
        this.hideOriginallyHiddenWalls(k, _arg_2);
    }

    private addWalls(k: RoomWallData, _arg_2: RoomWallData): void
    {
        let _local_3 = k.count;
        let _local_4 = _arg_2.count;
        let _local_7 = 0;

        while(_local_7 < _local_3)
        {
            if(!k._Str_10019(_local_7))
            {
                let _local_8 = k._Str_10778(_local_7);
                let _local_9 = k.getDirection(_local_7);
                let _local_10 = k._Str_13743(_local_7);
                let _local_11 = RoomWallData.WALL_DIRECTION_VECTORS[_local_9];
                let _local_12 = RoomWallData.WALL_NORMAL_VECTORS[_local_9];
                let _local_13 = -1;
                let _local_14 = 0;

                while(_local_14 < _local_10)
                {
                    let _local_27 = this.getTileHeightInternal(((_local_8.x + (_local_14 * _local_11.x)) + _local_12.x), ((_local_8.y + (_local_14 * _local_11.y)) + _local_12.y));
                    
                    if(((_local_27 >= 0) && ((_local_27 < _local_13) || (_local_13 < 0))))
                    {
                        _local_13 = _local_27;
                    }

                    _local_14++;
                }

                let _local_15 = _local_13;

                let _local_16 = new Vector3d(_local_8.x, _local_8.y, _local_15);
                _local_16 = Vector3d.sum(_local_16, Vector3d.product(_local_12, 0.5));
                _local_16 = Vector3d.sum(_local_16, Vector3d.product(_local_11, -0.5));

                let _local_17 = ((this.wallHeight + Math.min(RoomPlaneParser.MAX_WALL_ADDITIONAL_HEIGHT, this.floorHeight)) - _local_13);
                let _local_18 = Vector3d.product(_local_11, -(_local_10));
                let _local_19 = new Vector3d(0, 0, _local_17);
                
                _local_16 = Vector3d.dif(_local_16, _local_18);

                let _local_20 = this.resolveOriginalWallIndex(_local_8, k._Str_19138(_local_7), _arg_2);

                let _local_5 = 0;
                let _local_6 = 0;

                if(_local_20 >= 0)
                {
                    _local_5 = _arg_2.getDirection(((_local_20 + 1) % _local_4));
                    _local_6 = _arg_2.getDirection((((_local_20 - 1) + _local_4) % _local_4));
                }
                else
                {
                    _local_5 = k.getDirection(((_local_7 + 1) % _local_3));
                    _local_6 = k.getDirection((((_local_7 - 1) + _local_3) % _local_3));
                }

                let _local_21 = null;

                if((((_local_5 - _local_9) + 4) % 4) == 3)
                {
                    _local_21 = RoomWallData.WALL_NORMAL_VECTORS[_local_5];
                }
                else
                {
                    if ((((_local_9 - _local_6) + 4) % 4) == 3)
                    {
                        _local_21 = RoomWallData.WALL_NORMAL_VECTORS[_local_6];
                    }
                }

                let _local_22 = k._Str_17084(_local_7);
                let _local_23 = k._Str_17084((((_local_7 - 1) + _local_3) % _local_3));
                let _local_24 = k._Str_10019(((_local_7 + 1) % _local_3));
                let _local_25 = k._Str_25455(_local_7);
                let _local_26 = k._Str_24163(_local_7);

                this.addWall(_local_16, _local_18, _local_19, _local_21, ((!(_local_23)) || (_local_25)), ((!(_local_22)) || (_local_26)), (!(_local_24)));
            }

            _local_7++;
        }
    }

    private createWallPlanes(): boolean
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
        var _local_6: number = 0;
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
        var _local_7: number = Math.min(RoomPlaneParser.MAX_WALL_ADDITIONAL_HEIGHT, ((this._fixedWallHeight != -1) ? this._fixedWallHeight : RoomPlaneParser.getFloorHeight(k)));
        var _local_8: number = this.minX;
        var _local_9: number = this.minY;
        _local_9 = this.minY;
        while (_local_9 <= this.maxY)
        {
            if (this.getTileHeightInternal(_local_8, _local_9) > RoomPlaneParser.TILE_HOLE)
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
        var _local_10: Point = new Point(_local_8, _local_9);
        var _local_11: RoomWallData = this.generateWallData(_local_10, true);
        var _local_12: RoomWallData = this.generateWallData(_local_10, false);
        if (_local_11 != null)
        {
            _local_13 = _local_11.count;
            _local_14 = _local_12.count;
            this.checkWallHiding(_local_11, _local_12);
            this.addWalls(_local_11, _local_12);
        }
        _local_3 = 0;
        while (_local_3 < this.tileMapHeight)
        {
            _local_2 = 0;
            while (_local_2 < this.tileMapWidth)
            {
                if (this.getTileHeightInternal(_local_2, _local_3) < 0)
                {
                    this.setTileHeight(_local_2, _local_3, -(_local_7 + this.wallHeight));
                }
                _local_2++;
            }
            _local_3++;
        }
        return true;
    }

    private extractTopWall(k: Point, _arg_2: boolean): Point
    {
        if (k == null)
        {
            return null;
        }
        var _local_3: number = 1;
        var _local_4: number = RoomPlaneParser.TILE_HOLE;
        if (!_arg_2)
        {
            _local_4 = RoomPlaneParser.TILE_BLOCKED;
        }
        while (_local_3 < 1000)
        {
            if (this.getTileHeightInternal((k.x + _local_3), k.y) > _local_4)
            {
                return new Point(((k.x + _local_3) - 1), k.y);
            }
            if (this.getTileHeightInternal((k.x + _local_3), (k.y + 1)) <= _local_4)
            {
                return new Point((k.x + _local_3), (k.y + 1));
            }
            _local_3++;
        }
        return null;
    }

    private extractRightWall(k: Point, _arg_2: boolean): Point
    {
        if (k == null)
        {
            return null;
        }
        var _local_3: number = 1;
        var _local_4: number = RoomPlaneParser.TILE_HOLE;
        if (!_arg_2)
        {
            _local_4 = RoomPlaneParser.TILE_BLOCKED;
        }
        while (_local_3 < 1000)
        {
            if (this.getTileHeightInternal(k.x, (k.y + _local_3)) > _local_4)
            {
                return new Point(k.x, (k.y + (_local_3 - 1)));
            }
            if (this.getTileHeightInternal((k.x - 1), (k.y + _local_3)) <= _local_4)
            {
                return new Point((k.x - 1), (k.y + _local_3));
            }
            _local_3++;
        }
        return null;
    }

    private extractBottomWall(k: Point, _arg_2: boolean): Point
    {
        if (k == null)
        {
            return null;
        }
        var _local_3: number = 1;
        var _local_4: number = RoomPlaneParser.TILE_HOLE;
        if (!_arg_2)
        {
            _local_4 = RoomPlaneParser.TILE_BLOCKED;
        }
        while (_local_3 < 1000)
        {
            if (this.getTileHeightInternal((k.x - _local_3), k.y) > _local_4)
            {
                return new Point((k.x - (_local_3 - 1)), k.y);
            }
            if (this.getTileHeightInternal((k.x - _local_3), (k.y - 1)) <= _local_4)
            {
                return new Point((k.x - _local_3), (k.y - 1));
            }
            _local_3++;
        }
        return null;
    }

    private extractLeftWall(k: Point, _arg_2: boolean): Point
    {
        if (k == null)
        {
            return null;
        }
        var _local_3: number = 1;
        var _local_4: number = RoomPlaneParser.TILE_HOLE;
        if (!_arg_2)
        {
            _local_4 = RoomPlaneParser.TILE_BLOCKED;
        }
        while (_local_3 < 1000)
        {
            if (this.getTileHeightInternal(k.x, (k.y - _local_3)) > _local_4)
            {
                return new Point(k.x, (k.y - (_local_3 - 1)));
            }
            if (this.getTileHeightInternal((k.x + 1), (k.y - _local_3)) <= _local_4)
            {
                return new Point((k.x + 1), (k.y - _local_3));
            }
            _local_3++;
        }
        return null;
    }

    private addWall(k: IVector3D, _arg_2: IVector3D, _arg_3: IVector3D, _arg_4: IVector3D, _arg_5: boolean, _arg_6: boolean, _arg_7: boolean): void
    {
        this.addPlane(RoomPlaneData.PLANE_WALL, k, _arg_2, _arg_3, [_arg_4]);
        //this.addPlane(RoomPlaneData.PLANE_LANDSCAPE, k, _arg_2, _arg_3, [_arg_4]);
        var _local_8: number = (RoomPlaneParser.WALL_THICKNESS * this._wallThicknessMultiplier);
        var _local_9: number = (RoomPlaneParser.FLOOR_THICKNESS * this._floorThicknessMultiplier);
        var _local_10:Vector3d = Vector3d.crossProduct(_arg_2, _arg_3);
        var _local_11:Vector3d = Vector3d.product(_local_10, ((1 / _local_10.length) * -(_local_8)));
        this.addPlane(RoomPlaneData.PLANE_WALL, Vector3d.sum(k, _arg_3), _arg_2, _local_11, [_local_10, _arg_4]);
        if (_arg_5)
        {
            this.addPlane(RoomPlaneData.PLANE_WALL, Vector3d.sum(Vector3d.sum(k, _arg_2), _arg_3), Vector3d.product(_arg_3, (-(_arg_3.length + _local_9) / _arg_3.length)), _local_11, [_local_10, _arg_4]);
        }
        if (_arg_6)
        {
            this.addPlane(RoomPlaneData.PLANE_WALL, Vector3d.sum(k, Vector3d.product(_arg_3, (-(_local_9) / _arg_3.length))), Vector3d.product(_arg_3, ((_arg_3.length + _local_9) / _arg_3.length)), _local_11, [_local_10, _arg_4]);
            if (_arg_7)
            {
                const _local_12 = Vector3d.product(_arg_2, (_local_8 / _arg_2.length));
                this.addPlane(RoomPlaneData.PLANE_WALL, Vector3d.sum(Vector3d.sum(k, _arg_3), Vector3d.product(_local_12, -1)), _local_12, _local_11, [_local_10, _arg_2, _arg_4]);
            }
        }
    }

    private addFloor(k: IVector3D, _arg_2: IVector3D, _arg_3: IVector3D, _arg_4: boolean, _arg_5: boolean, _arg_6: boolean, _arg_7: boolean): void
    {
        var _local_9: number;
        var _local_10:Vector3d;
        var _local_11:Vector3d;
        var _local_8: RoomPlaneData = this.addPlane(RoomPlaneData.PLANE_FLOOR, k, _arg_2, _arg_3);
        if (_local_8 != null)
        {
            _local_9 = (RoomPlaneParser.FLOOR_THICKNESS * this._floorThicknessMultiplier);
            _local_10 = new Vector3d(0, 0, _local_9);
            _local_11 = Vector3d.dif(k, _local_10);
            if (_arg_6)
            {
                this.addPlane(RoomPlaneData.PLANE_FLOOR, _local_11, _arg_2, _local_10);
            }
            if (_arg_7)
            {
                this.addPlane(RoomPlaneData.PLANE_FLOOR, Vector3d.sum(_local_11, Vector3d.sum(_arg_2, _arg_3)), Vector3d.product(_arg_2, -1), _local_10);
            }
            if (_arg_4)
            {
                this.addPlane(RoomPlaneData.PLANE_FLOOR, Vector3d.sum(_local_11, _arg_3), Vector3d.product(_arg_3, -1), _local_10);
            }
            if (_arg_5)
            {
                this.addPlane(RoomPlaneData.PLANE_FLOOR, Vector3d.sum(_local_11, _arg_2), _arg_3, _local_10);
            }
        }
    }

    public initializeFromMapData(data: RoomMapData): boolean
    {
        if(!data) return false;

        this.reset();

        this.resetFloorHoles();

        const width             = data.width;
        const height            = data.height;
        const wallHeight        = data.wallHeight;
        const fixedWallsHeight  = data.fixedWallsHeight;

        this.initializeTileMap(width, height);

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

                        if(column) this.setTileHeight(x, y, column.height);

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

                this.addFloorHole(hole.id, hole.x, hole.y, hole.width, hole.height);

                index++;
            }

            this.initializeHoleMap();
        }

        this.wallHeight         = wallHeight;
        this.restrictsDragging  = data.restrictsDragging;
        this.restrictsScaling   = data.restrictsScaling;
        this.restrictedScale    = data.restrictedScale;

        this.initializeFromTileData(fixedWallsHeight);
        
        return true;
    }

    private addPlane(k: number, _arg_2: IVector3D, _arg_3: IVector3D, _arg_4: IVector3D, _arg_5: IVector3D[] = null): RoomPlaneData
    {
        if (((_arg_3.length == 0) || (_arg_4.length == 0)))
        {
            return null;
        }
        var _local_6: RoomPlaneData = new RoomPlaneData(k, _arg_2, _arg_3, _arg_4, _arg_5);
        this._planes.push(_local_6);
        return _local_6;
    }

    public getMapData(): RoomMapData
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
        data.restrictsDragging  = this.restrictsDragging;
        data.restrictsScaling   = this.restrictsScaling;
        data.restrictedScale    = this.restrictedScale;

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

    public getPlaneLocation(k: number): IVector3D
    {
        if(((k < 0) || (k >= this.planeCount))) return null;

        const planeData = this._planes[k];

        if(!planeData) return null;

        return planeData.loc;
    }

    public getPlaneNormal(k: number): IVector3D
    {
        if(((k < 0) || (k >= this.planeCount))) return null;

        const planeData = this._planes[k];

        if(!planeData) return null;

        return planeData.normal;
    }

    public getPlaneLeftSide(k: number): IVector3D
    {
        if(((k < 0) || (k >= this.planeCount))) return null;

        const planeData = this._planes[k];

        if(!planeData) return null;

        return planeData._Str_5424;
    }

    public getPlaneRightSide(k: number): IVector3D
    {
        if(((k < 0) || (k >= this.planeCount))) return null;

        const planeData = this._planes[k];

        if(!planeData) return null;

        return planeData._Str_4968;
    }

    public getPlaneNormalDirection(k: number): IVector3D
    {
        if(((k < 0) || (k >= this.planeCount))) return null;

        const planeData = this._planes[k];

        if(!planeData) return null;

        return planeData._Str_25207;
    }

    public getPlaneSecondaryNormals(k: number): IVector3D[]
    {
        var _local_3: IVector3D[];
        var _local_4: number;
        if (((k < 0) || (k >= this.planeCount)))
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

    public getPlaneType(k: number): number
    {
        if(((k < 0) || (k >= this.planeCount))) return RoomPlaneData.PLANE_UNDEFINED;

        const planeData = this._planes[k];

        if(!planeData) return RoomPlaneData.PLANE_UNDEFINED;

        return planeData.type;
    }

    public getPlaneMaskCount(k: number): number
    {
        if(((k < 0) || (k >= this.planeCount))) return 0;

        const planeData = this._planes[k];

        if(!planeData) return 0;

        return planeData._Str_6845;
    }

    public getPlaneMaskLeftSideLoc(k: number, _arg_2: number): number
    {
        if(((k < 0) || (k >= this.planeCount))) return -1;

        const planeData = this._planes[k];

        if(!planeData) return -1;

        return planeData._Str_25133(_arg_2);
    }

    public getPlaneMaskRightSideLoc(k: number, _arg_2: number): number
    {
        if(((k < 0) || (k >= this.planeCount))) return -1;

        const planeData = this._planes[k];

        if(!planeData) return -1;

        return planeData._Str_23609(_arg_2);
    }

    public getPlaneMaskLeftSideLength(k: number, _arg_2: number): number
    {
        if(((k < 0) || (k >= this.planeCount))) return -1;

        const planeData = this._planes[k];

        if(!planeData) return -1;

        return planeData._Str_25097(_arg_2);
    }

    public getPlaneMaskRightSideLength(k: number, _arg_2: number): number
    {
        if(((k < 0) || (k >= this.planeCount))) return -1;

        const planeData = this._planes[k];

        if(!planeData) return -1;

        return planeData._Str_25617(_arg_2);
    }

    public addFloorHole(k: number, _arg_2: number, _arg_3: number, _arg_4: number, _arg_5: number): void
    {
        this.removeFloorHole(k);
        
        this._floorHoles.set(k, new RoomFloorHole(_arg_2, _arg_3, _arg_4, _arg_5));
    }

    public removeFloorHole(k: number): void
    {
        this._floorHoles.delete(k);
    }

    public resetFloorHoles(): void
    {
        this._floorHoles.clear();
    }

    private initializeHoleMap(): void
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

    private extractPlanes(k: number[][]): void
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
                    this.addFloor(new Vector3d((_local_18 + _local_20), (_local_19 + _local_21), (_local_8 / 4)), new Vector3d(-(_local_20), 0, 0), new Vector3d(0, -(_local_21), 0), _local_13, _local_11, _local_14, _local_12);
                }
                _local_7++;
            }
            _local_6++;
        }
    }

    public get restrictsDragging(): boolean
    {
        return this._restrictsDragging;
    }

    public set restrictsDragging(flag: boolean)
    {
        this._restrictsDragging = flag;
    }

    public get restrictsScaling(): boolean
    {
        return this._restrictsScaling;
    }

    public set restrictsScaling(flag: boolean)
    {
        this._restrictsScaling = flag;
    }

    public get restrictedScale(): number
    {
        return this._restrictedScale;
    }

    public set restrictedScale(scale: number)
    {
        this._restrictedScale = scale;
    }
}