import { IAssetData } from '../../../../../core/asset/interfaces';
import { RoomObjectMouseEvent } from '../../../../../room/events/RoomObjectMouseEvent';
import { RoomObjectUpdateMessage } from '../../../../../room/messages/RoomObjectUpdateMessage';
import { IRoomObjectController } from '../../../../../room/object/IRoomObjectController';
import { IRoomObjectModel } from '../../../../../room/object/IRoomObjectModel';
import { IVector3D } from '../../../../../room/utils/IVector3D';
import { Vector3d } from '../../../../../room/utils/Vector3d';
import { RoomObjectStateChangedEvent } from '../../../events/RoomObjectStateChangedEvent';
import { ObjectDataUpdateMessage } from '../../../messages/ObjectDataUpdateMessage';
import { ObjectMoveUpdateMessage } from '../../../messages/ObjectMoveUpdateMessage';
import { RoomObjectModelKey } from '../../RoomObjectModelKey';
import { MovingObjectLogic } from '../MovingObjectLogic';

export class FurnitureLogic extends MovingObjectLogic
{
    private static BOUNCING_STEPS: number   = 8;
    private static BOUNCING_Z: number       = 0.03125;

    private _sizeX: number;
    private _sizeY: number;
    private _sizeZ: number;
    private _centerX: number;
    private _centerY: number;
    private _centerZ: number;

    private _directions: number[];

    private _locationOffset: IVector3D;
    private _bouncingStep: number;
    private _storedRotateMessage: RoomObjectUpdateMessage;
    private _directionInitialized: boolean;

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

        this._locationOffset        = new Vector3d();
        this._bouncingStep          = 0;
        this._storedRotateMessage   = null;
        this._directionInitialized  = false;
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

    public setObject(object: IRoomObjectController): void
    {
        super.setObject(object);

        if(object && object.location && object.location.length > 0) this._directionInitialized = true;
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

        if(message.location && message.direction)
        {
            if(!(message instanceof ObjectMoveUpdateMessage))
            {
                const direction = this.object.getDirection();
                const location  = this.object.getLocation();

                if((direction.x !== message.direction.x) && this._directionInitialized)
                {
                    if((location.x === message.location.x) && (location.y === message.location.y) && (location.z === message.location.z))
                    {
                        this._bouncingStep          = 1;
                        this._storedRotateMessage   = new RoomObjectUpdateMessage(message.location, message.direction);

                        message = null;
                    }
                }
            }

            this._directionInitialized = true;
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

    protected getLocationOffset(): IVector3D
    {
        if(this._bouncingStep <= 0) return null;

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