import { IAssetData } from '../../../../../core/asset/interfaces';
import { RoomObjectMouseEvent } from '../../../../../room/events/RoomObjectMouseEvent';
import { RoomObjectUpdateMessage } from '../../../../../room/messages/RoomObjectUpdateMessage';
import { IRoomObjectModel } from '../../../../../room/object/IRoomObjectModel';
import { Direction } from '../../../../../room/utils/Direction';
import { Position } from '../../../../../room/utils/Position';
import { RoomObjectStateChangedEvent } from '../../../events/RoomObjectStateChangedEvent';
import { ObjectDataUpdateMessage } from '../../../messages/ObjectDataUpdateMessage';
import { ObjectMoveUpdateMessage } from '../../../messages/ObjectMoveUpdateMessage';
import { RoomObjectModelKey } from '../../RoomObjectModelKey';
import { MovingObjectLogic } from '../MovingObjectLogic';

export class FurnitureLogic extends MovingObjectLogic
{
    private static BOUNCING_STEPS: number   = 8;
    private static BOUNCING_Z: number       = 0.0625;

    private _sizeX: number;
    private _sizeY: number;
    private _sizeZ: number;

    private _centerX: number;
    private _centerY: number;
    private _centerZ: number;

    private _directions: number[];

    private _locationOffset: Position;
    private _bouncingStep: number;
    private _storedRotateMessage: ObjectMoveUpdateMessage;

    constructor()
    {
        super();

        this._sizeX                 = 0;
        this._sizeY                 = 0;
        this._sizeZ                 = 0;

        this._centerX               = 0;
        this._centerY               = 0;
        this._centerZ               = 0;

        this._directions            = [];

        this._locationOffset        = new Position();
        this._bouncingStep          = 0;
        this._storedRotateMessage   = null;
    }

    public initialize(asset: IAssetData): void
    {
        if(!asset) return;

        const model = this.object && this.object.model;

        if(!model) return;

        const dimensions = asset.dimensions;

        if(!dimensions) return;

        this._sizeX = dimensions.x;
        this._sizeY = dimensions.y;
        this._sizeZ = dimensions.z;
        
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

    protected getAdClickUrl(model: IRoomObjectModel): string
    {
        return model.getValue(RoomObjectModelKey.FURNITURE_AD_URL);
    }

    public update(totalTimeRunning: number): void
    {
        super.update(totalTimeRunning);

        if(this._bouncingStep > 0)
        {
            this._bouncingStep++;

            if(this._bouncingStep > FurnitureLogic.BOUNCING_STEPS) this._bouncingStep = 0;
        }
    }

    public processUpdateMessage(message: RoomObjectUpdateMessage): void
    {
        if(message instanceof ObjectDataUpdateMessage)
        {
            this.object.setState(message.state);
        
            if(message.data) message.data.writeRoomObjectModel(this.object.model);

            return;
        }

        else if(message instanceof ObjectMoveUpdateMessage)
        {
            const current  = this.object.position;
            const goal     = message.position;

            if(current && goal)
            {
                if(current.x === goal.x && current.y === goal.y && current.z === goal.z)
                {
                    if(current.direction !== goal.direction)
                    {
                        this._bouncingStep          = 1;
                        this._storedRotateMessage   = message;

                        return;
                    }
                }
            }
        }

        super.processUpdateMessage(message);
    }

    public mouseEvent(event: RoomObjectMouseEvent): void
    {
        switch(event.type)
        {
            case RoomObjectMouseEvent.DOUBLE_CLICK:
                this.useObject();
                break;
        }
    }

    public requestRotation(): void
    {
        const currentAngle = Direction.directionToAngle(this.object.position.direction);

        const index = this._directions.indexOf(currentAngle);

        if(index === -1) return;

        const nextIndex = index === (this._directions.length - 1) ? 0 : index + 1;

        const position = this.object.position.copy();

        position.direction = Direction.angleToDirection(this._directions[nextIndex]);

        if(position.direction === this.object.position.direction) return;

        //Nitro.networkManager.processOutgoing(new ItemFloorUpdateComposer(this.object.id, position));
    }

    public requestPickup(): void
    {
        //Nitro.networkManager.processOutgoing(new ItemPickupComposer(this.object.id));
    }

    protected getLocationOffset(): Position
    {
        if(this._bouncingStep <= 0)
        {
            this._locationOffset.z = 0;

            return null;
        }

        this._locationOffset.x  = 0;
        this._locationOffset.y  = 0;

        if(this._bouncingStep <= (FurnitureLogic.BOUNCING_STEPS / 2))
        {
            this._locationOffset.z = FurnitureLogic.BOUNCING_Z * this._bouncingStep;
        }
        else
        {
            if(this._bouncingStep <= FurnitureLogic.BOUNCING_STEPS)
            {
                if(this._storedRotateMessage)
                {
                    super.processUpdateMessage(this._storedRotateMessage);

                    this._storedRotateMessage = null;
                }

                this._locationOffset.z = FurnitureLogic.BOUNCING_Z * (FurnitureLogic.BOUNCING_STEPS - this._bouncingStep);
            }
        }

        return this._locationOffset;
    }

    public useObject(): void
    {
        if(!this.object) return;

        const adUrl = this.getAdClickUrl(this.object.model);

        if(this.eventHandler)
        {
            this.eventHandler.handleRoomObjectEvent(new RoomObjectStateChangedEvent(RoomObjectStateChangedEvent.STATE_CHANGE, this.object));
        }
    }
}