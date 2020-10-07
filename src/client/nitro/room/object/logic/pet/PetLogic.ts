import { IAssetData } from '../../../../../core/asset/interfaces';
import { RoomObjectMouseEvent } from '../../../../../room/events/RoomObjectMouseEvent';
import { RoomSpriteMouseEvent } from '../../../../../room/events/RoomSpriteMouseEvent';
import { RoomObjectUpdateMessage } from '../../../../../room/messages/RoomObjectUpdateMessage';
import { IRoomObjectModel } from '../../../../../room/object/IRoomObjectModel';
import { IRoomGeometry } from '../../../../../room/utils/IRoomGeometry';
import { Vector3d } from '../../../../../room/utils/Vector3d';
import { PetFigureData } from '../../../../avatar/pets/PetFigureData';
import { PetType } from '../../../../avatar/pets/PetType';
import { MouseEventType } from '../../../../ui/MouseEventType';
import { RoomObjectMoveEvent } from '../../../events/RoomObjectMoveEvent';
import { ObjectAvatarChatUpdateMessage } from '../../../messages/ObjectAvatarChatUpdateMessage';
import { ObjectAvatarFigureUpdateMessage } from '../../../messages/ObjectAvatarFigureUpdateMessage';
import { ObjectAvatarPetGestureUpdateMessage } from '../../../messages/ObjectAvatarPetGestureUpdateMessage';
import { ObjectAvatarPostureUpdateMessage } from '../../../messages/ObjectAvatarPostureUpdateMessage';
import { ObjectAvatarSelectedMessage } from '../../../messages/ObjectAvatarSelectedMessage';
import { ObjectAvatarSleepUpdateMessage } from '../../../messages/ObjectAvatarSleepUpdateMessage';
import { ObjectAvatarUpdateMessage } from '../../../messages/ObjectAvatarUpdateMessage';
import { RoomObjectVariable } from '../../RoomObjectVariable';
import { MovingObjectLogic } from '../MovingObjectLogic';

export class PetLogic extends MovingObjectLogic
{
    private _selected: boolean;
    private _reportedLocation: Vector3d;
    private _postureIndex: number;
    private _gestureIndex: number;
    private _headDirectionDelta: number;
    private _directions: number[];

    private _talkingEndTimestamp: number;
    private _gestureEndTimestamp: number;
    private _expressionEndTimestamp: number;

    constructor()
    {
        super();

        this._selected                  = false;
        this._reportedLocation          = null;
        this._postureIndex              = 0;
        this._gestureIndex              = 0;
        this._headDirectionDelta        = 0;
        this._directions                = [];

        this._talkingEndTimestamp       = 0;
        this._gestureEndTimestamp       = 0;
        this._expressionEndTimestamp    = 0;
    }

    public getEventTypes(): string[]
    {
        const types = [ RoomObjectMouseEvent.CLICK, RoomObjectMoveEvent.POSITION_CHANGED ];

        return this.mergeTypes(super.getEventTypes(), types);
    }

    public initialize(asset: IAssetData): void
    {
        if(!asset) return;

        const model = this.object && this.object.model;

        if(!model) return;

        const directions = asset.directions;

        if(directions && directions.length)
        {
            for(let direction of directions) this._directions.push(direction);

            this._directions.sort((a, b) => { return a - b });
        }

        model.setValue(RoomObjectVariable.PET_ALLOWED_DIRECTIONS, this._directions);
    }

    public dispose(): void
    {
        if(this._selected && this.object)
        {
            if(this.eventDispatcher) this.eventDispatcher.dispatchEvent(new RoomObjectMoveEvent(RoomObjectMoveEvent.OBJECT_REMOVED, this.object));
        }

        this._directions        = null;
        this._reportedLocation  = null;
    }

    public update(totalTimeRunning: number): void
    {
        super.update(totalTimeRunning);

        if(this._selected && this.object)
        {
            if(this.eventDispatcher)
            {
                const location = this.object.getLocation();

                if(((!this._reportedLocation || (this._reportedLocation.x !== location.x)) || (this._reportedLocation.y !== location.y)) || (this._reportedLocation.z !== location.z))
                {
                    if(!this._reportedLocation) this._reportedLocation = new Vector3d();

                    this._reportedLocation.assign(location);

                    this.eventDispatcher.dispatchEvent(new RoomObjectMoveEvent(RoomObjectMoveEvent.POSITION_CHANGED, this.object));
                }
            }
        }

        if(this.object && this.object.model) this.updateModel(totalTimeRunning, this.object.model);
    }

