import { Disposable } from '../../core/common/disposable/Disposable';
import { IRoomInstance } from '../IRoomInstance';
import { RoomObjectUpdateMessage } from '../messages/RoomObjectUpdateMessage';
import { IVector3D } from '../utils/IVector3D';
import { Vector3d } from '../utils/Vector3d';
import { IRoomObjectController } from './IRoomObjectController';
import { IRoomObjectModel } from './IRoomObjectModel';
import { IRoomObjectEventHandler } from './logic/IRoomObjectEventHandler';
import { IRoomObjectMouseHandler } from './logic/IRoomObjectMouseHandler';
import { RoomObjectModel } from './RoomObjectModel';
import { IRoomObjectVisualization } from './visualization/IRoomObjectVisualization';

export class RoomObject extends Disposable implements IRoomObjectController
{
    private static OBJECT_COUNTER: number = 0;

    private _id: number;
    private _instanceId: number;
    private _type: string;
    private _category: number;
    private _model: IRoomObjectModel;
    private _room: IRoomInstance;

    private _state: number;
    private _location: IVector3D;
    private _direction: IVector3D;
    private _tempLocation: IVector3D;
    private _realLocation: IVector3D;

    private _visualization: IRoomObjectVisualization;
    private _logic: IRoomObjectEventHandler;
    private _pendingLogicMessages: RoomObjectUpdateMessage[];

    private _updateCounter: number;
    private _isReady: boolean;

    constructor(id: number, type: string)
    {
        super();
        
        this._id                    = id;
        this._instanceId            = RoomObject.OBJECT_COUNTER++;
        this._type                  = type;
        this._category              = -1;
        this._model                 = new RoomObjectModel();
        this._room                  = null;

        this._state                 = 0;
        this._location              = new Vector3d();
        this._direction             = new Vector3d();
        this._tempLocation          = null;
        this._realLocation          = new Vector3d();

        this._visualization         = null;
        this._logic                 = null;
        this._pendingLogicMessages  = [];
        
        this._updateCounter         = 0;
        this._isReady               = false;
    }

    protected onDispose(): void
    {
        this._pendingLogicMessages = [];

        this.setVisualization(null);
        this.setLogic(null);

        if(this._model) this._model.dispose();

        super.onDispose();
    }

    public getLocation(): IVector3D
    {
        if(this._tempLocation) return this._tempLocation;

        return this._location;
    }

    public getDirection(): IVector3D
    {
        return this._direction;
    }

    public setCategory(category: number): void
    {
        this._category = category;
    }

    public setRoom(room: IRoomInstance): void
    {
        if(this._room) return;

        this._room = room;
    }

    public setLocation(vector: IVector3D, real: boolean = true): void
    {
        if(!vector) return;

        if((vector.x === this._location.x) && (vector.y === this._location.y) && (vector.z === this._location.z)) return;

        this._location.x        = vector.x;
        this._location.y        = vector.y;
        this._location.z        = vector.z;
        this._tempLocation      = null;

        if(real) this._realLocation = vector;

        this._updateCounter++;
    }

    public setDirection(vector: IVector3D): void
    {
        if(!vector) return;

        if((vector.x === this._direction.x) && (vector.y === this._direction.y) && (vector.z === this._direction.z)) return;

        this._direction.x = (((vector.x % 360) + 360) % 360);
        this._direction.y = (((vector.y % 360) + 360) % 360);
        this._direction.z = (((vector.z % 360) + 360) % 360);

        this._updateCounter++;
    }

    public setTempLocation(vector: IVector3D, silent: boolean = false): void
    {
        if(!vector || Vector3d.isEqual(this._location, vector)) return;

        this._tempLocation = vector;

        if(!silent) this._updateCounter++;
    }

    public setState(state: number, silent: boolean = false): void
    {
        if(this._state === state) return;
        
        this._state = state;

        if(!silent) this._updateCounter++;
    }

    public setVisualization(visualization: IRoomObjectVisualization): void
    {
        if(this._visualization === visualization) return;

        if(this._visualization) this._visualization.dispose();

        this._visualization = visualization;

        if(this._visualization) this._visualization.object = this;
    }

    public setLogic(logic: IRoomObjectEventHandler): void
    {
        if(this._logic === logic) return;

        const eventHandler = this._logic;

        if(eventHandler)
        {
            this._logic = null;

            eventHandler.setObject(null);
        }

        this._logic = logic;

        if(this._logic)
        {
            this._logic.setObject(this);

            while(this._pendingLogicMessages.length)
            {
                const message = this._pendingLogicMessages.shift();

                this._logic.processUpdateMessage(message);
            }
        }
    }

    public processUpdateMessage(message: RoomObjectUpdateMessage): void
    {
        if(this._logic) return this._logic.processUpdateMessage(message);

        this._pendingLogicMessages.push(message);
    }

    public get id(): number
    {
        return this._id;
    }

    public get instanceId(): number
    {
        return this._instanceId;
    }

    public get type(): string
    {
        return this._type;
    }

    public get category(): number
    {
        return this._category;
    }

    public get model(): IRoomObjectModel
    {
        return this._model;
    }

    public get room(): IRoomInstance
    {
        return this._room;
    }

    public get visualization(): IRoomObjectVisualization
    {
        return this._visualization;
    }

    public get mouseHandler(): IRoomObjectMouseHandler
    {
        return this._logic as IRoomObjectMouseHandler;
    }

    public get logic(): IRoomObjectEventHandler
    {
        return this._logic;
    }

    public get location(): IVector3D
    {
        return this._location;
    }

    public get direction(): IVector3D
    {
        return this._direction;
    }

    public get tempLocation(): IVector3D
    {
        return this._tempLocation;
    }

    public get realLocation(): IVector3D
    {
        return this._realLocation;
    }

    public get state(): number
    {
        return this._state;
    }

    public get updateCounter(): number
    {
        return this._updateCounter;
    }

    public set updateCounter(count: number)
    {
        this._updateCounter = count;
    }

    public get isReady(): boolean
    {
        return this._isReady;
    }

    public set isReady(flag: boolean)
    {
        this._isReady = flag;
    }
}