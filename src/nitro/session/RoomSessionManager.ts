import { NitroManager } from '../../core/common/NitroManager';
import { INitroCommunicationManager } from '../communication/INitroCommunicationManager';
import { IRoomEngine } from '../room/IRoomEngine';
import { BaseHandler } from './handler/BaseHandler';
import { RoomSessionHandler } from './handler/RoomSessionHandler';
import { IRoomHandlerListener } from './IRoomHandlerListener';
import { IRoomSession } from './IRoomSession';
import { IRoomSessionManager } from './IRoomSessionManager';

export class RoomSessionManager extends NitroManager implements IRoomSessionManager, IRoomHandlerListener
{
    private _communication: INitroCommunicationManager;
    private _roomEngine: IRoomEngine;

    private _handlers: BaseHandler[];
    private _sessions: Map<number, IRoomSession>;

    constructor(communication: INitroCommunicationManager, roomEngine: IRoomEngine)
    {
        super();
        
        this._communication = communication;
        this._roomEngine    = roomEngine;

        this._handlers      = [];
        this._sessions      = new Map();
    }

    protected onInit(): void
    {
        this.setHandlers();

        this.processPendingRoom();
    }

    private setHandlers(): void
    {
        const connection = this._communication && this._communication.connection;

        if(!connection) return;

        this._handlers.push(
            new RoomSessionHandler(connection, this)
        );
    }

    private processPendingRoom(): void
    {

    }

    public get communication(): INitroCommunicationManager
    {
        return this._communication;
    }

    public get roomEngine(): IRoomEngine
    {
        return this._roomEngine;
    }
}