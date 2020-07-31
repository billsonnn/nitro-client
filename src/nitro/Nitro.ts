import { NitroLogger } from '../core/common/logger/NitroLogger';
import { EventDispatcher } from '../core/events/EventDispatcher';
import { IEventDispatcher } from '../core/events/IEventDispatcher';
import { NitroEvent } from '../core/events/NitroEvent';
import { INitroCore } from '../core/INitroCore';
import { NitroCore } from '../core/NitroCore';
import { NitroConfiguration } from '../NitroConfiguration';
import { IRoomManager } from '../room/IRoomManager';
import { RoomManager } from '../room/RoomManager';
import { AvatarRenderManager } from './avatar/AvatarRenderManager';
import { IAvatarRenderManager } from './avatar/IAvatarRenderManager';
import { INitroCatalog } from './catalog/INitroCatalog';
import { NitroCatalog } from './catalog/NitroCatalog';
import { INitroCommunicationManager } from './communication/INitroCommunicationManager';
import { NitroCommunicationManager } from './communication/NitroCommunicationManager';
import { INitro } from './INitro';
import { INitroInventory } from './inventory/INitroInventory';
import { NitroInventory } from './inventory/NitroInventory';
import { INitroNavigator } from './navigator/INitroNavigator';
import { NitroNavigator } from './navigator/NitroNavigator';
import { IRoomEngine } from './room/IRoomEngine';
import { RoomEngine } from './room/RoomEngine';
import { IRoomSessionManager } from './session/IRoomSessionManager';
import { ISessionDataManager } from './session/ISessionDataManager';
import { RoomSessionManager } from './session/RoomSessionManager';
import { SessionDataManager } from './session/SessionDataManager';
import { RoomUI } from './ui/RoomUI';
import { INitroWindowManager } from './window/INitroWindowManager';
import { NitroWindowManager } from './window/NitroWindowManager';

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

export class Nitro extends PIXI.Application implements INitro
{
    public static READY: string = 'NE_READY';
    public static CONFIGURATION = NitroConfiguration;

    private static INSTANCE: INitro = null;

    private _core: INitroCore;
    private _events: IEventDispatcher;
    private _communication: INitroCommunicationManager;
    private _avatar: IAvatarRenderManager;
    private _windowManager: INitroWindowManager;
    private _roomEngine: IRoomEngine;
    private _sessionDataManager: ISessionDataManager;
    private _roomSessionManager: IRoomSessionManager;
    private _roomManager: IRoomManager;
    private _roomUI: RoomUI;
    private _catalog: INitroCatalog;
    private _inventory: INitroInventory;
    private _navigator: INitroNavigator;

    private _isReady: boolean;
    private _isDisposed: boolean;

    constructor(core: INitroCore, options?: {
        autoStart?: boolean;
        width?: number;
        height?: number;
        view?: HTMLCanvasElement;
        transparent?: boolean;
        autoDensity?: boolean;
        antialias?: boolean;
        preserveDrawingBuffer?: boolean;
        resolution?: number;
        forceCanvas?: boolean;
        backgroundColor?: number;
        clearBeforeRender?: boolean;
        powerPreference?: string;
        sharedTicker?: boolean;
        sharedLoader?: boolean;
        resizeTo?: Window | HTMLElement;
    })
    {
        super(options);

        if(!Nitro.INSTANCE) Nitro.INSTANCE = this;

        this._core                  = core;
        this._events                = new EventDispatcher();
        this._communication         = new NitroCommunicationManager(core.communication);
        this._avatar                = new AvatarRenderManager();
        this._windowManager         = new NitroWindowManager();
        this._roomEngine            = new RoomEngine(this._communication);
        this._sessionDataManager    = new SessionDataManager(this._communication);
        this._roomSessionManager    = new RoomSessionManager(this._communication, this._roomEngine);
        this._roomManager           = new RoomManager(this._roomEngine, this._roomEngine.visualizationFactory, this._roomEngine.logicFactory);
        this._roomUI                = new RoomUI(this._communication, this._windowManager, this._roomEngine, this._avatar, this._sessionDataManager, this._roomSessionManager);
        this._catalog               = new NitroCatalog(this._communication, this._windowManager, this._roomEngine, this._avatar, this._sessionDataManager, this._roomSessionManager);
        this._inventory             = new NitroInventory(this._communication, this._windowManager, this._roomEngine, this._avatar, this._sessionDataManager, this._catalog);
        this._navigator             = new NitroNavigator(this._communication, this._sessionDataManager, this._roomSessionManager);

        this._isReady       = false;
        this._isDisposed    = false;
    }

