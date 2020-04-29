import { IAssetData } from '../../../../../core/asset/interfaces';
import { FurnitureMultiStateLogic } from './FurnitureMultiStateLogic';

export class FurnitureWindowLogic extends FurnitureMultiStateLogic
{
    public initialize(asset: IAssetData): void
    {
        super.initialize(asset);

        // var _local_2:XMLList = k.mask;
        // if (_local_2.length() > 0)
        // {
        //     _local_3 = _local_2[0];
        //     if (XMLValidator._Str_2747(_local_3, ["type"]))
        //     {
        //         _local_4 = _local_3.@type;
        //         object.getModelController().setNumber(RoomObjectVariableEnum.FURNITURE_USES_PLANE_MASK, 1, true);
        //         object.getModelController().setString(RoomObjectVariableEnum.FURNITURE_PLANE_MASK_TYPE, _local_4, true);
        //     }
        // }
    }
}