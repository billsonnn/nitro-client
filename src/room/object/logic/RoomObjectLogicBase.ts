import { IAssetData } from '../../../core/asset/interfaces/IAssetData';
import { Disposable } from '../../../core/common/disposable/Disposable';
import { NitroInstance } from '../../../nitro/NitroInstance';
import { RoomObjectEventHandler } from '../../../nitro/room/RoomObjectEventHandler';
import { RoomObjectMouseEvent } from '../../events/RoomObjectMouseEvent';
import { RoomObjectUpdateMessage } from '../../messages/RoomObjectUpdateMessage';
import { IRoomObjectController } from '../IRoomObjectController';
import { IRoomObjectLogic } from './IRoomObjectLogic';

export class RoomObjectLogicBase extends Disposable implements IRoomObjectLogic
{
    private _object: IRoomObjectController;
    private _eventHandler: RoomObjectEventHandler;

    private _totalTimeRunning: number;

    constructor()
    {
        super();

        this._object            = null;
        this._eventHandler      = null;

        this._totalTimeRunning  = 0;
    }

    public initialize(asset: IAssetData): void
    {
        return;
    }

    protected onDispose(): void
    {
        this._object = null;
    }

    public update(totalTimeRunning: number): void
    {
        this._totalTimeRunning = totalTimeRunning;
        
        return;
    }

    public processUpdateMessage(message: RoomObjectUpdateMessage): void
    {
        if(!message || !this._object) return;

        if(message.position) this._object.setPosition(message.position);
    }

    public mouseEvent(event: RoomObjectMouseEvent): void
    {
        return;
    }

    public useObject(): void
    {
        return;
    }

    public setObject(object: IRoomObjectController): void
    {
        this._object = object;
    }

    public setEventHandler(eventHandler: RoomObjectEventHandler): void
    {
        this._eventHandler = eventHandler;
    }

    public get object(): IRoomObjectController
    {
        return this._object;
    }

    public get eventHandler(): RoomObjectEventHandler
    {
        return this._eventHandler;
    }

    public get totalTimeRunning(): number
    {
        return NitroInstance.instance.renderer.totalTimeRunning;
    }
}