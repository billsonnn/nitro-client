import { RoomObjectEvent } from '../../../../../room/events/RoomObjectEvent';
import { RoomSpriteMouseEvent } from '../../../../../room/events/RoomSpriteMouseEvent';
import { IRoomGeometry } from '../../../../../room/utils/IRoomGeometry';
import { MouseEventType } from '../../../../ui/MouseEventType';
import { RoomObjectFurnitureActionEvent } from '../../../events/RoomObjectFurnitureActionEvent';
import { ObjectLogicType } from '../ObjectLogicType';
import { FurnitureLogic } from './FurnitureLogic';

export class FurnitureDiceLogic extends FurnitureLogic
{
    public static TYPE: string = ObjectLogicType.FURNITURE_DICE;

    private _noTags: boolean;
    private _noTagsLastStateActive: boolean;

    constructor()
    {
        super();

        this._noTags                = false;
        this._noTagsLastStateActive = false;
    }

    public getEventTypes(): string[]
    {
        const types = [ RoomObjectFurnitureActionEvent.DICE_ACTIVATE, RoomObjectFurnitureActionEvent.DICE_OFF ];

        return this.mergeTypes(super.getEventTypes(), types);
    }

    public mouseEvent(event: RoomSpriteMouseEvent, geometry: IRoomGeometry): void
    {
        if(!event || !geometry || !this.object) return;
        
        let objectEvent: RoomObjectEvent = null;

        switch(event.type)
        {
            case MouseEventType.DOUBLE_CLICK:
                if(this._noTags)
                {
                    if(!this._noTagsLastStateActive || (this.object.state === 0) || (this.object.state === 100))
                    {
                        objectEvent = new RoomObjectFurnitureActionEvent(RoomObjectFurnitureActionEvent.DICE_ACTIVATE, this.object);

                        this._noTagsLastStateActive = true;
                    }
                    else
                    {
                        objectEvent = new RoomObjectFurnitureActionEvent(RoomObjectFurnitureActionEvent.DICE_OFF, this.object);

                        this._noTagsLastStateActive = false;
                    }
                }
                else
                {
                    if((event._Str_4216 === 'activate') || (this.object.state === 0) || (this.object.state === 100))
                    {
                        objectEvent = new RoomObjectFurnitureActionEvent(RoomObjectFurnitureActionEvent.DICE_ACTIVATE, this.object);
                    }
                    
                    else if(event._Str_4216 === 'deactivate')
                    {
                        objectEvent = new RoomObjectFurnitureActionEvent(RoomObjectFurnitureActionEvent.DICE_OFF, this.object);
                    }
                }

                if(objectEvent && this.eventDispatcher) this.eventDispatcher.dispatchEvent(objectEvent);

                return;
        }

        super.mouseEvent(event, geometry);
    }
}