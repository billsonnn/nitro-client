import * as PIXI from 'pixi.js-legacy';
import { NitroConfiguration } from '../../NitroConfiguration';
import { EventDispatcher } from '../events/EventDispatcher';
import { IEventDispatcher } from '../events/IEventDispatcher';
import { INitroRenderer } from './INitroRenderer';

PIXI.settings.ROUND_PIXELS = true;
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
PIXI.Ticker.shared.maxFPS = NitroConfiguration.FPS;

export class NitroRenderer extends PIXI.Application implements INitroRenderer
{
    private _resizeTimer: any;
    private _eventDispatcher: IEventDispatcher;

    constructor(options?: {
        autoStart?: boolean;
        width?: number;
        height?: number;
        view?: HTMLCanvasElement;
        transparent?: boolean;
        autoDensity?: boolean;
        antialias?: boolean;
        preserveDrawingBuffer?: boolean;
        resolution?: number;
        forceCanvas?: boolean;
        backgroundColor?: number;
        clearBeforeRender?: boolean;
        forceFXAA?: boolean;
        powerPreference?: string;
        sharedTicker?: boolean;
        sharedLoader?: boolean;
        resizeTo?: Window | HTMLElement;
    })
    {
        super(options);

        this._resizeTimer       = null;
        this._eventDispatcher   = new EventDispatcher();
    }

    public setup(): void
    {
        this.view.width     = window.innerWidth;
        this.view.height    = window.innerHeight;
        this.view.className = 'nitro-client';

        window.addEventListener('resize', this.onResize.bind(this));

        this.setBackgroundColor(NitroConfiguration.BACKGROUND_COLOR);
    }

    public setBackgroundColor(color: number): void
    {
        this.renderer.backgroundColor = color;
    }

    private onResize(event: UIEvent): void
    {
        if(this._resizeTimer) clearTimeout(this._resizeTimer);

        this._resizeTimer = setTimeout(() =>
        {
            this.view.width     = window.innerWidth;
            this.view.height    = window.innerHeight;
        }, 1);
    }

    public get eventDispatcher(): IEventDispatcher
    {
        return this._eventDispatcher;
    }

    public get totalTimeRunning(): number
    {
        return PIXI.Ticker.shared.lastTime;
    }
}