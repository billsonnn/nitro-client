import * as PIXI from 'pixi.js-legacy';
import { DisposableContainer } from '../../core/common/disposable/DisposableContainer';
import { RoomTile } from '../../nitro/room/object/visualization/room/tile/RoomTile';
import { IRoomObjectController } from '../object/IRoomObjectController';
import { IRoomCollision } from './IRoomCollision';
import { IRoomRenderer } from './IRoomRenderer';
import { RoomCollision } from './RoomCollision';

export class RoomRenderer extends DisposableContainer implements IRoomRenderer
{
    private _collision: IRoomCollision;

    private _selectedTile: RoomTile;
    private _selectedCollision: PIXI.DisplayObject;
    private _selectedObject: IRoomObjectController;

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
        this._selectedObject        = null;

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

    private setupCollision(): void
    {
        if(this._collision) return;

        this._collision = new RoomCollision();

        this.addChild(this._collision);
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

    private onKeyDown(code: number): void
    {
        switch(code)
        {
            case 16: this._isShiftDown  = true; return;
            case 17: this._isCtrlDown   = true; return;
            case 18: this._isAltDown    = true; return;
            //case 107: this.zoomIn(); break;
            //case 109: this.zoomOut(); break;
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

    public get collision(): IRoomCollision
    {
        return this._collision;
    }
}