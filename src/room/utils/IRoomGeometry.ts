import * as PIXI from 'pixi.js-legacy';
import { IVector3D } from './IVector3D';

export interface IRoomGeometry
{
    getCoordinatePosition(_arg_1: IVector3D): IVector3D;
    getScreenPoint(_arg_1: IVector3D): PIXI.Point;
    getScreenPosition(_arg_1: IVector3D): IVector3D;
    getPlanePosition(_arg_1: PIXI.Point, _arg_2: IVector3D, _arg_3: IVector3D, _arg_4: IVector3D): PIXI.Point;
    setDisplacement(_arg_1: IVector3D, _arg_2: IVector3D): void;
    adjustLocation(_arg_1: IVector3D, _arg_2: number): void;
    performZoom(): void;
    performZoomOut(): void;
    performZoomIn(): void;
    isZoomedIn(): boolean;
    updateId: number;
    z_scale: number;
    scale: number;
    directionAxis: IVector3D;
    direction: IVector3D;
}