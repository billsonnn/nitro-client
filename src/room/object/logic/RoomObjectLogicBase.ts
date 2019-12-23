import { IAssetData } from '../../../core/asset/interfaces/IAssetData';
import { Disposable } from '../../../core/common/disposable/Disposable';
import { RoomObjectMouseEvent } from '../../events/RoomObjectMouseEvent';
import { RoomObjectUpdateMessage } from '../../messages/RoomObjectUpdateMessage';
import { IRoomObjectController } from '../IRoomObjectController';
import { IRoomObjectLogic } from './IRoomObjectLogic';

export class RoomObjectLogicBase extends Disposable implements IRoomObjectLogic
{
    private _object: IRoomObjectController;
    private _totalTimeRunning: number;

    constructor()
    {
        super();

        this._object            = null;
        this._totalTimeRunning  = 0;
    }

    public initialize(asset: IAssetData): void
    {
        return;
    }

    protected onDispose(): void
    {
        this._object            = null;
        this._totalTimeRunning  = 0;
    }

    public update(delta: number): void
    {
        this._totalTimeRunning += delta;

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

    public setObject(object: IRoomObjectController)
    {
        this._object = object;
    }

    public get object(): IRoomObjectController
    {
        return this._object;
    }

    protected get totalTimeRunning(): number
    {
        return this._totalTimeRunning;
    }
}