import * as PIXI from 'pixi.js-legacy';
import { IVector3D } from './IVector3D';

export interface IRoomGeometry
{
    _Str_8614(_arg_1: IVector3D): IVector3D;
    _Str_3045(_arg_1: IVector3D): PIXI.Point;
    _Str_4202(_arg_1: IVector3D): IVector3D;
    _Str_21466(_arg_1: PIXI.Point, _arg_2: IVector3D, _arg_3: IVector3D, _arg_4: IVector3D): PIXI.Point;
    _Str_19274(_arg_1: IVector3D, _arg_2: IVector3D): void;
    _Str_9651(_arg_1: IVector3D, _arg_2: number): void;
    _Str_19206(): void;
    _Str_18667(): void;
    _Str_17302(): void;
    _Str_8719(): boolean;
    _Str_3795: number;
    _Str_17100: number;
    scale: number;
    _Str_14167: IVector3D;
    direction: IVector3D;
}