import { IAssetData } from '../../../../../core/asset/interfaces';
import { Disposable } from '../../../../../core/common/disposable/Disposable';
import { IObjectVisualizationData } from '../../../../../room/object/visualization/IRoomObjectVisualizationData';

export class RoomVisualizationData extends Disposable implements IObjectVisualizationData
{
    constructor()
    {
        super();
    }

    public initialize(asset: IAssetData): boolean
    {
        return true;
    }

    protected onDispose(): void
    {
        super.onDispose();
    }
}