import { IDisposable } from '../../../../core/common/disposable/IDisposable';
import { FixedSizeStack } from '../../../utils/FixedSizeStack';
import { IContextMenuParentWidget } from './IContextMenuParentWidget';

export class ContextInfoView implements IDisposable
{
    private static _Str_18514: number   = 25;
    private static _Str_14408: number   = 3;

    protected static _Str_3452: boolean = false;

    protected _parent: IContextMenuParentWidget;
    protected _stack: FixedSizeStack;
    protected _Str_3403: boolean;
    protected _Str_14625: boolean;
    protected _Str_22193: number;
    protected _opacity: number;
    protected _Str_5321: number;
    protected _Str_18538: number;

    protected _fadeStartDelay: number;
    protected _isFading: boolean;
    protected _fadeTimer: any;

    protected _window: HTMLElement;
    protected _activeView: HTMLElement;
    
    private _Str_16285: boolean;
    private _disposed: boolean;

    constructor(parent: IContextMenuParentWidget)
    {
        this._parent            = parent;
        this._stack             = new FixedSizeStack(ContextInfoView._Str_18514);
        this._Str_3403          = true;
        this._Str_14625         = false;
        this._Str_22193         = 500;
        this._opacity           = 0;
        this._Str_5321          = 0;
        this._Str_18538         = -1000000;

        this._fadeStartDelay    = 3000;
        this._isFading          = false;
        this._fadeTimer         = null;

        this._window            = null;
        this._activeView        = null;

        this._Str_16285         = false;
        this._disposed          = false;
    }

    public static render(view: ContextInfoView): void
    {
        view._Str_14625 = false;
        view._Str_22193 = 75;
        view._isFading = false;
        view._opacity = 1;

        if(view._Str_3403)
        {
            if(view._fadeTimer)
            {
                clearTimeout(view._fadeTimer);

                view._fadeTimer = null;
            }

            view._fadeTimer = setTimeout(view.onTimerComplete.bind(view), view._fadeStartDelay);
        }

        view.updateWindow();
    }

    public dispose(): void
    {
        if(this.disposed) return;

        this._parent        = null;
        this._activeView    = null;

        if(this._window)
        {
            if(this._window.parentElement) this._window.parentElement.removeChild(this._window);

            this._window = null;
        }

        if(this._fadeTimer)
        {
            clearTimeout(this._fadeTimer);

            this._fadeTimer = null;
        }

        this._disposed = true;
    }

    public update(rectangle: PIXI.Rectangle, point: PIXI.Point, time: number): void
    {
        if(!rectangle) return;

        if(!this._activeView) this.updateWindow();

        if(this._isFading)
        {
            this._Str_5321  = (this._Str_5321 + time);
            this._opacity   = ((1 - (this._Str_5321 / this._Str_22193)) * this.maximumOpacity);
        }
        else
        {
            this._opacity = this.maximumOpacity;
        }

        if(this._opacity <= 0)
        {
            this._parent.removeView(this, false);

            return;
        }

        const offset = this.getOffset(rectangle);

        let _local_5 = (point.y - rectangle.top);

        this._stack._Str_22775(_local_5);

        let _local_6 = this._stack._Str_25797();

        if(_local_6 < (this._Str_18538 - ContextInfoView._Str_14408))
        {
            _local_6 = (this._Str_18538 - ContextInfoView._Str_14408);
        }

        let _local_7 = (point.y - _local_6);

        this._Str_18538 = _local_6;

        this._activeView.style.left = (Math.round(point.x - (this._activeView.offsetWidth / 2)) + 'px');
        this._activeView.style.top  = ((Math.round(_local_7 + offset)) + 'px');

        this._activeView.style.opacity = this._opacity.toString();

        this.show();
    }

    public show(): void
    {
        if(!this._activeView) return;

        if(!this._activeView.parentElement)
        {
            this._parent.windowManager.getDesktop().appendChild(this._activeView);
        }

        this._activeView.style.visibility = 'visible';
    }

    public hide(k: boolean): void
    {
        if(this._activeView)
        {
            if(!this._Str_14625 && k)
            {
                this._Str_14625 = true;

                if(this._fadeTimer)
                {
                    clearTimeout(this._fadeTimer);

                    this._fadeTimer = null;
                }

                this._fadeTimer = setTimeout(this.onTimerComplete.bind(this), this._fadeStartDelay);
            }
            else
            {
                this._activeView.style.visibility = 'hidden';

                if(this._activeView.parentElement) this._activeView.parentElement.removeChild(this._activeView);
            }
        }
    }

    private onTimerComplete(): void
    {
        this._isFading = true;
        
        this.hide(true);
    }

    protected updateWindow(): void
    {
        
    }

    protected getOffset(k: PIXI.Rectangle): number
    {
        var _local_2: number = -(this._activeView.offsetHeight);

        _local_2 = (_local_2 - 4);

        return _local_2;
    }

    public get activeView(): HTMLElement
    {
        return this._activeView;
    }

    public set activeView(view: HTMLElement)
    {
        if(!view) return;

        if(this._activeView)
        {
            this._activeView.parentElement.removeChild(this._activeView);
        }

        this._activeView = view;
    }

    public get maximumOpacity(): number
    {
        return 1;
    }

    public get disposed(): boolean
    {
        return this._disposed;
    }
}