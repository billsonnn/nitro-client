import { RoomObjectUpdateMessage } from '../../../../room/messages/RoomObjectUpdateMessage';
import { IRoomObjectController } from '../../../../room/object/IRoomObjectController';
import { RoomObjectLogicBase } from '../../../../room/object/logic/RoomObjectLogicBase';
import { IVector3D } from '../../../../room/utils/IVector3D';
import { Vector3d } from '../../../../room/utils/Vector3d';
import { ObjectMoveUpdateMessage } from '../../messages/ObjectMoveUpdateMessage';
import { RoomObjectModelKey } from '../RoomObjectModelKey';

export class MovingObjectLogic extends RoomObjectLogicBase
{
    private static TEMP_VECTOR: Vector3d = new Vector3d();

    private _liftAmount: number;

    private _location: Vector3d;
    private _locationDelta: Vector3d;
    private _lastUpdateTime: number;
    private _changeTime: number;
    private _updateInterval: number;

    constructor()
    {
        super();

        this._liftAmount        = 0;

        this._location          = new Vector3d();
        this._locationDelta     = new Vector3d();
        this._lastUpdateTime    = 0;
        this._changeTime        = 0;
        this._updateInterval    = 500;
    }

    public dispose(): void
    {
        this._liftAmount = 0;
        
        super.dispose();
    }

    public update(totalTimeRunning: number): void
    {
        super.update(totalTimeRunning);

        totalTimeRunning = this.time;

        const locationOffset    = this.getLocationOffset();
        const model             = this.object && this.object.model;

        if(model)
        {
            if(locationOffset)
            {
                if(this._liftAmount !== locationOffset.z)
                {
                    this._liftAmount = locationOffset.z;
    
                    model.setValue(RoomObjectModelKey.FURNITURE_LIFT_AMOUNT, this._liftAmount);
                }
            }
            else
            {
                if(this._liftAmount !== 0)
                {
                    this._liftAmount = 0;
    
                    model.setValue(RoomObjectModelKey.FURNITURE_LIFT_AMOUNT, this._liftAmount);
                }
            }
        }

        if((this._locationDelta.length > 0) || locationOffset)
        {
            const vector = MovingObjectLogic.TEMP_VECTOR;

            let difference = (totalTimeRunning - this._changeTime);

            if(difference === (this._updateInterval >> 1)) difference++;

            if(difference > this._updateInterval) difference = this._updateInterval;

            if(this._locationDelta.length > 0)
            {
                vector.set(this._locationDelta);
                vector.multiply((difference / this._updateInterval));
                vector.add(this._location);
            }
            else
            {
                vector.set(this._location);
            }

            if(locationOffset)
            {
                vector.add(locationOffset);
            }

            this.object.setLocation(vector, false);

            if(difference === this._updateInterval)
            {
                this._locationDelta.x = 0;
                this._locationDelta.y = 0;
                this._locationDelta.z = 0;
            }
        }

        this._lastUpdateTime = totalTimeRunning;
    }

    public setObject(object: IRoomObjectController): void
    {
        super.setObject(object);

        if(object) this._location.set(object.getLocation());
    }

    public processUpdateMessage(message: RoomObjectUpdateMessage): void
    {
        if(!message) return;

        super.processUpdateMessage(message);

        if(message.location) this._location.set(message.location);

        if(message instanceof ObjectMoveUpdateMessage) return this.processMoveMessage(message);
    }

    private processMoveMessage(message: ObjectMoveUpdateMessage): void
    {
        if(!message || !this.object) return;

        this._changeTime = this._lastUpdateTime;

        this._locationDelta.set(message.targetLocation);
        this._locationDelta.subtract(this._location);
    }

    protected getLocationOffset(): IVector3D
    {
        return null;
    }
}