    private updateModel(time: number, model: IRoomObjectModel): void
    {
        if((this._gestureEndTimestamp > 0) && (time > this._gestureEndTimestamp))
        {
            model.setValue(RoomObjectVariable.FIGURE_GESTURE, null);

            this._gestureEndTimestamp = 0;
        }

        if(this._talkingEndTimestamp > 0)
        {
            if(time > this._talkingEndTimestamp)
            {
                model.setValue(RoomObjectVariable.FIGURE_TALK, 0);

                this._talkingEndTimestamp = 0;
            }
        }

        if((this._expressionEndTimestamp > 0) && (time > this._expressionEndTimestamp))
        {
            model.setValue(RoomObjectVariable.FIGURE_EXPRESSION, 0);

            this._expressionEndTimestamp = 0;
        }
    }

    public processUpdateMessage(message: RoomObjectUpdateMessage): void
    {
        if(!message || !this.object) return;

        super.processUpdateMessage(message);

        const model = this.object && this.object.model;

        if(!model) return;

        if(message instanceof ObjectAvatarUpdateMessage)
        {
            model.setValue(RoomObjectVariable.HEAD_DIRECTION, message.headDirection);

            return;
        }

        if(message instanceof ObjectAvatarFigureUpdateMessage)
        {
            const petFigureData = new PetFigureData(message.figure);
            
            model.setValue(RoomObjectVariable.FIGURE, message.figure);
            model.setValue(RoomObjectVariable.RACE, message.subType);
            model.setValue(RoomObjectVariable.PET_PALETTE_INDEX, petFigureData.paletteId);
            model.setValue(RoomObjectVariable.PET_COLOR, petFigureData.color);
            model.setValue(RoomObjectVariable.PET_TYPE, petFigureData.typeId);
            model.setValue(RoomObjectVariable.PET_CUSTOM_LAYER_IDS, petFigureData.customLayerIds);
            model.setValue(RoomObjectVariable.PET_CUSTOM_PARTS_IDS, petFigureData.customPartIds);
            model.setValue(RoomObjectVariable.PET_CUSTOM_PALETTE_IDS, petFigureData.customPaletteIds);
            model.setValue(RoomObjectVariable.PET_IS_RIDING, (message.isRiding ? 1 : 0));

            return;
        }

        if(message instanceof ObjectAvatarPostureUpdateMessage)
        {
            model.setValue(RoomObjectVariable.FIGURE_POSTURE, message.postureType);

            return;
        }

        if(message instanceof ObjectAvatarChatUpdateMessage)
        {
            model.setValue(RoomObjectVariable.FIGURE_TALK, 1);

            this._talkingEndTimestamp = this.time + (message.numberOfWords * 1000);

            return;
        }

        if(message instanceof ObjectAvatarSleepUpdateMessage)
        {
            model.setValue(RoomObjectVariable.FIGURE_SLEEP, message.isSleeping ? 1 : 0);

            return;
        }

        if(message instanceof ObjectAvatarPetGestureUpdateMessage)
        {
            model.setValue(RoomObjectVariable.FIGURE_GESTURE, message.gesture);

            this._gestureEndTimestamp = this.time + 3000;

            return;
        }

        if(message instanceof ObjectAvatarSelectedMessage)
        {
            this._selected          = message.selected;
            this._reportedLocation  = null;

            return;
        }
    }

    public mouseEvent(event: RoomSpriteMouseEvent, geometry: IRoomGeometry): void
    {
        let eventType: string = null;

        switch(event.type)
        {
            case MouseEventType.MOUSE_CLICK:
                eventType = RoomObjectMouseEvent.CLICK;
                break;
            case MouseEventType.DOUBLE_CLICK:
                break;
            case MouseEventType.MOUSE_DOWN:
                const petType = this.object.model.getValue<number>(RoomObjectVariable.PET_TYPE);

                if(petType == PetType.MONSTERPLANT)
                {
                    if(this.eventDispatcher) this.eventDispatcher.dispatchEvent(new RoomObjectMouseEvent(RoomObjectMouseEvent.MOUSE_DOWN, this.object, event._Str_3463, event.altKey, event.ctrlKey, event.shiftKey, event.buttonDown));
                }
                break;
        }

        if(eventType && this.eventDispatcher) this.eventDispatcher.dispatchEvent(new RoomObjectMouseEvent(eventType, this.object, event._Str_3463, event.altKey, event.ctrlKey, event.shiftKey, event.buttonDown));
    }
}