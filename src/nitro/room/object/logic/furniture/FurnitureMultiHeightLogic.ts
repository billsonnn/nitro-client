import { IAssetData } from '../../../../../core/asset/interfaces';
import { RoomObjectLogicType } from '../../RoomObjectLogicType';
import { RoomObjectVariable } from '../../RoomObjectVariable';
import { FurnitureMultiStateLogic } from './FurnitureMultiStateLogic';

export class FurnitureMultiHeightLogic extends FurnitureMultiStateLogic
{
    public static TYPE: string = RoomObjectLogicType.FURNITURE_MULTIHEIGHT;

    public initialize(asset: IAssetData): void
    {
        super.initialize(asset);

        if(this.object && this.object.model) this.object.model.setValue(RoomObjectVariable.FURNITURE_IS_VARIABLE_HEIGHT, 1);
    }
}