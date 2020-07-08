import { IDisposable } from '../../../../core/common/disposable/IDisposable';
import { FixedSizeStack } from '../../../utils/FixedSizeStack';
import { IContextMenuParentWidget } from './IContextMenuParentWidget';

export class ContextInfoView implements IDisposable
{
    private static LOCATION_STACK_SIZE: number  = 25;
    private static BUBBLE_DROP_SPEED: number    = 3;
    private static SPACE_AROUND_EDGES: number   = 5;

    protected static _isMinimized: boolean = false;

    protected _window: HTMLElement;
    protected _activeView: HTMLElement;
    protected _parent: IContextMenuParentWidget;

    protected _stack: FixedSizeStack;
    protected _opacity: number;
    protected _currentDeltaY: number;

    protected _firstFadeStarted: boolean;
    protected _fadeAfterDelay: boolean;
    protected _fadeLength: number;
    protected _fadeTime: number;
    protected _fadeStartDelay: number;
    protected _fadingOut: boolean;
    protected _fadeStartTimer: any;
    
    private _forcedPositionUpdate: boolean;
    private _disposed: boolean;

    constructor(parent: IContextMenuParentWidget)
    {
        this._window                = null;
        this._activeView            = null;
        this._parent                = parent;

        this._stack                 = new FixedSizeStack(ContextInfoView.LOCATION_STACK_SIZE);
        this._opacity               = 0;
        this._currentDeltaY         = -1000000;

        this._firstFadeStarted      = false;
        this._fadeAfterDelay        = true;
        this._fadeLength            = 500;
        this._fadeTime              = 0;
        this._fadeStartDelay        = 3000;
        this._fadingOut             = false;
        this._fadeStartTimer        = null;

        this._forcedPositionUpdate  = false;
        this._disposed              = false;
    }

    public static render(view: ContextInfoView): void
    {
        view._firstFadeStarted  = false;
        view._fadeLength        = 75;
        view._fadingOut         = false;
        view._opacity           = 1;

        if(view._fadeAfterDelay)
        {
            if(view._fadeStartTimer)
            {
                clearTimeout(view._fadeStartTimer);

                view._fadeStartTimer = null;
            }

            view._fadeStartTimer = setTimeout(view.onTimerComplete.bind(view), view._fadeStartDelay);
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

        if(this._fadeStartTimer)
        {
            clearTimeout(this._fadeStartTimer);

            this._fadeStartTimer = null;
        }

        this._disposed = true;
    }

    public update(rectangle: PIXI.Rectangle, point: PIXI.Point, time: number): void
    {
        if(!rectangle) return;

        if(!this._activeView) this.updateWindow();

        if(this._fadingOut)
        {
            this._fadeTime  = (this._fadeTime + time);
            this._opacity   = ((1 - (this._fadeTime / this._fadeLength)) * this.maximumOpacity);
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

        const _local_5 = (point.y - rectangle.top);

        this._stack._Str_22775(_local_5);

        let deltaY = this._stack._Str_25797();

        if(deltaY < (this._currentDeltaY - ContextInfoView.BUBBLE_DROP_SPEED))
        {
            deltaY = (this._currentDeltaY - ContextInfoView.BUBBLE_DROP_SPEED);
        }

        let _local_7 = (point.y - deltaY);

        this._currentDeltaY = deltaY;

        let left    = (Math.round(point.x - (this._activeView.offsetWidth / 2)));
        let top     = ((Math.round(_local_7 + offset)));

        if(top <= 0) top = ContextInfoView.SPACE_AROUND_EDGES;

        if(top >= (window.innerHeight - this._activeView.offsetHeight)) top = ((window.innerHeight - this._activeView.offsetHeight) - ContextInfoView.SPACE_AROUND_EDGES);

        if(left >= (window.innerWidth - this._activeView.offsetWidth)) left = ((window.innerWidth - this._activeView.offsetWidth) - ContextInfoView.SPACE_AROUND_EDGES);

        if(left < 0) left = 0 + ContextInfoView.BUBBLE_DROP_SPEED;

        this._activeView.style.left = (left + 'px');
        this._activeView.style.top  = (top + 'px');

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

    public hide(flag: boolean): void
    {
        if(this._activeView)
        {
            if(!this._firstFadeStarted && flag)
            {
                this._firstFadeStarted = true;

                if(this._fadeStartTimer)
                {
                    clearTimeout(this._fadeStartTimer);

                    this._fadeStartTimer = null;
                }

                this._fadeStartTimer = setTimeout(this.onTimerComplete.bind(this), this._fadeStartDelay);
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
        this._fadingOut = true;
        
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