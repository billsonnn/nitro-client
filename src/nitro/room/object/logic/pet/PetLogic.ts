import { IAssetData } from '../../../../../core/asset/interfaces';
import { RoomObjectMouseEvent } from '../../../../../room/events/RoomObjectMouseEvent';
import { RoomObjectUpdateMessage } from '../../../../../room/messages/RoomObjectUpdateMessage';
import { RoomCollision } from '../../../../../room/renderer/RoomCollision';
import { PetFigureData } from '../../../../avatar/pets/PetFigureData';
import { ObjectAvatarChatUpdateMessage } from '../../../messages/ObjectAvatarChatUpdateMessage';
import { ObjectAvatarFigureUpdateMessage } from '../../../messages/ObjectAvatarFigureUpdateMessage';
import { ObjectAvatarPetGestureUpdateMessage } from '../../../messages/ObjectAvatarPetGestureUpdateMessage';
import { ObjectAvatarPostureUpdateMessage } from '../../../messages/ObjectAvatarPostureUpdateMessage';
import { ObjectAvatarSleepUpdateMessage } from '../../../messages/ObjectAvatarSleepUpdateMessage';
import { ObjectAvatarUpdateMessage } from '../../../messages/ObjectAvatarUpdateMessage';
import { RoomObjectModelKey } from '../../RoomObjectModelKey';
import { MovingObjectLogic } from '../MovingObjectLogic';

export class PetLogic extends MovingObjectLogic
{
    private _sizeX: number;
    private _sizeY: number;
    private _sizeZ: number;
    private _centerX: number;
    private _centerY: number;
    private _centerZ: number;

    private _directions: number[];

    private _talkingEndTimestamp: number;
    private _gestureEndTimestamp: number;
    private _expressionEndTimestamp: number;

    constructor()
    {
        super();

        this._sizeX                     = 0;
        this._sizeY                     = 0;
        this._sizeZ                     = 0;
        this._centerX                   = 0;
        this._centerY                   = 0;
        this._centerZ                   = 0;

        this._directions                = [];

        this._talkingEndTimestamp       = 0;
        this._gestureEndTimestamp       = 0;
        this._expressionEndTimestamp    = 0;
    }

    public initialize(asset: IAssetData): void
    {
        if(!asset) return;

        const model = this.object && this.object.model;

        if(!model) return;

        const dimensions = asset.dimensions;

        if(!dimensions) return;

        this._sizeX     = dimensions.x;
        this._sizeY     = dimensions.y;
        this._sizeZ     = dimensions.z;
        this._centerX   = (this._sizeX / 2);
        this._centerY   = (this._sizeY / 2);
        this._centerZ   = (this._sizeZ / 2);

        const directions = asset.directions;

        if(directions && directions.length)
        {
            for(let direction of directions) this._directions.push(direction);

            this._directions.sort((a, b) => { return a - b });
        }

        model.setValue(RoomObjectModelKey.FURNITURE_SIZE_X, this._sizeX);
        model.setValue(RoomObjectModelKey.FURNITURE_SIZE_Y, this._sizeY);
        model.setValue(RoomObjectModelKey.FURNITURE_SIZE_Z, this._sizeZ);
        model.setValue(RoomObjectModelKey.FURNITURE_CENTER_X, this._centerX);
        model.setValue(RoomObjectModelKey.FURNITURE_CENTER_Y, this._centerY);
        model.setValue(RoomObjectModelKey.FURNITURE_CENTER_Z, this._centerZ);
        model.setValue(RoomObjectModelKey.FURNITURE_ALLOWED_DIRECTIONS, this._directions);
        model.setValue(RoomObjectModelKey.FURNITURE_ALPHA_MULTIPLIER, 1);
    }

    public update(totalTimeRunning: number): void
    {
        super.update(totalTimeRunning);

        const model = this.object && this.object.model;

        if(!model) return;

        if((this._gestureEndTimestamp > 0) && (this.totalTimeRunning > this._gestureEndTimestamp))
        {
            model.setValue(RoomObjectModelKey.FIGURE_GESTURE, null);

            this._gestureEndTimestamp = 0;
        }

        if(this._talkingEndTimestamp > 0)
        {
            if(this.totalTimeRunning > this._talkingEndTimestamp)
            {
                model.setValue(RoomObjectModelKey.FIGURE_TALK, 0);

                this._talkingEndTimestamp = 0;
            }
        }

        if((this._expressionEndTimestamp > 0) && (this.totalTimeRunning > this._expressionEndTimestamp))
        {
            model.setValue(RoomObjectModelKey.FIGURE_EXPRESSION, 0);

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
            model.setValue(RoomObjectModelKey.HEAD_DIRECTION, message.headDirection);

            return;
        }

        if(message instanceof ObjectAvatarFigureUpdateMessage)
        {
            const petFigureData = new PetFigureData(message.figure);
            
            model.setValue(RoomObjectModelKey.FIGURE, message.figure);
            model.setValue(RoomObjectModelKey.RACE, message.race);
            model.setValue(RoomObjectModelKey.PET_PALETTE_INDEX, petFigureData.paletteId);
            model.setValue(RoomObjectModelKey.PET_COLOR, petFigureData.color);
            model.setValue(RoomObjectModelKey.PET_TYPE, petFigureData.typeId);
            model.setValue(RoomObjectModelKey.PET_IS_RIDING, message.isRiding ? 1 : 0);

            return;
        }

        if(message instanceof ObjectAvatarPostureUpdateMessage)
        {
            model.setValue(RoomObjectModelKey.FIGURE_POSTURE, message.postureType);

            return;
        }

        if(message instanceof ObjectAvatarChatUpdateMessage)
        {
            model.setValue(RoomObjectModelKey.FIGURE_TALK, 1);

            this._talkingEndTimestamp = this.totalTimeRunning + (message.numberOfWords * 1000);

            return;
        }

        if(message instanceof ObjectAvatarSleepUpdateMessage)
        {
            model.setValue(RoomObjectModelKey.FIGURE_SLEEP, message.isSleeping ? 1 : 0);

            return;
        }

        if(message instanceof ObjectAvatarPetGestureUpdateMessage)
        {
            model.setValue(RoomObjectModelKey.FIGURE_GESTURE, message.gesture);

            this._gestureEndTimestamp = this.totalTimeRunning + 3000;

            return;
        }
    }

    public mouseEvent(event: RoomObjectMouseEvent): void
    {
        if(event.collision instanceof RoomCollision)
        {
            switch(event.type)
            {
                case RoomObjectMouseEvent.MOUSE_MOVE:
                    document.body.style.cursor = 'pointer';
                    break;
                case RoomObjectMouseEvent.CLICK:
                    //Nitro.networkManager.processOutgoing(new UnitLookComposer(this.object.position));
                    break;
            }
        }
    }
}