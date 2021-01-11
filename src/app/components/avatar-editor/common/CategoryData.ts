import { IPartColor } from '../../../../client/nitro/avatar/structure/figure/IPartColor';
import { AvatarEditorGridColorItem } from './AvatarEditorGridColorItem';
import { AvatarEditorGridPartItem } from './AvatarEditorGridPartItem';

export class CategoryData 
{
    private _Str_13041: number = 2;

    private _name: string;
    private _parts: AvatarEditorGridPartItem[];
    private _palettes: AvatarEditorGridColorItem[][];
    private _selectedPartIndex: number = -1;
    private _paletteIndexes: number[];

    constructor(name: string, k: AvatarEditorGridPartItem[], _arg_2: AvatarEditorGridColorItem[][])
    {
        this._name              = name;
        this._parts             = k;
        this._palettes          = _arg_2;
        this._selectedPartIndex = -1;
    }

    private static _Str_21219(palettes: AvatarEditorGridColorItem[], clubLevel: number): number
    {
        if(!palettes || !palettes.length) return -1;

        let _local_3 = 0;

        while (_local_3 < palettes.length)
        {
            const _local_4 = palettes[_local_3];

            if (((_local_4._Str_3420) && (_local_4._Str_3420.clubLevel <= clubLevel)))
            {
                return _local_4._Str_3420.id;
            }

            _local_3++;
        }

        return -1;
    }

    public init(): void
    {
        for(let part of this._parts)
        {
            if(!part) continue;

            part.init();
        }
    }


    public dispose(): void
    {
        if(this._parts)
        {
            for(let k of this._parts) k.dispose();

            this._parts = null;
        }

        if(this._palettes)
        {
            for(let _local_2 of this._palettes)
            {
                if(_local_2) for(let _local_3 of _local_2) _local_3.dispose();
            }

            this._palettes = null;
        }

        this._selectedPartIndex = -1;
        this._paletteIndexes    = null;
    }

    public _Str_20245(k: number): void
    {
        if(!this._parts) return;

        let i = 0;

        while (i < this._parts.length)
        {
            const _local_3 = this._parts[i];

            if (_local_3.id === k)
            {
                this._Str_8066(i);

                return;
            }

            i++;
        }
    }

    public _Str_17669(k: number[]): void
    {
        if(!k || !this._palettes) return;

        this._paletteIndexes = new Array(k.length);

        let _local_3 = 0;

        while (_local_3 < this._palettes.length)
        {
            const _local_4 = this._Str_783(_local_3);

            if(_local_4)
            {
                let _local_5 = 0;

                if (k.length > _local_3)
                {
                    _local_5 = k[_local_3];
                }
                else
                {
                    const _local_7 = _local_4[0];

                    if(_local_7 && _local_7._Str_3420) _local_5 = _local_7._Str_3420.id;
                }

                let _local_6 = 0;

                while(_local_6 < _local_4.length)
                {
                    const _local_2 = _local_4[_local_6];

                    if(_local_2._Str_3420.id === _local_5)
                    {
                        this._paletteIndexes[_local_3] = _local_6;

                        _local_2.isSelected = true;
                    }
                    else
                    {
                        _local_2.isSelected = false;
                    }

                    _local_6++;
                }
            }

            _local_3++;
        }

        this._Str_19574();
    }

    public _Str_8066(k: number): AvatarEditorGridPartItem
    {
        if (!this._parts)
        {
            return null;
        }
        if (((this._selectedPartIndex >= 0) && (this._parts.length > this._selectedPartIndex)))
        {
            const _local_2 = this._parts[this._selectedPartIndex];

            if (_local_2)
            {
                _local_2.isSelected = false;
            }
        }
        if (this._parts.length > k)
        {
            const _local_3 = (this._parts[k] as AvatarEditorGridPartItem);

            if (_local_3)
            {
                _local_3.isSelected = true;

                this._selectedPartIndex = k;

                return _local_3;
            }
        }
        return null;
    }

    public _Str_17959(k: number, _arg_2: number): AvatarEditorGridColorItem
    {
        const _local_3 = this._Str_783(_arg_2);

        if(!_local_3) return null;

        if(_local_3.length <= k) return null;

        this._Str_23284(this._paletteIndexes[_arg_2], _arg_2);

        this._paletteIndexes[_arg_2] = k;

        const _local_4 = _local_3[k];
       
        if(!_local_4) return null;

        _local_4.isSelected = true;

        this._Str_19574();

        return _local_4;
    }

    public _Str_24480(k: number): number
    {
        return this._paletteIndexes[k];
    }

    private _Str_23284(k: number, _arg_2: number): void
    {
        const _local_3 = this._Str_783(_arg_2);

        if(!_local_3) return;

        if(_local_3.length <= k) return;

        const _local_4 = _local_3[k];

        if(!_local_4) return;

        _local_4.isSelected = false;
    }

    public _Str_11211(): number[]
    {
        if(!this._paletteIndexes || !this._paletteIndexes.length) return null;

        if(!this._palettes || !this._palettes.length) return null;

        const k = this._palettes[0];

        if(!k || (!k.length)) return null;

        const _local_2 = k[0];

        if(!_local_2 || !_local_2._Str_3420) return null;

        const _local_3              = _local_2._Str_3420.id;
        const _local_4: number[]    = [];

        let _local_5 = 0;

        while(_local_5 < this._paletteIndexes.length)
        {
            const _local_7 = this._palettes[_local_5];

            if(!((!(_local_7)) || (_local_7.length <= _local_5)))
            {
                if(_local_7.length > this._paletteIndexes[_local_5])
                {
                    const _local_8 = _local_7[this._paletteIndexes[_local_5]];

                    if(_local_8 && _local_8._Str_3420)
                    {
                        _local_4.push(_local_8._Str_3420.id);
                    }
                    else
                    {
                        _local_4.push(_local_3);
                    }
                }
                else
                {
                    _local_4.push(_local_3);
                }
            }

            _local_5++;
        }

        const _local_6 = this._Str_6315();

        if(!_local_6) return null;

        return _local_4.slice(0, Math.max(_local_6.colorLayerCount, 1));
    }

