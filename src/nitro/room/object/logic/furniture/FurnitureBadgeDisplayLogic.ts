import { ObjectLogicType } from '../ObjectLogicType';
import { FurnitureLogic } from './FurnitureLogic';

export class FurnitureBadgeDisplayLogic extends FurnitureLogic
{
    public static TYPE: string = ObjectLogicType.FURNITURE_BADGE_DISPLAY;

    public onProcess(): void
    {
        const itemId = 0;

        //Nitro.networkManager.processOutgoing(new ItemMultiStateComposer(itemId));
    }
}