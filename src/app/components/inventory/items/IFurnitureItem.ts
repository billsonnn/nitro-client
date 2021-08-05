import { IObjectData } from '@nitrots/nitro-renderer/src/nitro/room/object/data/IObjectData';

export interface IFurnitureItem
{
    id: number;
    ref: number;
    type: number;
    stuffData: IObjectData;
    extra: number;
    category: number;
    _Str_16260: boolean;
    isTradable: boolean;
    isGroupable: boolean;
    sellable: boolean;
    locked: boolean;
    isWallItem: boolean;
}
