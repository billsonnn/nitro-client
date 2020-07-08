import { IConnection } from '../../core/communication/connections/IConnection';
import { EventDispatcher } from '../../core/events/EventDispatcher';
import { IEventDispatcher } from '../../core/events/IEventDispatcher';
import { NitroEvent } from '../../core/events/NitroEvent';
import { IRoomObject } from '../../room/object/IRoomObject';
import { ColorConverter } from '../../room/utils/ColorConverter';
import { RoomGeometry } from '../../room/utils/RoomGeometry';
import { Vector3d } from '../../room/utils/Vector3d';
import { IAvatarRenderManager } from '../avatar/IAvatarRenderManager';
import { Nitro } from '../Nitro';
import { RoomEngineObjectEvent } from '../room/events/RoomEngineObjectEvent';
import { RoomEngineTriggerWidgetEvent } from '../room/events/RoomEngineTriggerWidgetEvent';
import { IRoomEngine } from '../room/IRoomEngine';
import { RoomObjectCategory } from '../room/object/RoomObjectCategory';
import { RoomObjectOperationType } from '../room/object/RoomObjectOperationType';
import { RoomObjectVariable } from '../room/object/RoomObjectVariable';
import { RoomVariableEnum } from '../room/RoomVariableEnum';
import { RoomControllerLevel } from '../session/enum/RoomControllerLevel';
import { IRoomSession } from '../session/IRoomSession';
import { IRoomSessionManager } from '../session/IRoomSessionManager';
import { ISessionDataManager } from '../session/ISessionDataManager';
import { INitroWindowManager } from '../window/INitroWindowManager';
import { DesktopLayoutManager } from './DesktopLayoutManager';
import { AvatarInfoWidgetHandler } from './handler/AvatarInfoWidgetHandler';
import { ChatInputWidgetHandler } from './handler/ChatInputWidgetHandler';
import { ChatWidgetHandler } from './handler/ChatWidgetHandler';
import { FurnitureTrophyWidgetHandler } from './handler/FurnitureTrophyWidgetHandler';
import { InfoStandWidgetHandler } from './handler/InfoStandWidgetHandler';
import { ObjectLocationRequestHandler } from './handler/ObjectLocationRequestHandler';
import { IRoomDesktop } from './IRoomDesktop';
import { IRoomWidgetFactory } from './IRoomWidgetFactory';
import { IRoomWidgetHandler } from './IRoomWidgetHandler';
import { IRoomWidgetHandlerContainer } from './IRoomWidgetHandlerContainer';
import { MouseEventType } from './MouseEventType';
import { RoomWidgetEnum } from './widget/enums/RoomWidgetEnum';
import { RoomWidgetRoomObjectUpdateEvent } from './widget/events/RoomWidgetRoomObjectUpdateEvent';
import { RoomWidgetRoomViewUpdateEvent } from './widget/events/RoomWidgetRoomViewUpdateEvent';
import { RoomWidgetUpdateEvent } from './widget/events/RoomWidgetUpdateEvent';
import { IRoomWidget } from './widget/IRoomWidget';
import { IRoomWidgetMessageListener } from './widget/IRoomWidgetMessageListener';
import { RoomWidgetFurniToWidgetMessage } from './widget/messages/RoomWidgetFurniToWidgetMessage';
import { RoomWidgetMessage } from './widget/messages/RoomWidgetMessage';

export class RoomDesktop implements IRoomDesktop, IRoomWidgetMessageListener, IRoomWidgetHandlerContainer
{
    public static STATE_UNDEFINED: number = -1;
    
    private static RESIZE_UPDATE_TIMEOUT_MS: number = 1000;
    private static SCALE_UPDATE_TIMEOUT_MS: number = 1000;

