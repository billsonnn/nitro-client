import { IVector3D } from '../../../room/utils/IVector3D';
import { RoomPlaneBitmapMaskData } from './RoomPlaneBitmapMaskData';

export class RoomPlaneBitmapMaskParser 
{
    private _masks: Map<string, RoomPlaneBitmapMaskData>;

    constructor()
    {
        this._masks = new Map();
    }

    public get _Str_6845(): number
    {
        return this._masks.size;
    }

    public dispose(): void
    {
        if(this._masks)
        {
            this.reset();

            this._masks = null;
        }
    }

    public initialize(k: any): boolean
    {
        // var _local_7:XML;
        // var _local_8:String;
        // var _local_9:String;
        // var _local_10:Vector3d;
        // var _local_11:String;
        // var _local_12:XMLList;
        // var _local_13:XML;
        // var _local_14:RoomPlaneBitmapMaskData;
        // if (k == null)
        // {
        //     return false;
        // }
        // this._masks.reset();
        // var _local_2:Array = ["id", "type", "category"];
        // var _local_3:Array = ["x", "y", "z"];
        // var _local_4:XMLList;
        // var _local_5:XMLList = k.planeMask;
        // var _local_6:int;
        // while (_local_6 < _local_5.length())
        // {
        //     _local_7 = _local_5[_local_6];
        //     if (!XMLValidator._Str_2747(_local_7, _local_2))
        //     {
        //         return false;
        //     }
        //     _local_8 = _local_7.@id;
        //     _local_9 = _local_7.@type;
        //     _local_10 = null;
        //     _local_11 = _local_7.@category;
        //     _local_12 = _local_7.location;
        //     if (_local_12.length() != 1)
        //     {
        //         return false;
        //     }
        //     _local_13 = _local_12[0];
        //     if (!XMLValidator._Str_2747(_local_13, _local_3))
        //     {
        //         return false;
        //     }
        //     _local_10 = new Vector3d(Number(_local_13.@x), Number(_local_13.@y), Number(_local_13.@z));
        //     _local_14 = new RoomPlaneBitmapMaskData(_local_9, _local_10, _local_11);
        //     this._masks.add(_local_8, _local_14);
        //     _local_6++;
        // }
        return true;
    }

    public reset(): void
    {
        for(let mask of this._masks.values())
        {
            if(!mask) continue;

            mask.dispose();
        }

        this._masks.clear();
    }

    public addMask(k: string, _arg_2: string, _arg_3: IVector3D, _arg_4: string): void
    {
        const mask = new RoomPlaneBitmapMaskData(_arg_2, _arg_3, _arg_4);

        this._masks.set(k, mask);
    }

    public _Str_23574(k: string):Boolean
    {
        const existing = this._masks.get(k);

        if(existing)
        {
            this._masks.delete(k);

            existing.dispose();

            return true;
        }

        return false;
    }

    public _Str_5598(): any
    {
        const planeMasks: any[] = [];

        for(let [ key, mask ] of this._masks.entries())
        {
            if(!mask) continue;

            const _local_3  = this._Str_21678(mask);
            const _local_4  = this._Str_21644(mask);
            const _local_6  = this._Str_19038(mask);

            const newMask: any = {
                id: key,
                type: _local_3,
                category: _local_4,
                locations: []
            };

            if(_local_6)
            {
                newMask.locations.push({ x: _local_6.x, y: _local_6.y, z: _local_6.z });

                planeMasks.push(newMask);
            }
        }

        return planeMasks;
    }

    public _Str_19038(mask: RoomPlaneBitmapMaskData): IVector3D
    {
        if(!mask) return null;

        return mask.loc;
    }

    public _Str_21678(mask: RoomPlaneBitmapMaskData): string
    {
        if(!mask) return null;

        return mask.type;
    }

    public _Str_21644(mask: RoomPlaneBitmapMaskData): string
    {
        if(!mask) return null;

        return mask.category;
    }
}