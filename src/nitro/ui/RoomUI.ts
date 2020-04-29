import { NitroManager } from '../../core/common/NitroManager';
import { INitroCommunicationManager } from '../communication/INitroCommunicationManager';
import { RoomEngineDimmerStateEvent } from '../room/events/RoomEngineDimmerStateEvent';
import { RoomEngineEvent } from '../room/events/RoomEngineEvent';
import { RoomEngineObjectEvent } from '../room/events/RoomEngineObjectEvent';
import { RoomEngineTriggerWidgetEvent } from '../room/events/RoomEngineTriggerWidgetEvent';
import { RoomObjectHSLColorEnabledEvent } from '../room/events/RoomObjectHSLColorEnabledEvent';
import { IRoomEngine } from '../room/IRoomEngine';
import { RoomSessionEvent } from '../session/events/RoomSessionEvent';
import { IRoomSession } from '../session/IRoomSession';
import { IRoomSessionManager } from '../session/IRoomSessionManager';
import { ISessionDataManager } from '../session/ISessionDataManager';
import { INitroWindowManager } from '../window/INitroWindowManager';
import { IRoomWidgetFactory } from './IRoomWidgetFactory';
import { RoomDesktop } from './RoomDesktop';
import { RoomWidgetEnum } from './widget/enums/RoomWidgetEnum';
import { RoomWidgetFactory } from './widget/RoomWidgetFactory';

export class RoomUI extends NitroManager
{
    private _communication: INitroCommunicationManager;
    private _windowManager: INitroWindowManager;
    private _roomEngine: IRoomEngine;
    private _sessionData: ISessionDataManager;
    private _roomSession: IRoomSessionManager;
    private _roomWidgetFactory: IRoomWidgetFactory;
    private _desktops: Map<string, RoomDesktop>;

    private _isInRoom: boolean;

    constructor(communication: INitroCommunicationManager, windowManager: INitroWindowManager, engine: IRoomEngine, sessionData: ISessionDataManager, roomSession: IRoomSessionManager)
    {
        super();

        this._communication     = communication;
        this._windowManager     = windowManager;
        this._roomEngine        = engine;
        this._sessionData       = sessionData;
        this._roomSession       = roomSession;
        this._roomWidgetFactory = new RoomWidgetFactory(this);
        this._desktops          = new Map();

        this._isInRoom          = false;

        this._roomEngine.events.addEventListener(RoomEngineEvent.INITIALIZED, this.onRoomEngineEvent.bind(this));
        this._roomEngine.events.addEventListener(RoomEngineEvent.DISPOSED, this.onRoomEngineEvent.bind(this));
        this._roomEngine.events.addEventListener(RoomObjectHSLColorEnabledEvent.ROOM_BACKGROUND_COLOR, this.onRoomEngineEvent.bind(this));

        this._roomEngine.events.addEventListener(RoomEngineObjectEvent.SELECTED, this.onRoomEngineObjectEvent.bind(this));
        this._roomEngine.events.addEventListener(RoomEngineObjectEvent.DESELECTED, this.onRoomEngineObjectEvent.bind(this));
        this._roomEngine.events.addEventListener(RoomEngineObjectEvent.ADDED, this.onRoomEngineObjectEvent.bind(this));
        this._roomEngine.events.addEventListener(RoomEngineObjectEvent.REMOVED, this.onRoomEngineObjectEvent.bind(this));
        this._roomEngine.events.addEventListener(RoomEngineObjectEvent.PLACED, this.onRoomEngineObjectEvent.bind(this));
        this._roomEngine.events.addEventListener(RoomEngineObjectEvent.REQUEST_MOVE, this.onRoomEngineObjectEvent.bind(this));
        this._roomEngine.events.addEventListener(RoomEngineObjectEvent.REQUEST_ROTATE, this.onRoomEngineObjectEvent.bind(this));
        this._roomEngine.events.addEventListener(RoomEngineObjectEvent.MOUSE_ENTER, this.onRoomEngineObjectEvent.bind(this));
        this._roomEngine.events.addEventListener(RoomEngineObjectEvent.MOUSE_LEAVE, this.onRoomEngineObjectEvent.bind(this));
        this._roomEngine.events.addEventListener(RoomEngineTriggerWidgetEvent.OPEN_WIDGET, this.onRoomEngineObjectEvent.bind(this));
        this._roomEngine.events.addEventListener(RoomEngineTriggerWidgetEvent.CLOSE_WIDGET, this.onRoomEngineObjectEvent.bind(this));
        this._roomEngine.events.addEventListener(RoomEngineTriggerWidgetEvent.REQUEST_TROPHY, this.onRoomEngineObjectEvent.bind(this));
        
        this._roomSession.events.addEventListener(RoomSessionEvent.CREATED, this.onRoomSessionEvent.bind(this));
        this._roomSession.events.addEventListener(RoomSessionEvent.STARTED, this.onRoomSessionEvent.bind(this));
        this._roomSession.events.addEventListener(RoomSessionEvent.ROOM_DATA, this.onRoomSessionEvent.bind(this));
        this._roomSession.events.addEventListener(RoomSessionEvent.ENDED, this.onRoomSessionEvent.bind(this));
    }