    private _events: EventDispatcher;
    private _session: IRoomSession;
    private _connection: IConnection;
    private _windowManager: INitroWindowManager;
    private _layoutManager: DesktopLayoutManager;
    private _roomEngine: IRoomEngine;
    private _avatarRenderManager: IAvatarRenderManager;
    private _sessionDataManager: ISessionDataManager;
    private _roomSessionManager: IRoomSessionManager;
    private _roomWidgetFactory: IRoomWidgetFactory;
    private _roomCanvasWrapper: HTMLCanvasElement;
    private _canvasIDs: number[];

    private _widgets: Map<string, IRoomWidget>;
    private _widgetHandlerMessageMap: Map<string, IRoomWidgetHandler[]>;
    private _widgetHandlerEventMap: Map<string, IRoomWidgetHandler[]>;

    private _didMouseMove: boolean;
    private _lastClick: number;
    private _clickCount: number;

    private _roomBackground: PIXI.Graphics;
    private _roomBackgroundColor: number;

    private _resizeTimer: any;

    constructor(roomSession: IRoomSession, connection: IConnection)
    {
        this._events                    = new EventDispatcher();
        this._session                   = roomSession;
        this._connection                = connection;
        this._windowManager             = null;
        this._layoutManager             = new DesktopLayoutManager();
        this._roomEngine                = null;
        this._avatarRenderManager       = null;
        this._sessionDataManager        = null;
        this._roomSessionManager        = null;
        this._roomWidgetFactory         = null;
        this._roomCanvasWrapper         = null;
        this._canvasIDs                 = [];

        this._widgets                   = new Map();
        this._widgetHandlerMessageMap   = new Map();
        this._widgetHandlerEventMap     = new Map();

        this._didMouseMove              = false;
        this._lastClick                 = 0;
        this._clickCount                = 0;

        this._roomBackground            = null;
        this._roomBackgroundColor       = 0;

        this._resizeTimer               = null;
    }

    public dispose(): void
    {
        if(this._resizeTimer)
        {
            clearTimeout(this._resizeTimer);

            this._resizeTimer = null;
        }

        const element = document.getElementById('client') as HTMLCanvasElement;

        if(element)
        {
            element.onclick     = null;
            element.onmousemove = null;
            element.onmousedown = null;
            element.onmouseup   = null;
        }

        window.onresize = null;

        if(this._widgets)
        {
            for(let widget of this._widgets.values()) widget && widget.dispose();

            this._widgets = null;
        }

        if(this._layoutManager)
        {
            this._layoutManager.dispose();

            this._layoutManager = null;
        }

        this._widgetHandlerMessageMap   = null;
        this._widgetHandlerEventMap     = null;
        this._connection                = null;
        this._avatarRenderManager       = null;
        this._canvasIDs                 = null;
        this._events                    = null;
        this._roomEngine                = null;
        this._roomSessionManager        = null;
        this._roomWidgetFactory         = null;
        this._session                   = null;
        this._sessionDataManager        = null;
        this._windowManager             = null;
    }

    public _Str_22664(canvasId: number): void
    {
        const width     = window.innerWidth;
        const height    = window.innerHeight;
        const scale     = RoomGeometry.SCALE_ZOOMED_IN;

        if(this._canvasIDs.indexOf(canvasId) >= 0) return;

        if(!this._session || !this._roomEngine) return;

        const displayObject = this._roomEngine.getRoomInstanceDisplay(this._session.roomId, canvasId, width, height, scale);

        if(!displayObject) return;

        const geometry = this._roomEngine.getRoomInstanceGeometry(this._session.roomId, canvasId) as RoomGeometry;

        if(geometry)
        {
            let minX = (this._roomEngine.getRoomInstanceNumber(this._session.roomId, RoomVariableEnum.ROOM_MIN_X) || 0);
            let maxX = (this._roomEngine.getRoomInstanceNumber(this._session.roomId, RoomVariableEnum.ROOM_MAX_X) || 0);
            let minY = (this._roomEngine.getRoomInstanceNumber(this._session.roomId, RoomVariableEnum.ROOM_MIN_Y) || 0);
            let maxY = (this._roomEngine.getRoomInstanceNumber(this._session.roomId, RoomVariableEnum.ROOM_MAX_Y) || 0);

            let x = ((minX + maxX) / 2);
            let y = ((minY + maxY) / 2);

            let offset = 20;

            x = (x + (offset - 1));
            y = (y + (offset - 1));

            let z = (Math.sqrt(((offset * offset) + (offset * offset))) * Math.tan(((30 / 180) * Math.PI)));

            geometry.location = new Vector3d(x, y, z);
        }

        const stage = Nitro.instance.stage;

        if(!stage) return;

        stage.addChild(displayObject);

        this._roomCanvasWrapper = Nitro.instance.renderer.view;

        if(this._roomCanvasWrapper)
        {
            this._roomCanvasWrapper.onclick     = this.onMouseEvent.bind(this);
            this._roomCanvasWrapper.onmousemove = this.onMouseEvent.bind(this);
            this._roomCanvasWrapper.onmousedown = this.onMouseEvent.bind(this);
            this._roomCanvasWrapper.onmouseup   = this.onMouseEvent.bind(this);
        }

        window.onresize = this.onWindowResizeEvent.bind(this);

        this._canvasIDs.push(canvasId);
    }

