import { RoomObjectLogicType } from '../../RoomObjectLogicType';
import { FurnitureLogic } from './FurnitureLogic';

export class FurnitureBadgeDisplayLogic extends FurnitureLogic
{
    public static TYPE: string = RoomObjectLogicType.FURNITURE_BADGE_DISPLAY;

    public onProcess(): void
    {
        const itemId = 0;

        //Nitro.networkManager.processOutgoing(new ItemMultiStateComposer(itemId));
    }
}