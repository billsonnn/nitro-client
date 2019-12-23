import { RoomObjectUpdateMessage } from '../../../../../room/messages/RoomObjectUpdateMessage';
import { ObjectDataUpdateMessage } from '../../../messages/ObjectDataUpdateMessage';
import { StringDataType } from '../../data/type/StringDataType';
import { RoomObjectModelKey } from '../../RoomObjectModelKey';
import { ObjectLogicType } from '../ObjectLogicType';
import { FurnitureLogic } from './FurnitureLogic';

export class FurnitureGuildCustomizedLogic extends FurnitureLogic
{
    public static TYPE: string = ObjectLogicType.FURNITURE_GUILD_CUSTOMIZED;

    public static GROUPID_KEY: number   = 1;
    public static BADGE_KEY: number     = 2;
    public static COLOR1_KEY: number    = 3;
    public static COLOR2_KEY: number    = 4;

    public processUpdateMessage(message: RoomObjectUpdateMessage): void
    {
        super.processUpdateMessage(message);

        if(message instanceof ObjectDataUpdateMessage)
        {
            if(message.data instanceof StringDataType)
            {
                this.updateGroupId(message.data.getValue(FurnitureGuildCustomizedLogic.GROUPID_KEY));
                this.updateBadge(message.data.getValue(FurnitureGuildCustomizedLogic.BADGE_KEY));
                this.updateColors(message.data.getValue(FurnitureGuildCustomizedLogic.COLOR1_KEY), message.data.getValue(FurnitureGuildCustomizedLogic.COLOR2_KEY))
            }
        }
    }

    private updateGroupId(id: string): void
    {
        this.object.model.setValue(RoomObjectModelKey.FURNITURE_GUILD_CUSTOMIZED_GUILD_ID, parseInt(id));
    }

    private updateBadge(badge: string): void
    {
        this.object.model.setValue(RoomObjectModelKey.FURNITURE_GUILD_CUSTOMIZED_BADGE, badge);
    }

    public updateColors(color1: string, color2: string): void
    {
        this.object.model.setValue(RoomObjectModelKey.FURNITURE_GUILD_CUSTOMIZED_COLOR_1, parseInt(color1, 16));
        this.object.model.setValue(RoomObjectModelKey.FURNITURE_GUILD_CUSTOMIZED_COLOR_2, parseInt(color2, 16));
    }
}