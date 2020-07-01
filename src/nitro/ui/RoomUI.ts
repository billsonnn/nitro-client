import { IUpdateReceiver } from '../../core/common/IUpdateReceiver';
import { NitroManager } from '../../core/common/NitroManager';
import { IAvatarRenderManager } from '../avatar/IAvatarRenderManager';
import { INitroCommunicationManager } from '../communication/INitroCommunicationManager';
import { Nitro } from '../Nitro';
import { RoomEngineDimmerStateEvent } from '../room/events/RoomEngineDimmerStateEvent';
import { RoomEngineEvent } from '../room/events/RoomEngineEvent';
import { RoomEngineObjectEvent } from '../room/events/RoomEngineObjectEvent';
import { RoomEngineTriggerWidgetEvent } from '../room/events/RoomEngineTriggerWidgetEvent';
import { RoomObjectHSLColorEnabledEvent } from '../room/events/RoomObjectHSLColorEnabledEvent';
import { RoomZoomEvent } from '../room/events/RoomZoomEvent';
import { IRoomEngine } from '../room/IRoomEngine';
import { RoomSessionChatEvent } from '../session/events/RoomSessionChatEvent';
import { RoomSessionEvent } from '../session/events/RoomSessionEvent';
import { IRoomSession } from '../session/IRoomSession';
import { IRoomSessionManager } from '../session/IRoomSessionManager';
import { ISessionDataManager } from '../session/ISessionDataManager';
import { INitroWindowManager } from '../window/INitroWindowManager';
import { IRoomUI } from './IRoomUI';
import { IRoomWidgetFactory } from './IRoomWidgetFactory';
import { RoomDesktop } from './RoomDesktop';
import { RoomWidgetEnum } from './widget/enums/RoomWidgetEnum';
import { RoomWidgetFactory } from './widget/RoomWidgetFactory';

export class RoomUI extends NitroManager implements IRoomUI, IUpdateReceiver
{
    private _communication: INitroCommunicationManager;
    private _windowManager: INitroWindowManager;
    private _roomEngine: IRoomEngine;
    private _avatarRenderManager: IAvatarRenderManager;
    private _sessionData: ISessionDataManager;
    private _roomSession: IRoomSessionManager;
    private _roomWidgetFactory: IRoomWidgetFactory;
    private _desktops: Map<string, RoomDesktop>;

    private _isInRoom: boolean;

    constructor(communication: INitroCommunicationManager, windowManager: INitroWindowManager, engine: IRoomEngine, avatarRenderManager: IAvatarRenderManager, sessionData: ISessionDataManager, roomSession: IRoomSessionManager)
    {
        super();

        this._communication         = communication;
        this._windowManager         = windowManager;
        this._roomEngine            = engine;
        this._avatarRenderManager   = avatarRenderManager;
        this._sessionData           = sessionData;
        this._roomSession           = roomSession;
        this._roomWidgetFactory     = new RoomWidgetFactory(this);
        this._desktops              = new Map();

        this._isInRoom              = false;

        Nitro.instance.ticker.add(this.update, this);

        this._roomEngine.events.addEventListener(RoomEngineEvent.INITIALIZED, this.onRoomEngineEvent.bind(this));
        this._roomEngine.events.addEventListener(RoomEngineEvent.DISPOSED, this.onRoomEngineEvent.bind(this));
        this._roomEngine.events.addEventListener(RoomZoomEvent.ROOM_ZOOM, this.onRoomEngineEvent.bind(this));
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
        this._roomSession.events.addEventListener(RoomSessionChatEvent.CHAT_EVENT, this.onRoomSessionEvent.bind(this));
    }

    public dispose(): void
    {
        Nitro.instance.ticker.remove(this.update, this);

        this._roomEngine.events.removeEventListener(RoomEngineEvent.INITIALIZED, this.onRoomEngineEvent.bind(this));
        this._roomEngine.events.removeEventListener(RoomEngineEvent.DISPOSED, this.onRoomEngineEvent.bind(this));
        this._roomEngine.events.removeEventListener(RoomZoomEvent.ROOM_ZOOM, this.onRoomEngineEvent.bind(this));
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
        this._roomSession.events.removeEventListener(RoomSessionChatEvent.CHAT_EVENT, this.onRoomSessionEvent.bind(this));
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

        desktop.windowManager       = this._windowManager;
        desktop.roomEngine          = this._roomEngine;
        desktop.avatarRenderManager = this._avatarRenderManager;
        desktop.sessionDataManager  = this._sessionData;
        desktop.roomSessionManager  = this._roomSession;
        desktop.roomWidgetFactory   = this._roomWidgetFactory;

        desktop.layout = `<div class="room-container"></div>`;

        this._desktops.set(roomId, desktop);

        return desktop;
    }

    public update(time: number): void
    {
        if(!this._desktops || !this._desktops.size) return;

        for(let desktop of this._desktops.values())
        {
            if(!desktop) continue;

            desktop.update();
        }
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

                desktop.createWidget(RoomWidgetEnum.CHAT_WIDGET);
                desktop.createWidget(RoomWidgetEnum.INFOSTAND);
                desktop.createWidget(RoomWidgetEnum.LOCATION_WIDGET);

                if(!desktop.roomSession.isSpectator)
                {
                    desktop.createWidget(RoomWidgetEnum.CHAT_INPUT_WIDGET);
                    desktop.createWidget(RoomWidgetEnum.AVATAR_INFO);
                }
                
                desktop.createWidget(RoomWidgetEnum.FURNI_TROPHY_WIDGET);

                this._isInRoom = true;
                return;
            case RoomEngineEvent.DISPOSED:
                this.destroyDesktop(roomId);
                this._isInRoom = false;
                return;
            case RoomZoomEvent.ROOM_ZOOM:
                const zoomEvent = (event as RoomZoomEvent);

                this._roomEngine.setRoomRenderingCanvasScale(this._roomEngine.activeRoomId, this._Str_17538(this._roomEngine.activeRoomId), ((zoomEvent.level < 1) ? 0.5 : (1 << (Math.floor(zoomEvent.level) - 1))));
            case RoomEngineDimmerStateEvent.ROOM_COLOR:
                desktop.processEvent(event);
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
            default:
                const desktop = this.getDesktop(this.getRoomId(event.session.roomId));

                if(desktop) desktop.processEvent(event);
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