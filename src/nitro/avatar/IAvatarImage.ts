import { IDisposable } from '../../core/common/disposable/IDisposable';
import { IGraphicAsset } from '../../room/object/visualization/utils/IGraphicAsset';
import { IAnimationLayerData } from './animation/IAnimationLayerData';
import { IAvatarDataContainer } from './animation/IAvatarDataContainer';
import { ISpriteDataContainer } from './animation/ISpriteDataContainer';
import { IAvatarFigureContainer } from './IAvatarFigureContainer';
import { IPartColor } from './structure/figure/IPartColor';

export interface IAvatarImage extends IDisposable
{
    _Str_1009(): any;
    setDirection(_arg_1: string, _arg_2: number): void;
    _Str_880(_arg_1: string, _arg_2: number): void;
    _Str_953(_arg_1?: number): void;
    _Str_797(): string;
    _Str_754(): ISpriteDataContainer[];
    _Str_607(_arg_1: ISpriteDataContainer): IAnimationLayerData;
    getImage(setType: string, hightlight: boolean, _arg_3?: number): PIXI.Texture;
    getCroppedImage(setType: string, scale: number): PIXI.Texture;
    getAsset(_arg_1: string): IGraphicAsset;
    getDirection(): number;
    _Str_784(): IAvatarFigureContainer;
    _Str_867(_arg_1: string): IPartColor;
    _Str_899(): boolean;
    _Str_781(): number[];
    _Str_913(): void;
    _Str_962(): void;
    appendAction(_arg_1: string, ..._args: any[]): boolean;
    _Str_920: IAvatarDataContainer;
    isPlaceholder(): boolean;
    _Str_998(): void;
    _Str_677: boolean;
    _Str_833(): void;
    _Str_792: string;
}