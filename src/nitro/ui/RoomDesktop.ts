import { IConnection } from '../../core/communication/connections/IConnection';
import { EventDispatcher } from '../../core/events/EventDispatcher';
import { IRoomObject } from '../../room/object/IRoomObject';
import { ColorConverter } from '../../room/utils/ColorConverter';
import { RoomGeometry } from '../../room/utils/RoomGeometry';
import { Vector3d } from '../../room/utils/Vector3d';
import { NitroInstance } from '../NitroInstance';
import { RoomEngineObjectEvent } from '../room/events/RoomEngineObjectEvent';
import { IRoomEngine } from '../room/IRoomEngine';
import { RoomObjectOperationType } from '../room/object/RoomObjectOperationType';
import { RoomObjectVariable } from '../room/object/RoomObjectVariable';
import { RoomVariableEnum } from '../room/RoomVariableEnum';
import { RoomControllerLevel } from '../session/enum/RoomControllerLevel';
import { IRoomSession } from '../session/IRoomSession';
import { IRoomSessionManager } from '../session/IRoomSessionManager';
import { ISessionDataManager } from '../session/ISessionDataManager';
import { MouseEventType } from './MouseEventType';

export class RoomDesktop
{
    public static _Str_8876: number = -1;
    
    private static _Str_17829: number = 1000;
    private static _Str_19484: number = 1000;

    private _events: EventDispatcher;
    private _session: IRoomSession;
    private _connection: IConnection;
    private _roomEngine: IRoomEngine;
    private _sessionData: ISessionDataManager;
    private _roomSession: IRoomSessionManager;
    private _canvasIDs: number[];

    private _didMouseMove: boolean;
    private _lastClick: number;
    private _clickCount: number;

    private _roomBackground: PIXI.Graphics;
    private _roomBackgroundColor: number;

    private _resizeTimer: any;

    constructor(roomSession: IRoomSession, connection: IConnection)
    {
        this._events                = new EventDispatcher();
        this._session               = roomSession;
        this._connection            = connection;
        this._roomEngine            = null;
        this._sessionData           = null;
        this._roomSession           = null;
        this._canvasIDs             = [];

        this._didMouseMove          = false;
        this._lastClick             = 0;
        this._clickCount            = 0;

        this._roomBackground        = null;
        this._roomBackgroundColor   = 0;

        this._resizeTimer           = null;
    }

    public dispose(): void
    {
        if(this._resizeTimer)
        {
            clearTimeout(this._resizeTimer);

            this._resizeTimer = null;
        }

        window.onresize = null;
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

        const stage = NitroInstance.instance.renderer.stage;

        if(!stage) return;

        stage.addChild(displayObject);

        displayObject.interactive = true;

        displayObject.addListener(MouseEventType.MOUSE_CLICK, this._Str_9634.bind(this));
        displayObject.addListener(MouseEventType.MOUSE_MOVE, this._Str_9634.bind(this));
        displayObject.addListener(MouseEventType.MOUSE_DOWN, this._Str_9634.bind(this));
        displayObject.addListener(MouseEventType.MOUSE_UP, this._Str_9634.bind(this));
        displayObject.addListener(MouseEventType.MOUSE_UP_OUTSIDE, this._Str_9634.bind(this));

        window.onresize = this.onWindowResizeEvent.bind(this);

        this._canvasIDs.push(canvasId);
    }

    public _Str_9634(event: PIXI.interaction.InteractionEvent):void
    {
        if(!event || !this._roomEngine || !this._session) return;

        const displayObject = event.target;

        if(!displayObject) return;

        const mouseEvent    = event.data.originalEvent as MouseEvent;
        const x             = mouseEvent.clientX;
        const y             = mouseEvent.clientY;

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
            case MouseEventType.MOUSE_UP_OUTSIDE:
                break;
            default: return;
        }

        this._roomEngine.dispatchMouseEvent(this._canvasIDs[0], x, y, eventType, mouseEvent.altKey, mouseEvent.ctrlKey, mouseEvent.shiftKey, false);
    }

    private onWindowResizeEvent(event: UIEvent): void
    {
        if(this._resizeTimer) clearTimeout(this._resizeTimer);

        this._resizeTimer = setTimeout(() =>
        {
            this._roomEngine.initializeRoomInstanceRenderingCanvas(this._session.roomId, this._canvasIDs[0], window.innerWidth, window.innerHeight);

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

    public setBackgroundColor(hue: number, saturation: number, lightness: number):void
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

        graphic.clear();
        graphic.beginFill(this._roomBackgroundColor);
        graphic.drawRect(0, 0, window.innerWidth, window.innerHeight);
        graphic.endFill();
    }

    public onRoomEngineObjectEvent(event: RoomEngineObjectEvent): void
    {
        if(!event) return;

        const objectId  = event.objectId;
        const category  = event.category;

        switch(event.type)
        {
            case RoomEngineObjectEvent.REQUEST_MOVE:
                if(this._Str_21292(event.roomId, objectId, category))
                {
                    this._roomEngine.processRoomObjectOperation(objectId, category, RoomObjectOperationType.OBJECT_MOVE);
                }
                break;
            case RoomEngineObjectEvent.REQUEST_ROTATE:
                if(this._Str_21292(event.roomId, objectId, category))
                {
                    this._roomEngine.processRoomObjectOperation(objectId, category, RoomObjectOperationType.OBJECT_ROTATE_POSITIVE);
                }
                break;
        }
    }

    private _Str_21292(k: number, _arg_2: number, _arg_3: number): boolean
    {
        return ((this._session.controllerLevel >= RoomControllerLevel.GUEST) || (this._sessionData.isModerator)) || (this.isOwnerOfFurniture(this._roomEngine.getRoomObject(k, _arg_2, _arg_3)));
    }

    private isOwnerOfFurniture(roomObject: IRoomObject): boolean
    {
        if(!roomObject || !roomObject.model) return false;

        const userId        = this._sessionData.userId;
        const objectOwnerId = roomObject.model.getValue(RoomObjectVariable.FURNITURE_OWNER_ID) as number;

        return (userId === objectOwnerId);
    }

    public get roomEngine(): IRoomEngine
    {
        return this._roomEngine;
    }

    public set roomEngine(engine: IRoomEngine)
    {
        this._roomEngine = engine;
    }

    public get sessionData(): ISessionDataManager
    {
        return this._sessionData;
    }

    public set sessionData(sessionData: ISessionDataManager)
    {
        this._sessionData = sessionData;
    }

    public get roomSession(): IRoomSessionManager
    {
        return this._roomSession;
    }

    public set roomSession(roomSession: IRoomSessionManager)
    {
        this._roomSession = roomSession;
    }
}