    private _Str_16788(): IPartColor[]
    {
        const k: IPartColor[] = [];

        let _local_3 = 0;
        while (_local_3 < this._paletteIndexes.length)
        {
            const _local_2 = this._Str_13355(_local_3);

            if (_local_2)
            {
                k.push(_local_2._Str_3420);
            }
            else
            {
                k.push(null);
            }

            _local_3++;
        }

        return k;
    }

    public _Str_13355(k: number): AvatarEditorGridColorItem
    {
        const _local_2 = this._Str_783(k);

        if(!_local_2 || (_local_2.length <= this._paletteIndexes[k])) return null;

        return _local_2[this._paletteIndexes[k]];
    }

    public _Str_26437(k: number): number
    {
        const _local_2 = this._Str_13355(k);

        if(_local_2 && (_local_2._Str_3420)) return _local_2._Str_3420.id;

        return 0;
    }

    public get _Str_806(): AvatarEditorGridPartItem[]
    {
        return this._parts;
    }

    public _Str_783(k: number): AvatarEditorGridColorItem[]
    {
        if(!this._paletteIndexes || !this._palettes || (this._palettes.length <= k))
        {
            return null;
        }

        return this._palettes[k];
    }

    public _Str_6315(): AvatarEditorGridPartItem
    {
        return this._parts[this._selectedPartIndex] as AvatarEditorGridPartItem;
    }

    private _Str_19574(): void
    {
        const k = this._Str_16788();

        for(let _local_2 of this._parts)
        {
            if(_local_2) _local_2.colors = k;
        }
    }

    public _Str_23352(k: number): boolean
    {
        let _local_2 = false;

        const _local_3 = this._Str_16788();

        if (_local_3)
        {
            let _local_6 = 0;

            while (_local_6 < _local_3.length)
            {
                const _local_7 = _local_3[_local_6];
                
                if(_local_7 && (_local_7.clubLevel > k)) _local_2 = true;

                _local_6++;
            }
        }

        let _local_4 = false;
        var _local_5 = this._Str_6315();

        if(_local_5 && _local_5.partSet)
        {
            const _local_8 = _local_5.partSet;

            if(_local_8 && (_local_8.clubLevel > k))
            {
                _local_4 = true;
            }
        }

        return (_local_2) || (_local_4);
    }

    // public _Str_7960(k:IHabboInventory): boolean
    // {
    //     var _local_4:IFigurePartSet;
    //     var _local_2: boolean;
    //     var _local_3:AvatarEditorGridPartItem = this._Str_6315();
    //     if (((!(_local_3 == null)) && (_local_3.partSet)))
    //     {
    //         _local_4 = _local_3.partSet;
    //         if ((((!(_local_4 == null)) && (_local_4._Str_651)) && (!(k._Str_14439(_local_4.id)))))
    //         {
    //             _local_2 = true;
    //         }
    //     }
    //     return _local_2;
    // }

    public _Str_15298(k: number): boolean
    {
        const _local_2 = this._Str_6315();

        if (((_local_2) && (_local_2.partSet)))
        {
            const _local_3 = _local_2.partSet;

            if (_local_3.clubLevel > k)
            {
                const _local_4 = this._Str_8066(0);

                if(_local_4 && !_local_4.partSet) this._Str_8066(1);

                return true;
            }
        }

        return false;
    }

    public _Str_23810(k: number): boolean
    {
        let _local_2: number[]  = [];
        let _local_3            = this._Str_16788();
        let _local_4            = false;
        let _local_5            = this._Str_783(0);

        const _local_6 = CategoryData._Str_21219(_local_5, k);

        if(_local_6 === -1) return false;

        let _local_7 = 0;

        while(_local_7 < _local_3.length)
        {
            const _local_8 = _local_3[_local_7];

            if(!_local_8)
            {
                _local_2.push(_local_6);
                _local_4 = true;
            }
            else
            {
                if(_local_8.clubLevel > k)
                {
                    _local_2.push(_local_6);
                    _local_4 = true;
                }
                else
                {
                    _local_2.push(_local_8.id);
                }
            }

            _local_7++;
        }

        if(_local_4) this._Str_17669(_local_2);

        return _local_4;
    }

    // public _Str_8360(k:IHabboInventory): boolean
    // {
    //     var _local_3:IFigurePartSet;
    //     var _local_4:AvatarEditorGridPartItem;
    //     var _local_2:AvatarEditorGridPartItem = this._Str_6315();
    //     if (((_local_2) && (_local_2.partSet)))
    //     {
    //         _local_3 = _local_2.partSet;
    //         if (((_local_3._Str_651) && (!(k._Str_14439(_local_3.id)))))
    //         {
    //             _local_4 = this._Str_8066(0);
    //             if (((!(_local_4 == null)) && (_local_4.partSet == null)))
    //             {
    //                 this._Str_8066(1);
    //             }
    //             return true;
    //         }
    //     }
    //     return false;
    // }

    public get name(): string
    {
        return this._name;
    }

    public get _Str_22359(): number
    {
        return this._selectedPartIndex;
    }
}