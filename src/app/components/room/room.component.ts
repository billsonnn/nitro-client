import { Component, ComponentFactoryResolver, ComponentRef, ElementRef, NgZone, OnDestroy, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { Container, filters, Rectangle, Sprite, Texture } from 'pixi.js';
import { IConnection } from '../../../client/core/communication/connections/IConnection';
import { EventDispatcher } from '../../../client/core/events/EventDispatcher';
import { IEventDispatcher } from '../../../client/core/events/IEventDispatcher';
import { NitroEvent } from '../../../client/core/events/NitroEvent';
import { IAvatarRenderManager } from '../../../client/nitro/avatar/IAvatarRenderManager';
import { Nitro } from '../../../client/nitro/Nitro';
import { RoomEngineObjectEvent } from '../../../client/nitro/room/events/RoomEngineObjectEvent';
import { RoomEngineTriggerWidgetEvent } from '../../../client/nitro/room/events/RoomEngineTriggerWidgetEvent';
import { IRoomEngine } from '../../../client/nitro/room/IRoomEngine';
import { RoomObjectCategory } from '../../../client/nitro/room/object/RoomObjectCategory';
import { RoomObjectOperationType } from '../../../client/nitro/room/object/RoomObjectOperationType';
import { RoomObjectVariable } from '../../../client/nitro/room/object/RoomObjectVariable';
import { RoomVariableEnum } from '../../../client/nitro/room/RoomVariableEnum';
import { RoomControllerLevel } from '../../../client/nitro/session/enum/RoomControllerLevel';
import { IRoomSession } from '../../../client/nitro/session/IRoomSession';
import { IRoomSessionManager } from '../../../client/nitro/session/IRoomSessionManager';
import { ISessionDataManager } from '../../../client/nitro/session/ISessionDataManager';
import { IRoomWidgetHandler } from '../../../client/nitro/ui/IRoomWidgetHandler';
import { IRoomWidgetHandlerContainer } from '../../../client/nitro/ui/IRoomWidgetHandlerContainer';
import { MouseEventType } from '../../../client/nitro/ui/MouseEventType';
import { RoomWidgetEnum } from '../../../client/nitro/ui/widget/enums/RoomWidgetEnum';
import { RoomWidgetUpdateEvent } from '../../../client/nitro/ui/widget/events/RoomWidgetUpdateEvent';
import { IRoomWidget } from '../../../client/nitro/ui/widget/IRoomWidget';
import { IRoomWidgetMessageListener } from '../../../client/nitro/ui/widget/IRoomWidgetMessageListener';
import { RoomWidgetMessage } from '../../../client/nitro/ui/widget/messages/RoomWidgetMessage';
import { IRoomObject } from '../../../client/room/object/IRoomObject';
import { ColorConverter } from '../../../client/room/utils/ColorConverter';
import { RoomGeometry } from '../../../client/room/utils/RoomGeometry';
import { RoomId } from '../../../client/room/utils/RoomId';
import { Vector3d } from '../../../client/room/utils/Vector3d';
import { RoomWidgetRoomObjectUpdateEvent } from './widgets/events/RoomWidgetRoomObjectUpdateEvent';
import { RoomWidgetRoomViewUpdateEvent } from './widgets/events/RoomWidgetRoomViewUpdateEvent';
import { AvatarInfoWidgetHandler } from './widgets/handlers/AvatarInfoWidgetHandler';
import { ChatInputWidgetHandler } from './widgets/handlers/ChatInputWidgetHandler';
import { ChatWidgetHandler } from './widgets/handlers/ChatWidgetHandler';
import { FurnitureCustomStackHeightWidgetHandler } from './widgets/handlers/FurnitureCustomStackHeightWidgetHandler';
import { FurnitureDimmerWidgetHandler } from './widgets/handlers/FurnitureDimmerWidgetHandler';
import { InfoStandWidgetHandler } from './widgets/handlers/InfoStandWidgetHandler';
import { ObjectLocationRequestHandler } from './widgets/handlers/ObjectLocationRequestHandler';

@Component({
	selector: 'nitro-room-component',
    template: `
    <div class="nitro-room-component">
        <div #roomCanvas class="room-view"></div>
        <ng-template #widgetContainer></ng-template>
    </div>`
})
export class RoomComponent implements OnDestroy, IRoomWidgetHandlerContainer, IRoomWidgetMessageListener
{
    private static COLOR_MATRIX: filters.ColorMatrixFilter = new filters.ColorMatrixFilter();

    @ViewChild('roomCanvas')
    public roomCanvasReference: ElementRef<HTMLDivElement>;

    @ViewChild('widgetContainer', { read: ViewContainerRef })
    public widgetContainer: ViewContainerRef;

    private _roomSession: IRoomSession;

    private _events: IEventDispatcher                                   = new EventDispatcher();
    private _widgets: Map<string, ComponentRef<IRoomWidget>>            = new Map();
    private _widgetHandlerMessageMap: Map<string, IRoomWidgetHandler[]> = new Map();
    private _widgetHandlerEventMap: Map<string, IRoomWidgetHandler[]>   = new Map();

    private _roomColorMatrix: filters.ColorMatrixFilter = null;
    private _roomBackground: Sprite                     = null;
    private _roomBackgroundColor: number                = 0;
    private _roomColorizerColor: number                 = 0;

    private _resizeTimer: any 		= null;
    private _didMouseMove: boolean  = false;
    private _lastClick: number      = 0;
    private _clickCount: number     = 0;
    private _lastMouseMove: number  = 0;
    private _isMouseMove: boolean   = false;

    constructor(
        private _componentFactoryResolver: ComponentFactoryResolver,
        private _ngZone: NgZone
    ) {}

    public ngOnDestroy(): void
    {
        this.endRoom();

        this._events.dispose();
    }

    public prepareRoom(session: IRoomSession): void
    {
        if(!session) return;

        const canvasId  = this.getFirstCanvasId();
        const width     = Nitro.instance.width;
        const height    = Nitro.instance.height;
        const scale     = RoomGeometry.SCALE_ZOOMED_IN;

        const displayObject = (Nitro.instance.roomEngine.getRoomInstanceDisplay(session.roomId, canvasId, width, height, scale) as Sprite);

        if(!displayObject) return;

        const geometry = (Nitro.instance.roomEngine.getRoomInstanceGeometry(session.roomId, canvasId) as RoomGeometry);

        if(geometry)
        {
            let minX = (Nitro.instance.roomEngine.getRoomInstanceVariable<number>(session.roomId, RoomVariableEnum.ROOM_MIN_X) || 0);
            let maxX = (Nitro.instance.roomEngine.getRoomInstanceVariable<number>(session.roomId, RoomVariableEnum.ROOM_MAX_X) || 0);
            let minY = (Nitro.instance.roomEngine.getRoomInstanceVariable<number>(session.roomId, RoomVariableEnum.ROOM_MIN_Y) || 0);
            let maxY = (Nitro.instance.roomEngine.getRoomInstanceVariable<number>(session.roomId, RoomVariableEnum.ROOM_MAX_Y) || 0);

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

        this._roomSession = session;

        this.insertCanvas();

        Nitro.instance.ticker.add(this.update, this);
    }

    public endRoom(): void
    {
        Nitro.instance.ticker.remove(this.update, this);

        if(this._resizeTimer)
        {
            clearTimeout(this._resizeTimer);

            this._resizeTimer = null;
        }

        for(let widget of this._widgets.values())
        {
            if(!widget) continue;

            widget.instance && widget.instance.dispose();

            this._ngZone.run(() => widget.destroy());
        }

        this._roomColorMatrix       = null;
        this._roomBackground        = null;
        this._roomBackgroundColor   = 0;
        this._roomColorizerColor    = 0;

        RoomComponent.COLOR_MATRIX.reset();
        
        this._widgets.clear();
        this._widgetHandlerMessageMap.clear();
        this._widgetHandlerEventMap.clear();
        this._events.removeAllListeners();

        this.removeCanvas();
    }

    private insertCanvas(): void
    {
        const canvas = Nitro.instance.renderer.view;

        if(!canvas) return;

        canvas.onclick          = this.onMouseEvent.bind(this);
        canvas.onmousemove      = this.onMouseEvent.bind(this);
        canvas.onmousedown      = this.onMouseEvent.bind(this);
        canvas.onmouseup        = this.onMouseEvent.bind(this);

        window.onresize = this.onWindowResizeEvent.bind(this);

        this.roomCanvasReference.nativeElement.appendChild(canvas);
    }

    private removeCanvas(): void
    {
        const canvas = Nitro.instance.renderer.view;

        if(!canvas) return;

        canvas.onclick          = null;
        canvas.onmousemove      = null;
        canvas.onmousedown      = null;
        canvas.onmouseup        = null;

        window.onresize = null;

        if(canvas.parentElement) canvas.parentElement.removeChild(canvas);
    }

    private onMouseEvent(event: MouseEvent): void
    {
        if(!event || !this._roomSession) return;
        
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

        Nitro.instance.roomEngine.setActiveRoomId(this._roomSession.roomId);
        Nitro.instance.roomEngine.dispatchMouseEvent(this.getFirstCanvasId(), x, y, eventType, event.altKey, (event.ctrlKey || event.metaKey), event.shiftKey, false);
    }

    private onWindowResizeEvent(event: UIEvent): void
    {
        if(!event || !this._roomSession) return;

        if(this._resizeTimer) clearTimeout(this._resizeTimer);

        this._resizeTimer = setTimeout(() =>
        {
            Nitro.instance.roomEngine.initializeRoomInstanceRenderingCanvas(this._roomSession.roomId, this.getFirstCanvasId(), Nitro.instance.width, Nitro.instance.height);

            this._events.dispatchEvent(new RoomWidgetRoomViewUpdateEvent(RoomWidgetRoomViewUpdateEvent.SIZE_CHANGED, this.getRoomViewRect()));

            this.setRoomBackground();
        }, 1);
    }

    public update(): void
    {
        for(let widget of this._widgets.values()) (widget.instance.widgetHandler && widget.instance.widgetHandler.update());
    }

    public createWidget(type: string, component: Type<IRoomWidget>): void
    {
        const existing = this._widgets.get(type);

        if(existing) return;

        let widgetHandler: IRoomWidgetHandler = null;

        let sendSizeUpdate = false;

        switch(type)
        {
            case RoomWidgetEnum.CHAT_WIDGET:
                sendSizeUpdate = true;

                const handler = new ChatWidgetHandler();

                handler.connection = Nitro.instance.communication.connection;

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
            case RoomWidgetEnum.ROOM_DIMMER:
                widgetHandler = new FurnitureDimmerWidgetHandler();
                break;
            case RoomWidgetEnum.CUSTOM_STACK_HEIGHT:
                widgetHandler = new FurnitureCustomStackHeightWidgetHandler();
                break;
            // case RoomWidgetEnum.FURNI_TROPHY_WIDGET:
            //     widgetHandler = new FurnitureTrophyWidgetHandler();
            //     break;
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

        if(!component) return;

        let widgetRef: ComponentRef<IRoomWidget>    = null;
        let widget: IRoomWidget                     = null;

        this._ngZone.run(() =>
        {
            const componentFactory = this._componentFactoryResolver.resolveComponentFactory(component);

            widgetRef   = this.widgetContainer.createComponent(componentFactory);
            widget      = (widgetRef.instance as IRoomWidget);
        });

        if(!widget) return;

        widget.widgetHandler    = widgetHandler;
        widget.messageListener  = this;

        widget.registerUpdateEvents(this._events);

        this._widgets.set(type, widgetRef);

        if(sendSizeUpdate) this._events.dispatchEvent(new RoomWidgetRoomViewUpdateEvent(RoomWidgetRoomViewUpdateEvent.SIZE_CHANGED, this.getRoomViewRect()));
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
                    Nitro.instance.roomEngine.processRoomObjectOperation(objectId, category, RoomObjectOperationType.OBJECT_MOVE);
                }
                break;
            case RoomEngineObjectEvent.REQUEST_ROTATE:
                if(this.checkFurniManipulationRights(event.roomId, objectId, category))
                {
                    Nitro.instance.roomEngine.processRoomObjectOperation(objectId, category, RoomObjectOperationType.OBJECT_ROTATE_POSITIVE);
                }
                break;
            case RoomEngineTriggerWidgetEvent.OPEN_WIDGET:
            case RoomEngineTriggerWidgetEvent.CLOSE_WIDGET:
            case RoomEngineTriggerWidgetEvent.OPEN_FURNI_CONTEXT_MENU:
            case RoomEngineTriggerWidgetEvent.CLOSE_FURNI_CONTEXT_MENU:
            case RoomEngineTriggerWidgetEvent.REMOVE_DIMMER:
            case RoomEngineTriggerWidgetEvent.REQUEST_MANNEQUIN:
            //case RoomEngineUseProductEvent.ROSM_USE_PRODUCT_FROM_INVENTORY:
            //case RoomEngineUseProductEvent.ROSM_USE_PRODUCT_FROM_ROOM:
            case RoomEngineTriggerWidgetEvent.REQUEST_BACKGROUND_COLOR:
            case RoomEngineTriggerWidgetEvent.REQUEST_FRIEND_FURNITURE_ENGRAVING:
            case RoomEngineTriggerWidgetEvent.REQUEST_HIGH_SCORE_DISPLAY:
            case RoomEngineTriggerWidgetEvent.REQUEST_HIDE_HIGH_SCORE_DISPLAY:
            case RoomEngineTriggerWidgetEvent.REQUEST_INTERNAL_LINK:
            case RoomEngineTriggerWidgetEvent.REQUEST_ROOM_LINK:
                this.processEvent(event);
                break;
        }

        if(updateEvent)
        {
            let dispatchEvent = true;

            if(updateEvent instanceof RoomWidgetRoomObjectUpdateEvent) dispatchEvent = (!RoomId.isRoomPreviewerId(updateEvent.roomId));

            if(dispatchEvent) this._events.dispatchEvent(updateEvent);
        }
    }

    private isFurnitureSelectionDisabled(k: RoomEngineObjectEvent): boolean
    {
        let result = false;

        const roomObject = Nitro.instance.roomEngine.getRoomObject(k.roomId, k.objectId, k.category);

        if(roomObject)
        {
            const selectionDisabled = (roomObject.model.getValue<number>(RoomObjectVariable.FURNITURE_SELECTION_DISABLED) === 1);

            if(selectionDisabled)
            {
                result = true;

                if(Nitro.instance.sessionDataManager.isModerator) result = false;
            }
        }

        return result;
    }

    public checkFurniManipulationRights(roomId: number, objectId: number, category: number): boolean
    {
        return ((this._roomSession.controllerLevel >= RoomControllerLevel.GUEST) || (Nitro.instance.sessionDataManager.isModerator)) || (this.isOwnerOfFurniture(Nitro.instance.roomEngine.getRoomObject(roomId, objectId, category)));
    }

    public isOwnerOfFurniture(roomObject: IRoomObject): boolean
    {
        if(!roomObject || !roomObject.model) return false;

        const userId        = Nitro.instance.sessionDataManager.userId;
        const objectOwnerId = roomObject.model.getValue<number>(RoomObjectVariable.FURNITURE_OWNER_ID);

        return (userId === objectOwnerId);
    }

    public _Str_2485(event: NitroEvent):void
    {
        if(!event || !this._widgetHandlerEventMap) return;

        const events = this._widgetHandlerEventMap.get(event.type);

        if(events && events.length)
        {
            let processEvent = true;

            for(let widgetEvent of events)
            {
                if((event.type === RoomEngineTriggerWidgetEvent.OPEN_WIDGET) || (RoomEngineTriggerWidgetEvent.CLOSE_WIDGET))
                {
                    if(event instanceof RoomEngineTriggerWidgetEvent)
                    {
                        processEvent = (widgetEvent.type === event.widget);
                    }
                }

                if(processEvent) widgetEvent.processEvent(event);
            }
        }
    }

    private getRoomBackground(): Sprite
    {
        if(this._roomBackground) return this._roomBackground;

        const canvas = this.roomEngine.getRoomInstanceRenderingCanvas(this.roomSession.roomId, this.getFirstCanvasId());

        if(!canvas) return null;

        const displayObject = (canvas.master as Container);
        const background    = new Sprite(Texture.WHITE);

        displayObject.addChildAt(background, 0);

        this._roomBackground = background;

        return this._roomBackground;
    }

    private getRoomColorizer(): filters.ColorMatrixFilter
    {
        if(this._roomColorMatrix) return this._roomColorMatrix;

        const canvas = this.roomEngine.getRoomInstanceRenderingCanvas(this.roomSession.roomId, this.getFirstCanvasId());

        if(!canvas) return null;

        const display = canvas.display;

        if(!display) return null;

        this._roomColorMatrix = RoomComponent.COLOR_MATRIX;

        display.filters = [ this._roomColorMatrix ];

        return this._roomColorMatrix;
    }

    public setRoomBackgroundColor(hue: number, saturation: number, lightness: number): void
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

            this.setRoomBackground();
        }
    }

    public setRoomColorizerColor(color: number, brightness: number): void
    {
        this._roomColorizerColor = ColorConverter._Str_13949(((ColorConverter._Str_22130(color) & 0xFFFF00) + brightness));

        this.setRoomColorizer();
    }

    private setRoomBackground(): void
    {
        const background = this.getRoomBackground();

        if(!background) return;

        background.tint     = this._roomBackgroundColor;
        background.width    = Nitro.instance.width;
        background.height   = Nitro.instance.height;
    }

    private setRoomColorizer(): void
    {
        const colorMatrix = this.getRoomColorizer();

        if(!colorMatrix) return;

        const r = (this._roomColorizerColor >> 16 & 0xFF);
        const g = (this._roomColorizerColor >> 8 & 0xFF);
        const b = (this._roomColorizerColor & 0xFF);

        colorMatrix.matrix[0]   = (r / 255);
        colorMatrix.matrix[6]   = (g / 255);
        colorMatrix.matrix[12]  = (b / 255);
    }

    public getFirstCanvasId(): number
    {
        return 1;
    }

    public getRoomViewRect(): Rectangle
    {
        const bounds = this.roomCanvasReference.nativeElement.getBoundingClientRect();

        return new Rectangle((bounds.x || 0), (bounds.y || 0), (bounds.width || 0), (bounds.height || 0));
    }

    public get events(): IEventDispatcher
    {
        return this._events;
    }

    public get connection(): IConnection
    {
        return Nitro.instance.communication.connection;
    }

    public get roomEngine(): IRoomEngine
    {
        return Nitro.instance.roomEngine;
    }

    public get avatarRenderManager(): IAvatarRenderManager
    {
        return Nitro.instance.avatar;
    }

    public get roomSessionManager(): IRoomSessionManager
    {
        return Nitro.instance.roomSessionManager;
    }

    public get sessionDataManager(): ISessionDataManager
    {
        return Nitro.instance.sessionDataManager;
    }

    public get roomSession(): IRoomSession
    {
        return this._roomSession;
    }
}