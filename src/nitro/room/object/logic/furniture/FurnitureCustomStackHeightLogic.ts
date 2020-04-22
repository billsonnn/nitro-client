import { IAssetData } from '../../../../../core/asset/interfaces';
import { RoomObjectLogicType } from '../../RoomObjectLogicType';
import { RoomObjectVariable } from '../../RoomObjectVariable';
import { FurnitureLogic } from './FurnitureLogic';

export class FurnitureCustomStackHeightLogic extends FurnitureLogic
{
    public static TYPE: string = RoomObjectLogicType.FURNITURE_CUSTOM_STACK_HEIGHT;

    public initialize(asset: IAssetData)
    {
        super.initialize(asset);

        if(this.object && this.object.model) this.object.model.setValue(RoomObjectVariable.FURNITURE_ALWAYS_STACKABLE, 1);
    }
}