import { NitroManager } from '../core/common/NitroManager';
import { EventDispatcher } from '../core/events/EventDispatcher';
import { IEventDispatcher } from '../core/events/IEventDispatcher';
import { INitroCore } from '../core/INitroCore';
import { INitroRenderer } from '../core/renderer/INitroRenderer';
import { NitroRenderer } from '../core/renderer/NitroRenderer';
import { INitroCommunicationManager } from './communication/INitroCommunicationManager';
import { NitroCommunicationManager } from './communication/NitroCommunicationManager';
import { INitroInstance } from './INitroInstance';
import { IRoomEngine } from './room/IRoomEngine';
import { RoomEngine } from './room/RoomEngine';
import { IRoomSessionManager } from './session/IRoomSessionManager';
import { ISessionDataManager } from './session/ISessionDataManager';
import { RoomSessionManager } from './session/RoomSessionManager';
import { SessionDataManager } from './session/SessionDataManager';

export class NitroInstance extends NitroManager implements INitroInstance
{
    private static INSTANCE: INitroInstance = null;

    private _core: INitroCore;
    private _communication: INitroCommunicationManager;
    private _roomEngine: IRoomEngine;
    private _session: ISessionDataManager;
    private _roomSession: IRoomSessionManager;
    private _renderer: INitroRenderer;

    private _events: IEventDispatcher;

    constructor(core: INitroCore)
    {
        super();

        this._core          = core;
        this._communication = new NitroCommunicationManager(core.communication);
        this._roomEngine    = new RoomEngine();
        this._session       = new SessionDataManager(this._communication);
        this._roomSession   = new RoomSessionManager(this._communication, this._roomEngine);
        this._renderer      = null;

        this._events        = new EventDispatcher();

        if(!NitroInstance.INSTANCE) NitroInstance.INSTANCE = this;

        this.setupRenderer();
    }

    protected onInit(): void
    {
        if(this._communication) this._communication.init();
        if(this._roomEngine)    this._roomEngine.init();
        if(this._session)       this._session.init();
        if(this._roomSession)   this._roomSession.init();
    }

    protected onDispose(): void
    {
        if(this._roomSession)
        {
            this._roomSession.dispose();

            this._roomSession = null;
        }

        if(this._session)
        {
            this._session.dispose();

            this._session = null;
        }

        if(this._roomEngine)
        {
            this._roomEngine.dispose();

            this._roomEngine = null;
        }
        
        if(this._communication)
        {
            this._communication.dispose();

            this._communication = null;
        }

        if(this._events)
        {
            this._events.dispose();

            this._events = null;
        }
    }

    private setupRenderer(): void
    {
        this._renderer = new NitroRenderer({
            width: window.innerWidth,
            height: window.innerHeight,
            antialias: false
        });

        this._renderer.setup();
    }

    public get core(): INitroCore
    {
        return this._core;
    }

    public get communication(): INitroCommunicationManager
    {
        return this._communication;
    }

    public get roomEngine(): IRoomEngine
    {
        return this._roomEngine;
    }

    public get session(): ISessionDataManager
    {
        return this._session;
    }

    public get roomSession(): IRoomSessionManager
    {
        return this._roomSession;
    }

    public get renderer(): INitroRenderer
    {
        return this._renderer;
    }

    public get events(): IEventDispatcher
    {
        return this._events;
    }

    public static get instance(): INitroInstance
    {
        return this.INSTANCE || null;
    }
}