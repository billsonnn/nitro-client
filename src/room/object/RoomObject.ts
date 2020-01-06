import { Disposable } from '../../core/common/disposable/Disposable';
import { IRoomInstance } from '../IRoomInstance';
import { RoomObjectUpdateMessage } from '../messages/RoomObjectUpdateMessage';
import { Position } from '../utils/Position';
import { IRoomObjectController } from './IRoomObjectController';
import { IRoomObjectModel } from './IRoomObjectModel';
import { IRoomObjectLogic } from './logic/IRoomObjectLogic';
import { RoomObjectModel } from './RoomObjectModel';
import { IRoomObjectSpriteVisualization } from './visualization/IRoomObjectSpriteVisualization';

export class RoomObject extends Disposable implements IRoomObjectController
{
    private static OBJECT_COUNTER: number = 0;

    private _id: number;
    private _instanceId: number;
    private _type: string;
    private _category: number;
    private _model: IRoomObjectModel;
    private _room: IRoomInstance;

    private _visualization: IRoomObjectSpriteVisualization;
    private _logic: IRoomObjectLogic;
    private _pendingLogicMessages: RoomObjectUpdateMessage[];

    private _position: Position;
    private _realPosition: Position;
    private _tempPosition: Position;
    private _state: number;
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

        this._visualization         = null;
        this._logic                 = null;
        this._pendingLogicMessages  = [];

        this._position              = new Position();
        this._realPosition          = new Position();
        this._tempPosition          = null;
        this._state                 = 0;
        this._updateCounter         = 0;

        this._isReady               = false;
    }

    protected onDispose(): void
    {
        if(this._model) this._model.dispose();
        
        if(this._visualization) this._visualization.dispose();

        if(this._logic) this._logic.dispose();

        this._pendingLogicMessages = [];

        super.onDispose();
    }

    public getScreenPosition(): Position
    {
        if(this._tempPosition) return this._tempPosition;

        if(this._position.isScreen) return this._position;

        const screenPosition = this._position.toScreenPosition();

        let additionalHeight = 0;

        // if(RoomObjectType.AVATAR_TYPES.indexOf(this._type) >= 0)
        // {
        //     if(this._type !== RoomObjectType.PET) screenPosition.x -= GameConfiguration.TILE_WIDTH;

        //     const map = this.room.mapManager && this.room.mapManager.map;

        //     if(map)
        //     {
        //         const tile = map.getTile(this._position);

        //         if(tile && (tile.type === RoomTileType.STAIR_LEFT || tile.type === RoomTileType.STAIR_RIGHT)) additionalHeight -= GameConfiguration.TILE_HEIGHT;
        //     }
        // }

        screenPosition.y += additionalHeight;

        return screenPosition;
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

    public setPosition(position: Position, real: boolean = true): void
    {
        if(!position) return;

        if(real) this._realPosition = position;

        if(this._position.compareStrict(position))
        {
            this._tempPosition = null;

            return;
        }

        this._position.x            = position.x;
        this._position.y            = position.y;
        this._position.z            = position.z;
        this._position.direction    = position.direction;
        this._position.depth        = position.calculatedDepth;

        this._tempPosition = null;

        this._updateCounter++;
    }

    public setTempPosition(position: Position, silent: boolean = false): void
    {
        if(!position)
        {
            this._tempPosition = null;

            if(!silent) this._updateCounter++;

            return;
        }
        
        if(!position.isScreen) position = position.toScreenPosition();
        
        if(this._tempPosition && this._tempPosition.compareStrict(position)) return;

        this._tempPosition = position;

        if(!silent) this._updateCounter++;
    }

    public setState(state: number, silent: boolean = false): void
    {
        if(this._state === state) return;
        
        this._state = state;

        if(!silent) this._updateCounter++;
    }

    public setVisualization(visualization: IRoomObjectSpriteVisualization): void
    {
        if(!visualization) return;

        visualization.setObject(this);

        this._visualization = visualization;
    }

    public setLogic(logic: IRoomObjectLogic): void
    {
        if(!logic) return;

        logic.setObject(this);

        this._logic = logic;

        while(this._pendingLogicMessages.length)
        {
            const message = this._pendingLogicMessages.shift();

            this._logic.processUpdateMessage(message);
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

    public get visualization(): IRoomObjectSpriteVisualization
    {
        return this._visualization;
    }

    public get logic(): IRoomObjectLogic
    {
        return this._logic;
    }

    public get position(): Position
    {
        return this._position;
    }

    public get realPosition(): Position
    {
        return this._realPosition;
    }

    public get tempPosition(): Position
    {
        return this._tempPosition;
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