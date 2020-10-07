import { RoomSpriteMouseEvent } from '../../../../../room/events/RoomSpriteMouseEvent';
import { RoomObjectUpdateMessage } from '../../../../../room/messages/RoomObjectUpdateMessage';
import { IRoomGeometry } from '../../../../../room/utils/IRoomGeometry';
import { Nitro } from '../../../../Nitro';
import { MouseEventType } from '../../../../ui/MouseEventType';
import { RoomObjectBadgeAssetEvent } from '../../../events/RoomObjectBadgeAssetEvent';
import { RoomObjectWidgetRequestEvent } from '../../../events/RoomObjectWidgetRequestEvent';
import { ObjectDataUpdateMessage } from '../../../messages/ObjectDataUpdateMessage';
import { ObjectGroupBadgeUpdateMessage } from '../../../messages/ObjectGroupBadgeUpdateMessage';
import { StringDataType } from '../../data/type/StringDataType';
import { RoomObjectVariable } from '../../RoomObjectVariable';
import { FurnitureLogic } from './FurnitureLogic';

export class FurnitureBadgeDisplayLogic extends FurnitureLogic
{
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

            return;
        }

        if(message instanceof ObjectGroupBadgeUpdateMessage)
        {
            if(message.assetName !== 'loading_icon')
            {
                this.object.model.setValue(RoomObjectVariable.FURNITURE_BADGE_ASSET_NAME, message.assetName);
                this.object.model.setValue(RoomObjectVariable.FURNITURE_BADGE_IMAGE_STATUS, 1);

                this.update(Nitro.instance.time);
            }

            return;
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
            default:
                super.mouseEvent(event, geometry);
                return;
        }
    }

    public useObject(): void
    {
        (this.object && this.eventDispatcher && this.eventDispatcher.dispatchEvent(new RoomObjectWidgetRequestEvent(RoomObjectWidgetRequestEvent.BADGE_DISPLAY_ENGRAVING, this.object)));
    }

    protected updateBadge(badgeId: string): void
    {
        if(badgeId === '') return;

        if(this.eventDispatcher) this.eventDispatcher.dispatchEvent(new RoomObjectBadgeAssetEvent(RoomObjectBadgeAssetEvent.LOAD_BADGE, this.object, badgeId, false));
    }
}