import { INitroCommunicationManager } from '../communication/INitroCommunicationManager';
import { RoomEngineEvent } from '../room/events/RoomEngineEvent';
import { RoomObjectHSLColorEnabledEvent } from '../room/events/RoomObjectHSLColorEnabledEvent';
import { IRoomEngine } from '../room/IRoomEngine';
import { RoomSessionEvent } from '../session/events/RoomSessionEvent';
import { IRoomSession } from '../session/IRoomSession';
import { IRoomSessionManager } from '../session/IRoomSessionManager';
import { ISessionDataManager } from '../session/ISessionDataManager';
import { RoomDesktop } from './RoomDesktop';

export class RoomUI
{
    private _communication: INitroCommunicationManager;
    private _roomEngine: IRoomEngine;
    private _sessionData: ISessionDataManager;
    private _roomSession: IRoomSessionManager;
    private _desktops: Map<string, RoomDesktop>;

    private _isInRoom: boolean;

    constructor(communication: INitroCommunicationManager, engine: IRoomEngine, sessionData: ISessionDataManager, roomSession: IRoomSessionManager)
    {
        this._communication = communication;
        this._roomEngine    = engine;
        this._sessionData   = sessionData;
        this._roomSession   = roomSession;
        this._desktops      = new Map();

        this._isInRoom      = false;

        engine.events.addEventListener(RoomEngineEvent.INITIALIZED, this.onRoomEngineEvent.bind(this));
        engine.events.addEventListener(RoomObjectHSLColorEnabledEvent.ROOM_BACKGROUND_COLOR, this.onRoomEngineEvent.bind(this));
        
        roomSession.events.addEventListener(RoomSessionEvent.CREATED, this.onRoomSessionEvent.bind(this));
        roomSession.events.addEventListener(RoomSessionEvent.STARTED, this.onRoomSessionEvent.bind(this));
        roomSession.events.addEventListener(RoomSessionEvent.ROOM_DATA, this.onRoomSessionEvent.bind(this));
        roomSession.events.addEventListener(RoomSessionEvent.ENDED, this.onRoomSessionEvent.bind(this));
    }

    public dispose(): void
    {
        
    }

    public getDesktop(roomId: string): RoomDesktop
    {
        if(!roomId) return null;

        const existing = this._desktops.get(roomId);

        if(!existing) return null;
        
        return existing;
    }

    public createDesktopForSession(session: IRoomSession): RoomDesktop
    {
        if(!session || !this._roomEngine) return null;

        const roomId = this.getRoomId(session.roomId);

        let desktop = this.getDesktop(roomId);

        if(desktop) return desktop;

        desktop = new RoomDesktop(session, this._communication.connection);

        desktop.roomEngine  = this._roomEngine;
        desktop.sessionData = this._sessionData;
        desktop.roomSession = this._roomSession;

        this._desktops.set(roomId, desktop);

        return desktop;
    }

    private onRoomEngineEvent(event: RoomEngineEvent): void
    {
        if(!event || !this._roomEngine) return;

        const roomId = this.getRoomId(event.roomId);

        let desktop = this.getDesktop(roomId);

        if(!desktop)
        {
            if(!this._roomSession) return;

            const session = this._roomSession.getSession(event.roomId);

            if(session) desktop = this.createDesktopForSession(session);

            if(!desktop) return;
        }

        switch(event.type)
        {
            case RoomEngineEvent.INITIALIZED:
                desktop._Str_22664(1);
                this._isInRoom = true;
                return;
            case RoomEngineEvent.DISPOSED:
                this.destroyDesktop(roomId);
                this._isInRoom = false;
                return;
            case RoomObjectHSLColorEnabledEvent.ROOM_BACKGROUND_COLOR:
                const colorEvent = event as RoomObjectHSLColorEnabledEvent;

                if(colorEvent.enable) desktop.setBackgroundColor(colorEvent.hue, colorEvent.saturation, colorEvent.lightness);
                else desktop.setBackgroundColor(0, 0, 0);
                return;
        }
    }

    private onRoomSessionEvent(event: RoomSessionEvent): void
    {
        if(!event || !this._roomEngine) return;

        switch(event.type)
        {
            case RoomSessionEvent.CREATED:
                this.createDesktopForSession(event.session);
                return;
            case RoomSessionEvent.STARTED:
                return;
            case RoomSessionEvent.ROOM_DATA:
                return;
            case RoomSessionEvent.ENDED:
                if(event.session)
                {
                    this.destroyDesktop(this.getRoomId(event.session.roomId));
                }
                return;
        }
    }

    public destroyDesktop(roomId: string): void
    {
        const desktop = this._desktops.get(roomId);

        if(!desktop) return;

        this._desktops.delete(roomId);

        desktop.dispose();
    }

    private getRoomId(roomId: number): string
    {
        return 'hard_coded_room_id';
    }
}