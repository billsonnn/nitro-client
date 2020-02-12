import * as PIXI from 'pixi.js-legacy';
import { IRoomGeometry } from '../utils/IRoomGeometry';
import { IRoomCanvasMouseListener } from './IRoomCanvasMouseListener';

export interface IRoomRenderingCanvas
{
    dispose(): void;
    initialize(width: number, height: number): void;
    render(time: number, update?: boolean): void;
    update(): void;
    setMouseListener(listener: IRoomCanvasMouseListener): void;
    _Str_21232(k: number, _arg_2: number, _arg_3: string, _arg_4: boolean, _arg_5: boolean, _arg_6: boolean, _arg_7: boolean): boolean;
    geometry: IRoomGeometry;
    displayObject: PIXI.DisplayObject;
    screenOffsetX: number;
    screenOffsetY: number;
}