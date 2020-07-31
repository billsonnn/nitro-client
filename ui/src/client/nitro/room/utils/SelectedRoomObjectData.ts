import { IVector3D } from '../../../room/utils/IVector3D';
import { Vector3d } from '../../../room/utils/Vector3d';
import { ISelectedRoomObjectData } from '../ISelectedRoomObjectData';
import { IObjectData } from '../object/data/IObjectData';

export class SelectedRoomObjectData implements ISelectedRoomObjectData
{
    private _id: number = 0;
    private _category: number = 0;
    private _operation: string = "";
    private _loc: Vector3d = null;
    private _dir: Vector3d = null;
    private _typeId: number = 0;
    private _instanceData: string = null;
    private _stuffData: IObjectData = null;
    private _state: number = -1;
    private _animFrame: number = -1;
    private _posture: string = null;

    constructor(k: number, _arg_2: number, _arg_3: string, _arg_4: IVector3D, _arg_5: IVector3D, _arg_6: number = 0, _arg_7: string = null, _arg_8: IObjectData = null, _arg_9: number = -1, _arg_10: number = -1, _arg_11: string = null)
    {
        this._id = k;
        this._category = _arg_2;
        this._operation = _arg_3;
        this._loc = new Vector3d();
        this._loc.assign(_arg_4);
        this._dir = new Vector3d();
        this._dir.assign(_arg_5);
        this._typeId = _arg_6;
        this._instanceData = _arg_7;
        this._stuffData = _arg_8;
        this._state = _arg_9;
        this._animFrame = _arg_10;
        this._posture = _arg_11;
    }

    public get id(): number
    {
        return this._id;
    }

    public get category(): number
    {
        return this._category;
    }

    public get operation(): string
    {
        return this._operation;
    }

    public get loc():Vector3d
    {
        return this._loc;
    }

    public get dir():Vector3d
    {
        return this._dir;
    }

    public get typeId(): number
    {
        return this._typeId;
    }

    public get _Str_4766(): string
    {
        return this._instanceData;
    }

    public get stuffData(): IObjectData
    {
        return this._stuffData;
    }

    public get state(): number
    {
        return this._state;
    }

    public get _Str_15896(): number
    {
        return this._animFrame;
    }

    public get posture(): string
    {
        return this._posture;
    }

    public dispose(): void
    {
        this._loc = null;
        this._dir = null;
    }
}