    public update(): void
    {
        for(let widget of this._widgets.values()) widget && widget.widgetHandler && widget.widgetHandler.update();
    }

    public createWidget(type: string): void
    {
        if(!this._roomWidgetFactory) return;

        const existing = this._widgets.get(type);

        if(existing) return;

        let widgetHandler: IRoomWidgetHandler = null;

        let sendSizeUpdate = false;

        switch(type)
        {
            case RoomWidgetEnum.CHAT_WIDGET:
                sendSizeUpdate = true;

                const handler = new ChatWidgetHandler();
                handler.connection = this._connection;

                widgetHandler = handler;
                break;
            case RoomWidgetEnum.CHAT_INPUT_WIDGET:
                sendSizeUpdate = true;
                widgetHandler = new ChatInputWidgetHandler();
                break;
            case RoomWidgetEnum.AVATAR_INFO:
                widgetHandler = new AvatarInfoWidgetHandler();
                break;
            case RoomWidgetEnum.INFOSTAND:
                widgetHandler = new InfoStandWidgetHandler();
                break;
            case RoomWidgetEnum.LOCATION_WIDGET:
                widgetHandler = new ObjectLocationRequestHandler();
                break;
            case RoomWidgetEnum.FURNI_TROPHY_WIDGET:
                widgetHandler = new FurnitureTrophyWidgetHandler();
                break;
        }

        if(widgetHandler)
        {
            widgetHandler.container = this;

            const messageTypes = widgetHandler.messageTypes;

            if(messageTypes && messageTypes.length)
            {
                for(let name of messageTypes)
                {
                    if(!name) continue;

                    let messages = this._widgetHandlerMessageMap.get(name);

                    if(!messages)
                    {
                        messages = [];

                        this._widgetHandlerMessageMap.set(name, messages);
                    }

                    messages.push(widgetHandler);
                }
            }

            const eventTypes = widgetHandler.eventTypes;

            eventTypes.push(RoomEngineTriggerWidgetEvent.OPEN_WIDGET, RoomEngineTriggerWidgetEvent.CLOSE_WIDGET);

            if(eventTypes && eventTypes.length)
            {
                for(let name of eventTypes)
                {
                    if(!name) continue;

                    let events = this._widgetHandlerEventMap.get(name);

                    if(!events)
                    {
                        events = [];

                        this._widgetHandlerEventMap.set(name, events);
                    }

                    events.push(widgetHandler);
                }
            }
        }

        const widget = this._roomWidgetFactory.createWidget(type, widgetHandler);

        if(!widget) return;

        widget.messageListener = this;

        widget.registerUpdateEvents(this._events);

        this._widgets.set(type, widget);

        this._layoutManager.addWidgetWindow(type, widget.mainWindow);

        if(sendSizeUpdate)
        {
            type = RoomWidgetRoomViewUpdateEvent.SIZE_CHANGED;

            this.events.dispatchEvent(new RoomWidgetRoomViewUpdateEvent(type, this.getRoomViewRect()))
        }
    }