    public static bootstrap(options: any): void
    {
        options = {
            configurationUrl: (options.configurationUrl || ''),
            sso: (options.sso || null),
            canvasParent: (options.canvasParent || document.body)
        };

        if(Nitro.INSTANCE)
        {
            Nitro.INSTANCE.dispose();

            Nitro.INSTANCE = null;
        }

        const canvas = document.createElement('canvas');

        canvas.id           = 'client-wrapper';
        canvas.className    = 'client-canvas';
        canvas.width        = window.innerWidth;
        canvas.height       = window.innerHeight;
        
        const instance = new this(new NitroCore(), {
            width: (window.innerWidth),
            height: (window.innerHeight),
            transparent: true,
            view: canvas
        });

        instance.ticker.maxFPS  = NitroConfiguration.FPS;

        instance.communication.demo.setSSO(options.sso);
    }

    public init(): void
    {
        if(this._isReady || this._isDisposed) return;

        this.setupRenderer();

        //if(this._communication) this._communication.init();
        if(this._avatar)        this._avatar.init();
        if(this._windowManager) this._windowManager.init();
        if(this._catalog)       this._catalog.init();
        if(this._inventory)     this._inventory.init();
        if(this._navigator)     this._navigator.init();

        if(this._roomEngine)
        {
            this._roomEngine.sessionDataManager = this._sessionDataManager;
            this._roomEngine.roomSessionManager = this._roomSessionManager;
            this._roomEngine.roomManager        = this._roomManager;

            this._roomEngine.init();

            if(this._sessionDataManager) this._sessionDataManager.init();
            if(this._roomManager) this._roomManager.init();
            if(this._roomSessionManager) this._roomSessionManager.init();
        }

        if(!this._communication.connection)
        {
            NitroLogger.log('No connection found');
        }

        if(this._events) this._events.dispatchEvent(new NitroEvent(Nitro.READY));

        this._isReady = true;
    }

    public dispose(): void
    {
        if(this._isDisposed) return;

        if(this._navigator)
        {
            this._navigator.dispose();

            this._navigator = null;
        }

        if(this._inventory)
        {
            this._inventory.dispose();

            this._inventory = null;
        }

        if(this._catalog)
        {
            this._catalog.dispose();

            this._catalog = null;
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
        
        if(this._roomSessionManager)
        {
            this._roomSessionManager.dispose();

            this._roomSessionManager = null;
        }

        if(this._sessionDataManager)
        {
            this._sessionDataManager.dispose();

            this._sessionDataManager = null;
        }

        if(this._roomEngine)
        {
            this._roomEngine.dispose();
            
            this._roomEngine = null;
        }

        if(this._windowManager)
        {
            this._windowManager.dispose();

            this._windowManager = null;
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

        super.destroy();

        this._isDisposed    = true;
        this._isReady       = false;
    }

    private setupRenderer(): void
    {
        Nitro.instance.resizeTo = window;

        this.resize();
    }

    public resize(): void
    {
        //this.renderer.view.width        = window.innerWidth;
        //this.renderer.view.height       = window.innerHeight;
        this.renderer.transparent       = true;
        this.renderer.backgroundColor   = 0xFFFFFF;
    }

    public get core(): INitroCore
    {
        return this._core;
    }

    public get events(): IEventDispatcher
    {
        return this._events;
    }

    public get communication(): INitroCommunicationManager
    {
        return this._communication;
    }

    public get avatar(): IAvatarRenderManager
    {
        return this._avatar;
    }

    public get windowManager(): INitroWindowManager
    {
        return this._windowManager;
    }

    public get roomEngine(): IRoomEngine
    {
        return this._roomEngine;
    }

    public get sessionDataManager(): ISessionDataManager
    {
        return this._sessionDataManager;
    }

    public get roomSessionManager(): IRoomSessionManager
    {
        return this._roomSessionManager;
    }

    public get roomManager(): IRoomManager
    {
        return this._roomManager;
    }

    public get roomUI(): RoomUI
    {
        return this._roomUI;
    }

    public get catalog(): INitroCatalog
    {
        return this._catalog;
    }

    public get inventory(): INitroInventory
    {
        return this._inventory;
    }

    public get navigator(): INitroNavigator
    {
        return this._navigator;
    }

    public get time(): number
    {
        return this.ticker.lastTime;
    }

    public get isReady(): boolean
    {
        return this._isReady;
    }

    public get isDisposed(): boolean
    {
        return this._isDisposed;
    }

    public static get instance(): INitro
    {
        return this.INSTANCE || null;
    }
}