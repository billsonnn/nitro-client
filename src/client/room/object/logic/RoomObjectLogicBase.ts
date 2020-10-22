import { Disposable } from '../../../core/common/disposable/Disposable';
import { IEventDispatcher } from '../../../core/events/IEventDispatcher';
import { RoomSpriteMouseEvent } from '../../events/RoomSpriteMouseEvent';
import { RoomObjectUpdateMessage } from '../../messages/RoomObjectUpdateMessage';
import { IRoomGeometry } from '../../utils/IRoomGeometry';
import { IRoomObjectController } from '../IRoomObjectController';
import { IRoomObjectEventHandler } from './IRoomObjectEventHandler';

export class RoomObjectLogicBase extends Disposable implements IRoomObjectEventHandler
{
    private _events: IEventDispatcher;
    private _object: IRoomObjectController;

    private _time: number;

    constructor()
    {
        super();

        this._object    = null;
        this._events    = null;

        this._time      = 0;
    }

    public initialize(data: any): void
    {
        return;
    }

    protected onDispose(): void
    {
        this._object = null;
    }

    public update(time: number): void
    {
        this._time = time;
        
        return;
    }

    public processUpdateMessage(message: RoomObjectUpdateMessage): void
    {
        if(!message || !this._object) return;
        
        this._object.setLocation(message.location);
        this._object.setDirection(message.direction);
    }

    public getEventTypes(): string[]
    {
        return [];
    }

    protected mergeTypes(k: string[], _arg_2: string[]): string[]
    {
        const types = k.concat();

        for(let type of _arg_2)
        {
            if(!type || (types.indexOf(type) >= 0)) continue;

            types.push(type);
        }

        return types;
    }

    public mouseEvent(event: RoomSpriteMouseEvent, geometry: IRoomGeometry)
    {
        return;
    }

    public useObject(): void
    {
        return;
    }

    public setObject(object: IRoomObjectController): void
    {
        if(this._object === object) return;

        if(this._object)
        {
            this._object.setLogic(null);
        }

        if(!object)
        {
            this.dispose();

            this._object = null;

            return;
        }

        this._object = object;
        this._object.setLogic(this);
    }

    public tearDown(): void
    {
        return;
    }
    
    public get object(): IRoomObjectController
    {
        return this._object;
    }

    public get eventDispatcher(): IEventDispatcher
    {
        return this._events;
    }

    public set eventDispatcher(events: IEventDispatcher)
    {
        this._events = events;
    }

    public get widget(): string
    {
        return null;
    }

    public get contextMenu(): string
    {
        return null;
    }

    public get time(): number
    {
        return this._time;
    }
}