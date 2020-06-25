import { NitroManager } from '../../core/common/NitroManager';
import { INitroCommunicationManager } from '../communication/INitroCommunicationManager';
import { IRoomEngine } from '../room/IRoomEngine';
import { RoomSessionEvent } from './events/RoomSessionEvent';
import { BaseHandler } from './handler/BaseHandler';
import { RoomChatHandler } from './handler/RoomChatHandler';
import { RoomPermissionsHandler } from './handler/RoomPermissionsHandler';
import { RoomSessionHandler } from './handler/RoomSessionHandler';
import { RoomUsersHandler } from './handler/RoomUsersHandler';
import { IRoomHandlerListener } from './IRoomHandlerListener';
import { IRoomSession } from './IRoomSession';
import { IRoomSessionManager } from './IRoomSessionManager';
import { RoomSession } from './RoomSession';

export class RoomSessionManager extends NitroManager implements IRoomSessionManager, IRoomHandlerListener
{
    private _communication: INitroCommunicationManager;
    private _roomEngine: IRoomEngine;

    private _handlers: BaseHandler[];
    private _sessions: Map<string, IRoomSession>;
    private _pendingSession: IRoomSession;

    private _sessionStarting: boolean;
    private _viewerSession: IRoomSession;

    constructor(communication: INitroCommunicationManager, roomEngine: IRoomEngine)
    {
        super();
        
        this._communication     = communication;
        this._roomEngine        = roomEngine;

        this._handlers          = [];
        this._sessions          = new Map();
        this._pendingSession    = null;

        this._sessionStarting   = false;
        this._viewerSession     = null;
    }

    protected onInit(): void
    {
        this.createHandlers();

        this.processPendingSession();
    }

    protected onDispose(): void
    {
        super.onDispose();
    }

    private createHandlers(): void
    {
        const connection = this._communication && this._communication.connection;

        if(!connection) return;

        this._handlers.push(
            new RoomChatHandler(connection, this),
            new RoomPermissionsHandler(connection, this),
            new RoomSessionHandler(connection, this),
            new RoomUsersHandler(connection, this)
        );
    }

    private setHandlers(session: IRoomSession): void
    {
        if(!this._handlers || !this._handlers.length) return;
        
        for(let handler of this._handlers)
        {
            if(!handler) continue;

            handler.setRoomId(session.roomId);
        }
    }

    private processPendingSession(): void
    {
        if(!this._pendingSession) return;

        this.addSession(this._pendingSession);

        this._pendingSession = null;
    }

    public getSession(id: number): IRoomSession
    {
        const existing = this._sessions.get(this.getRoomId(id));

        if(!existing) return null;
        
        return existing;
    }

    public createSession(roomId: number, password: string = null): boolean
    {
        const session = new RoomSession();

        session.roomId      = roomId;
        session.password    = password;

        return this.addSession(session);
    }

    private addSession(roomSession: IRoomSession): boolean
    {
        if(!this._roomEngine.ready)
        {
            this._pendingSession = roomSession;

            return false;
        }

        this._sessionStarting = true;

        if(this._sessions.get(this.getRoomId(roomSession.roomId)))
        {
            this.removeSession(roomSession.roomId);
        }

        roomSession.setConnection(this._communication.connection);

        this._sessions.set(this.getRoomId(roomSession.roomId), roomSession);

        this.events.dispatchEvent(new RoomSessionEvent(RoomSessionEvent.CREATED, roomSession));

        this._viewerSession = roomSession;

        this.startSession(this._viewerSession);

        return true;
    }

    public startSession(session: IRoomSession): boolean
    {
        if(session.state === RoomSessionEvent.STARTED) return false;

        this._sessionStarting = false;

        if(!session.start())
        {
            this.removeSession(session.roomId);

            return false;
        }

        this.events.dispatchEvent(new RoomSessionEvent(RoomSessionEvent.STARTED, session));

        this.setHandlers(session);

        return true;
    }

    private removeSession(id: number): void
    {
        const session = this.getSession(id);

        if(!session) return;

        this._sessions.delete(this.getRoomId(id));

        this.events.dispatchEvent(new RoomSessionEvent(RoomSessionEvent.ENDED, session));

        session.dispose();
    }

    public sessionUpdate(id: number, type: string): void
    {
        const session = this.getSession(id);

        if(!session) return;

        switch(type)
        {
            case RoomSessionHandler.RS_CONNECTED:
                return;
            case RoomSessionHandler.RS_READY:
                return;
            case RoomSessionHandler.RS_DISCONNECTED:
                this.removeSession(id);
                return;
        }
    }

    public sessionReinitialize(fromRoomId: number, toRoomId: number): void
    {
        const existing = this.getSession(fromRoomId);

        if(!existing) return;
        
        this._sessions.delete(this.getRoomId(fromRoomId));

        existing.reset(toRoomId);

        this._sessions.set(this.getRoomId(toRoomId), existing);

        this.setHandlers(existing);
    }

    private getRoomId(id: number): string
    {
        return 'hard_coded_room_id';
    }

    public get communication(): INitroCommunicationManager
    {
        return this._communication;
    }

    public get roomEngine(): IRoomEngine
    {
        return this._roomEngine;
    }

    public get viewerSession(): IRoomSession
    {
        return this._viewerSession;
    }
}