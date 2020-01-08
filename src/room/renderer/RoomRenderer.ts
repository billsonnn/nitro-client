import * as PIXI from 'pixi.js-legacy';
import { DisposableContainer } from '../../core/common/disposable/DisposableContainer';
import { NitroInstance } from '../../nitro/NitroInstance';
import { RoomObjectCategory } from '../../nitro/room/object/RoomObjectCategory';
import { RoomVisualization } from '../../nitro/room/object/visualization/room/RoomVisualization';
import { RoomEngine } from '../../nitro/room/RoomEngine';
import { RoomObjectEventHandler } from '../../nitro/room/RoomObjectEventHandler';
import { RoomObjectMouseEvent } from '../events/RoomObjectMouseEvent';
import { IRoomInstance } from '../IRoomInstance';
import { IRoomObjectController } from '../object/IRoomObjectController';
import { Position } from '../utils/Position';
import { ICollision } from './ICollision';
import { IRoomCollision } from './IRoomCollision';
import { IRoomRenderer } from './IRoomRenderer';
import { RoomCollision } from './RoomCollision';

export class RoomRenderer extends DisposableContainer implements IRoomRenderer
{
    private _eventHandler: RoomObjectEventHandler;
    private _instance: IRoomInstance;
    private _collision: IRoomCollision;

    private _roomObject: IRoomObjectController;
    private _selectedPosition: Position;
    private _selectedCollision: ICollision;

    private _isMouseDown: boolean;
    private _didMouseMove: boolean;

    private _lastClick: number;
    private _clickCount: number;

    constructor(eventHandler: RoomObjectEventHandler, roomInstance: IRoomInstance)
    {
        super();

        this._eventHandler          = eventHandler;
        this._instance              = roomInstance;
        this._collision             = null;

        this._roomObject            = null;
        this._selectedPosition      = null;
        this._selectedCollision     = null;

        this._isMouseDown           = false;
        this._didMouseMove          = false;

        this._lastClick             = 0;
        this._clickCount            = 0;

        this.sortableChildren       = true;
        this.interactiveChildren    = false;

        this.setupCollision();
    }

    protected onDispose(): void
    {
        if(this._collision)
        {
            this._collision.destroy();

            this._collision = null;
        }
    }

    public zoomIn(): void
    {
        this.scale.set(this.scale.x + 1);
    }

    public zoomOut(): void
    {
        this.scale.set(this.scale.x - 1 < 1 ? 1 : this.scale.x - 1);
    }

    private setupCollision(): void
    {
        if(this._collision) return;

        this._collision = new RoomCollision();

        this.addChild(this._collision);
    }

    public resize(event: UIEvent): void
    {
        const object = this._instance.getObject(RoomEngine.ROOM_OBJECT_ID, RoomObjectCategory.ROOM);

        if(!object) return;

        const container = object.visualization && object.visualization.selfContainer;

        if(!container) return;

        this.x = ~~((container.width / 2) + ((window.innerWidth - container.width) / 2) + 17);
        this.y = ~~((window.innerHeight - container.height) / 3);
    }

    public mouseMove(event: MouseEvent): void
    {
        if(!event) return;

        const point = new PIXI.Point(event.clientX, event.clientY);

        this._didMouseMove = true;

        document.body.style.cursor = 'default';

        this.setMouseLocation(point);

        this.dispatchMouseEvent(event, RoomObjectMouseEvent.MOUSE_MOVE, point);
    }

    public mouseDown(event: MouseEvent): void
    {
        if(!event) return;

        const point = new PIXI.Point(event.clientX, event.clientY);

        this._didMouseMove = false;

        this._isMouseDown = true;

        this.dispatchMouseEvent(event, RoomObjectMouseEvent.MOUSE_DOWN, point);

        if(event.altKey || event.ctrlKey || event.shiftKey) NitroInstance.instance.renderer.toggleDrag();
    }

    public mouseUp(event: MouseEvent): void
    {
        if(!event) return;

        const point = new PIXI.Point(event.clientX, event.clientY);

        this._isMouseDown = false;

        this.dispatchMouseEvent(event, RoomObjectMouseEvent.MOUSE_UP, point);
    }

    public click(event: MouseEvent): void
    {
        let isDouble = false;
            
        if(this._lastClick)
        {
            this._clickCount = 1;
                
            if(this._lastClick >= Date.now() - 300) this._clickCount++;
        }

        this._lastClick = Date.now();

        if(this._clickCount === 2)
        {
            if(!this._didMouseMove) isDouble = true;

            this._clickCount = 0;
            this._lastClick = null;
        }

        const point = new PIXI.Point(event.clientX, event.clientY);

        if(isDouble)
        {
            this.dispatchMouseEvent(event, RoomObjectMouseEvent.DOUBLE_CLICK, point);

            return;
        }

        this.dispatchMouseEvent(event, RoomObjectMouseEvent.CLICK, point);
    }

    private dispatchMouseEvent(event: MouseEvent, type: string, point: PIXI.Point): void
    {
        if(!type || !point || !this._eventHandler) return;

        this._eventHandler.handleRoomObjectEvent(this.createMouseEvent(event, type, point, this._selectedCollision));
    }

    public createMouseEvent(event: MouseEvent, type: string, point: PIXI.Point, collision: ICollision): RoomObjectMouseEvent
    {
        if(!event || !type || !point) return null;
        
        return new RoomObjectMouseEvent(type, collision || null, point, this._selectedPosition || null, event.altKey, event.ctrlKey, event.shiftKey);
    }

    private setMouseLocation(point: PIXI.Point): void
    {
        if(!point) return;

        this._selectedPosition = this.getPositionForPoint(point);

        this.findCollision(point);
    }

    private findCollision(point: PIXI.Point): void
    {        
        this.setCollision(this._collision.findCollision(point));
    }

    private setCollision(collision: ICollision): void
    {
        if(!collision)
        {
            this._selectedCollision = null;

            return;
        }

        if(this._selectedCollision === collision) return;

        this._selectedCollision = collision;
    }

    private getPositionForPoint(point: PIXI.Point): Position
    {
        if(!this._roomObject)
        {
            this._roomObject = this._instance.getObject(RoomEngine.ROOM_OBJECT_ID, RoomObjectCategory.ROOM);
        }

        if(!this._roomObject) return null;

        const visualization = this._roomObject.visualization as RoomVisualization;

        if(!visualization) return null;
        
        return visualization.getPositionForPoint(new PIXI.Point(point.x, point.y), this.scale.x);
    }

    public get collision(): IRoomCollision
    {
        return this._collision;
    }
}