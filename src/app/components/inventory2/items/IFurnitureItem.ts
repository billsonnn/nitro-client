import { IObjectData } from '../../../../client/nitro/room/object/data/IObjectData';

export interface IFurnitureItem 
{
    id: number;
    ref: number;
    type: number;
    stuffData: IObjectData;
    _Str_2794: number;
    category: number;
    _Str_16260: boolean;
    _Str_8386: boolean;
    _Str_13551: boolean;
    sellable: boolean;
    locked: boolean;
    _Str_2770: boolean;
}