import * as PIXI from 'pixi.js-legacy';
import { DisposableContainer } from '../../core/common/disposable/DisposableContainer';
import { RoomTile } from '../../nitro/room/object/visualization/room/tile/RoomTile';
import { NitroConfiguration } from '../../NitroConfiguration';
import { ICollision } from './ICollision';
import { IRoomCollision } from './IRoomCollision';
import { IRoomRenderer } from './IRoomRenderer';
import { RoomCollision } from './RoomCollision';

export class RoomRenderer extends DisposableContainer implements IRoomRenderer
{
    private _collision: IRoomCollision;

    private _selectedTile: RoomTile;
    private _selectedCollision: ICollision;

    private _isMouseDown: boolean;
    private _isShiftDown: boolean;
    private _isCtrlDown: boolean;
    private _isAltDown: boolean;

    private _lastClick: number;
    private _clickCount: number;

    private _pressedKeys: { [index: number]: boolean };
    private _releasedKeys: { [index: number]: number };
    private _didMouseMove: boolean;

    constructor()
    {
        super();

        this._collision             = null;

        this._selectedTile          = null;
        this._selectedCollision     = null;

        this._isMouseDown           = false;
        this._isShiftDown           = false;
        this._isCtrlDown            = false;
        this._isAltDown             = false;

        this._lastClick             = 0;
        this._clickCount            = 0;

        this._pressedKeys           = {};
        this._releasedKeys          = {};
        this._didMouseMove          = false;

        this.setupCollision();

        this.sortableChildren       = true;
        this.interactiveChildren    = false;
    }

    protected onDispose(): void
    {
        
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

    public mouseMove(event: MouseEvent): void
    {
        if(!event) return;

        const point = new PIXI.Point(event.clientX, event.clientY);

        this._didMouseMove = true;

        this.onMouseMove(point);
    }

    public mouseDown(event: MouseEvent): void
    {
        if(!event) return;

        const point = new PIXI.Point(event.clientX, event.clientY);

        this._didMouseMove = false;

        this.onMouseDown(point);
    }

    public mouseUp(event: MouseEvent): void
    {
        if(!event) return;

        const point = new PIXI.Point(event.clientX, event.clientY);

        this.onMouseUp(point);
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

        console.log(point);
    }

    public keyDown(event: KeyboardEvent): void
    {
        if(!event) return;

        const code = event.keyCode;

        const time = new Date().getTime();

        const released = this._releasedKeys[code];

        if(released && time < released + 100) return;

        this._pressedKeys[code] = true;

        this.onKeyDown(code);
    }

    public keyUp(event: KeyboardEvent): void
    {
        if(!event) return;

        const code = event.keyCode;

        delete this._pressedKeys[code];

        this._releasedKeys[code] = new Date().getTime();

        this.onKeyUp(code);
    }

    private onMouseMove(point: PIXI.Point): void
    {
        document.body.style.cursor = 'default';

        this.setMouseLocation(point);
    }

    private onMouseDown(point: PIXI.Point): void
    {
        this._isMouseDown = true;
    }

    private onMouseUp(point: PIXI.Point): void
    {
        this._isMouseDown = false;
    }

    private onKeyDown(code: number): void
    {
        switch(code)
        {
            case 16: this._isShiftDown  = true; return;
            case 17: this._isCtrlDown   = true; return;
            case 18: this._isAltDown    = true; return;
            case 107: this.zoomIn(); break;
            case 109: this.zoomOut(); break;
        }
    }

    private onKeyUp(code: number): void
    {
        switch(code)
        {
            case 16: this._isShiftDown  = false; return;
            case 17: this._isCtrlDown   = false; return;
            case 18: this._isAltDown    = false; return;
        }
    }

    private setMouseLocation(point: PIXI.Point): void
    {
        if(!point) return;

        let tile: RoomTile = null;

        const hoverLocation = new PIXI.Point(point.x - NitroConfiguration.TILE_WIDTH, point.y);

        if(tile)
        {
            this._selectedTile = tile;

            //if(this._selectedObject || !this._isMouseDown) this.hoverSelectedTile();
        }
        else
        {
            this._selectedTile = null;

            //this._room.mapManager.tileCursor.visible = false;
        }

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

    public get collision(): IRoomCollision
    {
        return this._collision;
    }
}