    public processWidgetMessage(message: RoomWidgetMessage): RoomWidgetUpdateEvent
    {
        if(!message || !message.type) return null;

        const handlers = this._widgetHandlerMessageMap.get(message.type);

        if(!handlers || !handlers.length) return null;

        for(let handler of handlers)
        {
            if(!handler) continue;

            const update = handler.processWidgetMessage(message);

            if(!update) continue;

            return update;
        }

        return null;
    }

    public onMouseEvent(event: MouseEvent): void
    {
        if(!event || !this._roomEngine || !this._session) return;
        
        const x = event.clientX;
        const y = event.clientY;

        let eventType = event.type;

        if(eventType === MouseEventType.MOUSE_CLICK)
        {
            if(this._lastClick)
            {
                this._clickCount = 1;
                    
                if(this._lastClick >= Date.now() - 300) this._clickCount++;
            }

            this._lastClick = Date.now();

            if(this._clickCount === 2)
            {
                if(!this._didMouseMove) eventType = MouseEventType.DOUBLE_CLICK;

                this._clickCount    = 0;
                this._lastClick     = null;
            }
        }

        switch(eventType)
        {
            case MouseEventType.MOUSE_CLICK:
                break;
            case MouseEventType.DOUBLE_CLICK:
                break;
            case MouseEventType.MOUSE_MOVE:
                this._didMouseMove = true;
                break;
            case MouseEventType.MOUSE_DOWN:
                this._didMouseMove = false;
                break;
            case MouseEventType.MOUSE_UP:
                break;
            default: return;
        }

        this._roomEngine.setActiveRoomId(this._session.roomId);
        this._roomEngine.dispatchMouseEvent(this._canvasIDs[0], x, y, eventType, event.altKey, event.ctrlKey, event.shiftKey, false);
    }

    private onWindowResizeEvent(event: UIEvent): void
    {
        if(this._resizeTimer) clearTimeout(this._resizeTimer);

        this._resizeTimer = setTimeout(() =>
        {
            Nitro.instance.resize();

            this._roomEngine.initializeRoomInstanceRenderingCanvas(this._session.roomId, this._canvasIDs[0], Nitro.instance.renderer.view.width, Nitro.instance.renderer.view.height);

            this.events.dispatchEvent(new RoomWidgetRoomViewUpdateEvent(RoomWidgetRoomViewUpdateEvent.SIZE_CHANGED, this.getRoomViewRect()))

            this.setBackground(this.getRoomBackground());
        }, 1);
    }

    private getRoomBackground(): PIXI.Graphics
    {
        if(this._roomBackground) return this._roomBackground;

        const canvas = this._roomEngine.getRoomInstanceRenderingCanvas(this._session.roomId, this._canvasIDs[0]);

        if(!canvas) return null;

        const displayObject = canvas.displayObject as PIXI.Container;

        const background = new PIXI.Graphics();

        displayObject.addChildAt(background, 0);

        this._roomBackground = background;

        return this._roomBackground;
    }

    public setBackgroundColor(hue: number, saturation: number, lightness: number): void
    {
        this._roomBackgroundColor = ColorConverter._Str_13949(((((hue & 0xFF) << 16) + ((saturation & 0xFF) << 8)) + (lightness & 0xFF)));

        const background = this.getRoomBackground();

        if(!background) return;

        if(!hue || !saturation || !lightness)
        {
            background.visible = false;
        }
        else
        {
            background.visible = true;

            this.setBackground(background);
        }
    }

    private setBackground(graphic: PIXI.Graphics): void
    {
        if(!graphic) return;

        graphic
            .clear()
            .beginFill(this._roomBackgroundColor)
            .drawRect(0, 0, window.innerWidth, window.innerHeight)
            .endFill();
    }

