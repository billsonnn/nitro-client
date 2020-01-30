import { IAssetData } from '../../../../../core/asset/interfaces';
import { Disposable } from '../../../../../core/common/disposable/Disposable';
import { IObjectVisualizationData } from '../../../../../room/object/visualization/IRoomObjectVisualizationData';
import { RoomModelParser } from '../../../../communication/messages/parser/room/mapping/RoomModelParser';

export class RoomVisualizationData extends Disposable implements IObjectVisualizationData
{
    private _modelParser: RoomModelParser;

    constructor()
    {
        super();

        this._modelParser = null;
    }

    public initialize(asset: IAssetData): boolean
    {
        //this._modelParser = parser;

        return true;
    }

    protected onDispose(): void
    {
        super.onDispose();
    }

    public get modelParser(): RoomModelParser
    {
        return this._modelParser;
    }

    public get saveable(): boolean
    {
        return false;
    }
}