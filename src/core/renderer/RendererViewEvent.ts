import { NitroEvent } from '../events/NitroEvent';

export class RendererViewEvent extends NitroEvent
{
    public static RESIZE: string        = 'resize';
    public static CLICK: string         = 'click';
    public static MOUSE_MOVE: string    = 'mousemove';
    public static MOUSE_DOWN: string    = 'mousedown';
    public static MOUSE_UP: string      = 'mouseup';

    private _originalEvent: Event;

    constructor(type: string, originalEvent: Event = null)
    {
        super(type);

        this._originalEvent = event;
    }

    public get originalEvent(): Event
    {
        return this._originalEvent;
    }
}