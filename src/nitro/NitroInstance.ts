import { NitroManager } from '../core/common/NitroManager';
import { INitroCore } from '../core/INitroCore';
import { INitroRenderer } from '../core/renderer/INitroRenderer';
import { NitroRenderer } from '../core/renderer/NitroRenderer';
import { IRoomManager } from '../room/IRoomManager';
import { RoomManager } from '../room/RoomManager';
import { AvatarManager } from './avatar/AvatarManager';
import { INitroCommunicationManager } from './communication/INitroCommunicationManager';
import { NitroCommunicationManager } from './communication/NitroCommunicationManager';
import { INitroInstance } from './INitroInstance';
import { INitroNavigator } from './navigator/INitroNavigator';
import { NitroNavigator } from './navigator/NitroNavigator';
import { IRoomEngine } from './room/IRoomEngine';
import { RoomEngine } from './room/RoomEngine';
import { IRoomSessionManager } from './session/IRoomSessionManager';
import { ISessionDataManager } from './session/ISessionDataManager';
import { RoomSessionManager } from './session/RoomSessionManager';
import { SessionDataManager } from './session/SessionDataManager';
import { RoomUI } from './ui/RoomUI';

export class NitroInstance extends NitroManager implements INitroInstance
{
    private static INSTANCE: INitroInstance = null;

    private _core: INitroCore;
    private _communication: INitroCommunicationManager;
    private _avatar: AvatarManager;
    private _roomEngine: IRoomEngine;
    private _session: ISessionDataManager;
    private _roomSession: IRoomSessionManager;
    private _roomManager: IRoomManager;
    private _roomUI: RoomUI;
    private _navigator: INitroNavigator;
    
    private _renderer: INitroRenderer;

    constructor(core: INitroCore)
    {
        super();

        this._core          = core;
        this._communication = new NitroCommunicationManager(core.communication);
        this._avatar        = new AvatarManager();
        this._roomEngine    = new RoomEngine(this._communication);
        this._session       = new SessionDataManager(this._communication);
        this._roomSession   = new RoomSessionManager(this._communication, this._roomEngine);
        this._roomManager   = new RoomManager(this._roomEngine, this._roomEngine.visualizationFactory, this._roomEngine.logicFactory);
        this._roomUI        = new RoomUI(this._communication, this._roomEngine, this._session, this._roomSession);
        this._navigator     = new NitroNavigator(this._communication, this._session, this._roomSession);

        this._renderer      = new NitroRenderer({
            width: window.innerWidth,
            height: window.innerHeight,
            antialias: false
        });

        if(!NitroInstance.INSTANCE) NitroInstance.INSTANCE = this;
    }

    protected onInit(): void
    {
        this._renderer.setup();

        if(this._communication) this._communication.init();
        if(this._avatar)        this._avatar.init();
        if(this._navigator)     this._navigator.init();

        if(this._roomEngine)
        {
            this._roomEngine.initialize(this._session, this._roomSession, this._roomManager);

            if(this._session) this._session.init();
            if(this._roomManager) this._roomManager.init();
            if(this._roomSession) this._roomSession.init();
        }
    }

    protected onDispose(): void
    {
        if(this._navigator)
        {
            this._navigator.dispose();

            this._navigator = null;
        }

        if(this._roomUI)
        {
            this._roomUI.dispose();

            this._roomUI = null;
        }

        if(this._roomManager)
        {
            this._roomManager.dispose();

            this._roomManager = null;
        }
        
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

        if(this._avatar)
        {
            this._avatar.dispose();

            this._avatar = null;
        }
        
        if(this._communication)
        {
            this._communication.dispose();

            this._communication = null;
        }

        super.onDispose();
    }

    public get core(): INitroCore
    {
        return this._core;
    }

    public get communication(): INitroCommunicationManager
    {
        return this._communication;
    }

    public get avatar(): AvatarManager
    {
        return this._avatar;
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

    public get roomManager(): IRoomManager
    {
        return this._roomManager;
    }

    public get roomUI(): RoomUI
    {
        return this._roomUI;
    }

    public get navigator(): INitroNavigator
    {
        return this._navigator;
    }

    public get renderer(): INitroRenderer
    {
        return this._renderer;
    }

    public static get instance(): INitroInstance
    {
        return this.INSTANCE || null;
    }
}