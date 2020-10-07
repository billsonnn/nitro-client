import { IAssetData } from '../../../../../core/asset/interfaces';
import { RoomSpriteMouseEvent } from '../../../../../room/events/RoomSpriteMouseEvent';
import { RoomObjectUpdateMessage } from '../../../../../room/messages/RoomObjectUpdateMessage';
import { IRoomGeometry } from '../../../../../room/utils/IRoomGeometry';
import { MouseEventType } from '../../../../ui/MouseEventType';
import { RoomObjectFurnitureActionEvent } from '../../../events/RoomObjectFurnitureActionEvent';
import { RoomObjectWidgetRequestEvent } from '../../../events/RoomObjectWidgetRequestEvent';
import { ObjectItemDataUpdateMessage } from '../../../messages/ObjectItemDataUpdateMessage';
import { RoomObjectVariable } from '../../RoomObjectVariable';
import { FurnitureLogic } from './FurnitureLogic';

export class FurnitureStickieLogic extends FurnitureLogic
{
    private static STICKIE_COLORS: string[] = [ '9CCEFF', 'FF9CFF', '9CFF9C', 'FFFF33' ];

    public getEventTypes(): string[]
    {
        const types = [
            RoomObjectWidgetRequestEvent.STICKIE,
            RoomObjectFurnitureActionEvent.STICKIE
        ];

        return this.mergeTypes(super.getEventTypes(), types);
    }

    public initialize(asset: IAssetData): void
    {
        super.initialize(asset);

        this.updateColor();

        if(this.object) this.object.model.setValue(RoomObjectVariable.FURNITURE_IS_STICKIE, '');
    }

    public processUpdateMessage(message: RoomObjectUpdateMessage): void
    {
        super.processUpdateMessage(message);

        if(message instanceof ObjectItemDataUpdateMessage)
        {
            this.eventDispatcher && this.eventDispatcher.dispatchEvent(new RoomObjectWidgetRequestEvent(RoomObjectWidgetRequestEvent.STICKIE, this.object));
        }

        this.updateColor();
    }

    protected updateColor(): void
    {
        if(!this.object) return;

        const furnitureData = this.object.model.getValue<string>(RoomObjectVariable.FURNITURE_DATA);

        let colorIndex = FurnitureStickieLogic.STICKIE_COLORS.indexOf(furnitureData);

        if(colorIndex < 0) colorIndex = 3;

        this.object.model.setValue(RoomObjectVariable.FURNITURE_COLOR, (colorIndex + 1));
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
        }
    }

    public useObject(): void
    {
        (this.object && this.eventDispatcher && this.eventDispatcher.dispatchEvent(new RoomObjectWidgetRequestEvent(RoomObjectWidgetRequestEvent.STICKIE, this.object)));
    }
}