    public onRoomEngineObjectEvent(event: RoomEngineObjectEvent): void
    {
        if(!event) return;

        const objectId  = event.objectId;
        const category  = event.category;

        let updateEvent: RoomWidgetRoomObjectUpdateEvent = null;

        switch(event.type)
        {
            case RoomEngineObjectEvent.SELECTED:
                if(!this.isFurnitureSelectionDisabled(event)) updateEvent = new RoomWidgetRoomObjectUpdateEvent(RoomWidgetRoomObjectUpdateEvent.OBJECT_SELECTED, objectId, category, event.roomId);
                break;
            case RoomEngineObjectEvent.DESELECTED:
                updateEvent = new RoomWidgetRoomObjectUpdateEvent(RoomWidgetRoomObjectUpdateEvent.OBJECT_DESELECTED, objectId, category, event.roomId);
                break;
            case RoomEngineObjectEvent.ADDED:
                let addedEventType: string = null;

                switch(category)
                {
                    case RoomObjectCategory.FLOOR:
                    case RoomObjectCategory.WALL:
                        addedEventType = RoomWidgetRoomObjectUpdateEvent.FURNI_ADDED;
                        break;
                    case RoomObjectCategory.UNIT:
                        addedEventType = RoomWidgetRoomObjectUpdateEvent.USER_ADDED;
                        break;
                }

                if(addedEventType) updateEvent = new RoomWidgetRoomObjectUpdateEvent(addedEventType, objectId, category, event.roomId);
                break;
            case RoomEngineObjectEvent.REMOVED:
                let removedEventType: string = null;

                switch(category)
                {
                    case RoomObjectCategory.FLOOR:
                    case RoomObjectCategory.WALL:
                        removedEventType = RoomWidgetRoomObjectUpdateEvent.FURNI_REMOVED;
                        break;
                    case RoomObjectCategory.UNIT:
                        removedEventType = RoomWidgetRoomObjectUpdateEvent.USER_REMOVED;
                        break;
                }
                
                if(removedEventType) updateEvent = new RoomWidgetRoomObjectUpdateEvent(removedEventType, objectId, category, event.roomId);
                break;
            case RoomEngineObjectEvent.MOUSE_ENTER:
                updateEvent = new RoomWidgetRoomObjectUpdateEvent(RoomWidgetRoomObjectUpdateEvent.OBJECT_ROLL_OVER, objectId, category, event.roomId);
                break;
            case RoomEngineObjectEvent.MOUSE_LEAVE:
                updateEvent = new RoomWidgetRoomObjectUpdateEvent(RoomWidgetRoomObjectUpdateEvent.OBJECT_ROLL_OUT, objectId, category, event.roomId);
                break;
            case RoomEngineObjectEvent.REQUEST_MOVE:
                if(this.checkFurniManipulationRights(event.roomId, objectId, category))
                {
                    this._roomEngine.processRoomObjectOperation(objectId, category, RoomObjectOperationType.OBJECT_MOVE);
                }
                break;
            case RoomEngineObjectEvent.REQUEST_ROTATE:
                if(this.checkFurniManipulationRights(event.roomId, objectId, category))
                {
                    this._roomEngine.processRoomObjectOperation(objectId, category, RoomObjectOperationType.OBJECT_ROTATE_POSITIVE);
                }
                break;
            case RoomEngineTriggerWidgetEvent.REQUEST_TROPHY:
                this.processWidgetMessage(new RoomWidgetFurniToWidgetMessage(RoomWidgetFurniToWidgetMessage.REQUEST_TROPHY, objectId, category, event.roomId));
                break;
            case RoomEngineTriggerWidgetEvent.OPEN_WIDGET:
            case RoomEngineTriggerWidgetEvent.CLOSE_WIDGET:
                this.processEvent(event);
                break;
        }

        if(updateEvent) this.events.dispatchEvent(updateEvent);
    }