    public dispose(): void
    {
        this._roomEngine.events.removeEventListener(RoomEngineEvent.INITIALIZED, this.onRoomEngineEvent.bind(this));
        this._roomEngine.events.removeEventListener(RoomEngineEvent.DISPOSED, this.onRoomEngineEvent.bind(this));
        this._roomEngine.events.removeEventListener(RoomObjectHSLColorEnabledEvent.ROOM_BACKGROUND_COLOR, this.onRoomEngineEvent.bind(this));

        this._roomEngine.events.removeEventListener(RoomEngineObjectEvent.SELECTED, this.onRoomEngineObjectEvent.bind(this));
        this._roomEngine.events.removeEventListener(RoomEngineObjectEvent.DESELECTED, this.onRoomEngineObjectEvent.bind(this));
        this._roomEngine.events.removeEventListener(RoomEngineObjectEvent.ADDED, this.onRoomEngineObjectEvent.bind(this));
        this._roomEngine.events.removeEventListener(RoomEngineObjectEvent.REMOVED, this.onRoomEngineObjectEvent.bind(this));
        this._roomEngine.events.removeEventListener(RoomEngineObjectEvent.PLACED, this.onRoomEngineObjectEvent.bind(this));
        this._roomEngine.events.removeEventListener(RoomEngineObjectEvent.REQUEST_MOVE, this.onRoomEngineObjectEvent.bind(this));
        this._roomEngine.events.removeEventListener(RoomEngineObjectEvent.REQUEST_ROTATE, this.onRoomEngineObjectEvent.bind(this));
        this._roomEngine.events.removeEventListener(RoomEngineObjectEvent.MOUSE_ENTER, this.onRoomEngineObjectEvent.bind(this));
        this._roomEngine.events.removeEventListener(RoomEngineObjectEvent.MOUSE_LEAVE, this.onRoomEngineObjectEvent.bind(this));
        this._roomEngine.events.removeEventListener(RoomEngineTriggerWidgetEvent.OPEN_WIDGET, this.onRoomEngineObjectEvent.bind(this));
        this._roomEngine.events.removeEventListener(RoomEngineTriggerWidgetEvent.CLOSE_WIDGET, this.onRoomEngineObjectEvent.bind(this));
        this._roomEngine.events.removeEventListener(RoomEngineTriggerWidgetEvent.REQUEST_TROPHY, this.onRoomEngineObjectEvent.bind(this));
        
        this._roomSession.events.removeEventListener(RoomSessionEvent.CREATED, this.onRoomSessionEvent.bind(this));
        this._roomSession.events.removeEventListener(RoomSessionEvent.STARTED, this.onRoomSessionEvent.bind(this));
        this._roomSession.events.removeEventListener(RoomSessionEvent.ROOM_DATA, this.onRoomSessionEvent.bind(this));
        this._roomSession.events.removeEventListener(RoomSessionEvent.ENDED, this.onRoomSessionEvent.bind(this));
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

        desktop.roomEngine          = this._roomEngine;
        desktop.sessionDataManager  = this._sessionData;
        desktop.roomSessionManager  = this._roomSession;
        desktop.roomWidgetFactory   = this._roomWidgetFactory;

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
                desktop._Str_22664(this._Str_17538(event.roomId));

                this._roomEngine.setActiveRoomId(event.roomId);

                desktop.createWidget(RoomWidgetEnum.FURNI_TROPHY_WIDGET);

                this._isInRoom = true;
                return;
            case RoomEngineEvent.DISPOSED:
                this.destroyDesktop(roomId);
                this._isInRoom = false;
                return;
            case RoomEngineDimmerStateEvent.ROOM_COLOR:
                return;
            case RoomObjectHSLColorEnabledEvent.ROOM_BACKGROUND_COLOR:
                const colorEvent = event as RoomObjectHSLColorEnabledEvent;

                if(colorEvent.enable) desktop.setBackgroundColor(colorEvent.hue, colorEvent.saturation, colorEvent.lightness);
                else desktop.setBackgroundColor(0, 0, 0);
                return;
        }
    }

    private onRoomEngineObjectEvent(event: RoomEngineObjectEvent): void
    {
        if(!this._roomEngine) return;

        const roomId    = this.getRoomId(event.roomId);
        const desktop   = this.getDesktop(roomId);

        if(!desktop) return;

        desktop.onRoomEngineObjectEvent(event);
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

    public _Str_17538(roomId: number): number
    {
        return 1;
    }

    public get windowManager(): INitroWindowManager
    {
        return this._windowManager;
    }
}