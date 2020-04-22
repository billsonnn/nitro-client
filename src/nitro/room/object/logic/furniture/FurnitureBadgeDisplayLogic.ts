import { RoomSpriteMouseEvent } from '../../../../../room/events/RoomSpriteMouseEvent';
import { RoomObjectUpdateMessage } from '../../../../../room/messages/RoomObjectUpdateMessage';
import { IRoomGeometry } from '../../../../../room/utils/IRoomGeometry';
import { MouseEventType } from '../../../../ui/MouseEventType';
import { RoomObjectBadgeAssetEvent } from '../../../events/RoomObjectBadgeAssetEvent';
import { ObjectDataUpdateMessage } from '../../../messages/ObjectDataUpdateMessage';
import { StringDataType } from '../../data/type/StringDataType';
import { RoomObjectLogicType } from '../../RoomObjectLogicType';
import { FurnitureLogic } from './FurnitureLogic';

export class FurnitureBadgeDisplayLogic extends FurnitureLogic
{
    public static TYPE: string = RoomObjectLogicType.FURNITURE_BADGE_DISPLAY;

    public getEventTypes(): string[]
    {
        const types = [ RoomObjectBadgeAssetEvent.LOAD_BADGE ];

        return this.mergeTypes(super.getEventTypes(), types);
    }

    public processUpdateMessage(message: RoomObjectUpdateMessage): void
    {
        super.processUpdateMessage(message);

        if(!this.object) return;

        if(message instanceof ObjectDataUpdateMessage)
        {
            const data = message.data;

            if(data instanceof StringDataType) this.updateBadge(data.getValue(1));
        }
    }

    public mouseEvent(event: RoomSpriteMouseEvent, geometry: IRoomGeometry): void
    {
        if(!event || !geometry || !this.object) return;

        switch(event.type)
        {
            case MouseEventType.DOUBLE_CLICK:
                this.useObject();

                return;
        }

        super.mouseEvent(event, geometry);
    }

    public useObject(): void
    {
        if(!this.object) return;
    }

    protected updateBadge(badgeId: string): void
    {
        if(badgeId === '') return;

        if(this.eventDispatcher) this.eventDispatcher.dispatchEvent(new RoomObjectBadgeAssetEvent(RoomObjectBadgeAssetEvent.LOAD_BADGE, this.object, badgeId, false));
    }
}