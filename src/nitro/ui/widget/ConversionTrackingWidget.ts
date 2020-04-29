import { IEventDispatcher } from '../../../core/events/IEventDispatcher';
import { INitroWindowManager } from '../../window/INitroWindowManager';
import { IRoomWidgetHandler } from '../IRoomWidgetHandler';
import { IRoomWidget } from './IRoomWidget';
import { IRoomWidgetMessageListener } from './IRoomWidgetMessageListener';

export class ConversionTrackingWidget implements IRoomWidget 
{
    protected _widgetHandler: IRoomWidgetHandler;
    protected _windowManager: INitroWindowManager;

    private _messageListener: IRoomWidgetMessageListener;
    private _Str_759: IEventDispatcher;
    private _disposed: boolean;

    constructor(handler: IRoomWidgetHandler, windowManager: INitroWindowManager)
    {
        this._widgetHandler     = handler;
        this._windowManager     = windowManager;

        this._messageListener   = null;
        this._Str_759           = null;
        this._disposed          = false;
    }

    public initialize(k: number = 0):void
    {

    }

    public dispose():void
    {
        if(this.disposed) return;

        this._messageListener = null;

        if(this._Str_759 && !this._Str_759.disposed) this.unregisterUpdateEvents(this._Str_759);

        if (((!(this._Str_759 == null)) && (!(this._Str_759.disposed))))
        {
            this.unregisterUpdateEvents(this._Str_759);
        }

        if(this._widgetHandler)
        {
            this._widgetHandler.dispose();

            this._widgetHandler = null;
        }

        this._Str_759   = null;
        this._disposed  = true;
    }

    public registerUpdateEvents(eventDispatcher: IEventDispatcher):void
    {
        this._Str_759 = eventDispatcher;
    }

    public unregisterUpdateEvents(eventDispatcher: IEventDispatcher):void
    {
    }

    public get disposed(): boolean
    {
        return this._disposed;
    }

    public get windowManager(): INitroWindowManager
    {
        return this._windowManager;
    }

    public get messageListener(): IRoomWidgetMessageListener
    {
        return this._messageListener;
    }

    public set messageListener(listener: IRoomWidgetMessageListener)
    {
        this._messageListener = listener;
    }

    public get state(): number
    {
        return 0;
    }
}