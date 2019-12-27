import { Disposable } from '../../../../../core/common/disposable/Disposable';
import { IObjectVisualizationData } from '../../../../../room/object/visualization/IRoomObjectVisualizationData';
import { RoomModelParser } from '../../../../communication/messages/parser/room/mapping/RoomModelParser';

export class RoomVisualizationData extends Disposable implements IObjectVisualizationData
{
    private _width: number;
    private _height: number;
    private _heightMap: number[][];

    constructor()
    {
        super();

        this._width     = 0;
        this._height    = 0;
        this._heightMap = [];
    }

    public initialize(parser: RoomModelParser): boolean
    {
        this._width     = parser.width;
        this._height    = parser.height;
        this._heightMap = parser.heightMap;

        return true;
    }

    protected onDispose(): void
    {
        super.onDispose();
    }

    public get width(): number
    {
        return this._width;
    }

    public get height(): number
    {
        return this._height;
    }

    public get heightMap(): number[][]
    {
        return this._heightMap;
    }
}