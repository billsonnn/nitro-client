import { IVector3D } from '../../../room/utils/IVector3D';
import { Vector3d } from '../../../room/utils/Vector3d';
import { RoomPlaneMaskData } from './RoomPlaneMaskData';

export class RoomPlaneData 
{
    public static _Str_12684: number = 0;
    public static _Str_6072: number = 1;
    public static _Str_6206: number = 2;
    public static _Str_7988: number = 3;
    public static _Str_18788: number = 4;

    private _type: number = 0;
    private _loc: Vector3d = null;
    private _leftSide: Vector3d = null;
    private _rightSide: Vector3d = null;
    private _normal: Vector3d = null;
    private _normalDirection: Vector3d = null;
    private _secondaryNormals: Vector3d[];
    private _masks: RoomPlaneMaskData[];

    constructor(k: number, _arg_2: IVector3D, _arg_3: IVector3D, _arg_4: IVector3D, _arg_5: IVector3D[])
    {
        var _local_6: number;
        var _local_7: number;
        var _local_8: number;
        var _local_9: number;
        var _local_10: number;
        var _local_11: number;
        var _local_12: IVector3D;
        var _local_13: Vector3d;
        this._secondaryNormals = [];
        this._masks = [];
        this._loc = new Vector3d();
        this._loc.assign(_arg_2);
        this._leftSide = new Vector3d();
        this._leftSide.assign(_arg_3);
        this._rightSide = new Vector3d();
        this._rightSide.assign(_arg_4);
        this._type = k;
        if (((!(_arg_3 == null)) && (!(_arg_4 == null))))
        {
            this._normal = Vector3d.crossProduct(_arg_3, _arg_4);
            _local_6 = 0;
            _local_7 = 0;
            _local_8 = 0;
            _local_9 = 0;
            _local_10 = 0;
            if (((!(this.normal.x == 0)) || (!(this.normal.y == 0))))
            {
                _local_9 = this.normal.x;
                _local_10 = this.normal.y;
                _local_6 = (360 + ((Math.atan2(_local_10, _local_9) / Math.PI) * 180));
                if (_local_6 >= 360)
                {
                    _local_6 = (_local_6 - 360);
                }
                _local_9 = Math.sqrt(((this.normal.x * this.normal.x) + (this.normal.y * this.normal.y)));
                _local_10 = this.normal.z;
                _local_7 = (360 + ((Math.atan2(_local_10, _local_9) / Math.PI) * 180));
                if (_local_7 >= 360)
                {
                    _local_7 = (_local_7 - 360);
                }
            }
            else
            {
                if (this.normal.z < 0)
                {
                    _local_7 = 90;
                }
                else
                {
                    _local_7 = 270;
                }
            }
            this._normalDirection = new Vector3d(_local_6, _local_7, _local_8);
        }
        if (((!(_arg_5 == null)) && (_arg_5.length > 0)))
        {
            _local_11 = 0;
            while (_local_11 < _arg_5.length)
            {
                _local_12 = _arg_5[_local_11];
                if (((!(_local_12 == null)) && (_local_12.length > 0)))
                {
                    _local_13 = new Vector3d();
                    _local_13.assign(_local_12);
                    _local_13.multiply((1 / _local_13.length));
                    this._secondaryNormals.push(_local_13);
                }
                _local_11++;
            }
        }
    }

    public get type(): number
    {
        return this._type;
    }

    public get loc(): IVector3D
    {
        return this._loc;
    }

    public get _Str_5424(): IVector3D
    {
        return this._leftSide;
    }

    public get _Str_4968(): IVector3D
    {
        return this._rightSide;
    }

    public get normal(): IVector3D
    {
        return this._normal;
    }

    public get _Str_25207(): IVector3D
    {
        return this._normalDirection;
    }

    public get _Str_20277(): number
    {
        return this._secondaryNormals.length;
    }

    public get _Str_6845(): number
    {
        return this._masks.length;
    }

    public _Str_22585(k: number): IVector3D
    {
        if (((k < 0) || (k >= this._Str_20277)))
        {
            return null;
        }
        var _local_2:Vector3d = new Vector3d();
        _local_2.assign((this._secondaryNormals[k] as IVector3D));
        return _local_2;
    }

    public addMask(k: number, _arg_2: number, _arg_3: number, _arg_4: number):void
    {
        var _local_5:RoomPlaneMaskData = new RoomPlaneMaskData(k, _arg_2, _arg_3, _arg_4);
        this._masks.push(_local_5);
    }

    private _Str_8361(k: number):RoomPlaneMaskData
    {
        if (((k < 0) || (k >= this._Str_6845)))
        {
            return null;
        }
        return this._masks[k];
    }

    public _Str_25133(k: number): number
    {
        var _local_2:RoomPlaneMaskData = this._Str_8361(k);
        if (_local_2 != null)
        {
            return _local_2._Str_5120;
        }
        return -1;
    }

    public _Str_23609(k: number): number
    {
        var _local_2:RoomPlaneMaskData = this._Str_8361(k);
        if (_local_2 != null)
        {
            return _local_2._Str_4659;
        }
        return -1;
    }

    public _Str_25097(k: number): number
    {
        var _local_2:RoomPlaneMaskData = this._Str_8361(k);
        if (_local_2 != null)
        {
            return _local_2._Str_9124;
        }
        return -1;
    }

    public _Str_25617(k: number): number
    {
        var _local_2:RoomPlaneMaskData = this._Str_8361(k);
        if (_local_2 != null)
        {
            return _local_2._Str_12156;
        }
        return -1;
    }
}