    public processEvent(event: NitroEvent): void
    {
        if(!event || !this._widgetHandlerEventMap) return;

        const events = this._widgetHandlerEventMap.get(event.type);

        if(!events) return;

        let dispatchEvent = false;

        for(let existing of events)
        {
            if(!existing) continue;

            dispatchEvent = true;

            if((event.type === RoomEngineTriggerWidgetEvent.OPEN_WIDGET) || (event.type === RoomEngineTriggerWidgetEvent.CLOSE_WIDGET))
            {
                if(event instanceof RoomEngineTriggerWidgetEvent)
                {
                    dispatchEvent = (existing.type === event.widget);
                }
            }

            if(dispatchEvent) existing.processEvent(event);
        }
    }

    private isFurnitureSelectionDisabled(k: RoomEngineObjectEvent): boolean
    {
        let result = false;

        const roomObject = this._roomEngine.getRoomObject(k.roomId, k.objectId, k.category);

        if(roomObject)
        {
            const selectionDisabled = (roomObject.model.getValue(RoomObjectVariable.FURNITURE_SELECTION_DISABLED) === 1);

            if(selectionDisabled)
            {
                result = true;

                if(this._sessionDataManager.isModerator) result = false;
            }
        }

        return result;
    }

    public checkFurniManipulationRights(roomId: number, objectId: number, category: number): boolean
    {
        return ((this._session.controllerLevel >= RoomControllerLevel.GUEST) || (this._sessionDataManager.isModerator)) || (this.isOwnerOfFurniture(this._roomEngine.getRoomObject(roomId, objectId, category)));
    }

    public isOwnerOfFurniture(roomObject: IRoomObject): boolean
    {
        if(!roomObject || !roomObject.model) return false;

        const userId        = this._sessionDataManager.userId;
        const objectOwnerId = roomObject.model.getValue(RoomObjectVariable.FURNITURE_OWNER_ID) as number;

        return (userId === objectOwnerId);
    }

    private _Str_16862(): boolean
    {
        if(this._roomSessionManager && this._session)
        {
            this._roomSessionManager.startSession(this._session);

            return true;
        }

        return false;
    }

    public getFirstCanvasId(): number
    {
        if(this._canvasIDs && (this._canvasIDs.length > 0)) return this._canvasIDs[0];

        return 0;
    }

    public getRoomViewRect(): PIXI.Rectangle
    {
        return this._layoutManager.getRectangle();
    }

    public get events(): IEventDispatcher
    {
        return this._events;
    }

    public get connection(): IConnection
    {
        return this._connection;
    }

    public get windowManager(): INitroWindowManager
    {
        return this._windowManager;
    }

    public set windowManager(manager: INitroWindowManager)
    {
        this._windowManager = manager;
    }

    public get layoutManager(): DesktopLayoutManager
    {
        return this._layoutManager;
    }

    public set layout(template: string)
    {
        this._layoutManager.setLayout(template, this._windowManager);
    }

    public get roomEngine(): IRoomEngine
    {
        return this._roomEngine;
    }

    public set roomEngine(engine: IRoomEngine)
    {
        this._roomEngine = engine;
    }

    public get avatarRenderManager(): IAvatarRenderManager
    {
        return this._avatarRenderManager;
    }

    public set avatarRenderManager(avatarRenderManager: IAvatarRenderManager)
    {
        this._avatarRenderManager = avatarRenderManager;
    }

    public get sessionDataManager(): ISessionDataManager
    {
        return this._sessionDataManager;
    }

    public set sessionDataManager(sessionDataManager: ISessionDataManager)
    {
        this._sessionDataManager = sessionDataManager;
    }

    public get roomSession(): IRoomSession
    {
        return this._session;
    }

    public get roomSessionManager(): IRoomSessionManager
    {
        return this._roomSessionManager;
    }

    public set roomSessionManager(roomSession: IRoomSessionManager)
    {
        this._roomSessionManager = roomSession;

        this._Str_16862();
    }

    public get roomWidgetFactory(): IRoomWidgetFactory
    {
        return this._roomWidgetFactory;
    }

    public set roomWidgetFactory(widgetFactory: IRoomWidgetFactory)
    {
        this._roomWidgetFactory = widgetFactory;
    }
}