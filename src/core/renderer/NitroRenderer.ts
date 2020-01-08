import * as PIXI from 'pixi.js-legacy';
import { NitroConfiguration } from '../../NitroConfiguration';
import { EventDispatcher } from '../events/EventDispatcher';
import { IEventDispatcher } from '../events/IEventDispatcher';
import { INitroCamera } from './INitroCamera';
import { INitroRenderer } from './INitroRenderer';
import { NitroCamera } from './NitroCamera';
import { RendererViewEvent } from './RendererViewEvent';

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
PIXI.Ticker.shared.maxFPS = NitroConfiguration.FPS;

export class NitroRenderer extends PIXI.Application implements INitroRenderer
{
    private _camera: INitroCamera;
    private _preventEvents: boolean;
    private _preventNextClick: boolean;
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

        this._camera            = null;
        this._preventEvents     = false;
        this._preventNextClick  = false;
        this._resizeTimer       = null;

        this._eventDispatcher   = new EventDispatcher();
    }

    public setup(): void
    {
        this.resizeRenderer();

        this.view.className = 'nitro-client';

        window.onresize         = this.onResize.bind(this);
        this.view.onclick       = this.onMouseEvent.bind(this);
        this.view.onmousemove   = this.onMouseEvent.bind(this);
        this.view.onmousedown   = this.onMouseEvent.bind(this);
        this.view.onmouseup     = this.onMouseEvent.bind(this);

        this.setBackgroundColor(NitroConfiguration.BACKGROUND_COLOR);

        this.setupCamera();
    }

    private setupCamera(): void
    {
        if(this._camera) return;

        this._camera = new NitroCamera({
            screenWidth: this.view.width,
            screenHeight: this.view.height
        });

        this._camera.pinch();

        this._camera.on('drag-start', () => this._preventEvents = true);

        this._camera.on('drag-end', () =>
        {
            this._preventEvents     = false;
            this._preventNextClick  = true;
        });

        this.toggleDrag();

        this.stage.addChild(this._camera);
    }

    public setBackgroundColor(color: number): void
    {
        this.renderer.backgroundColor = color;
    }

    public toggleDrag(): void
    {
        if(!this._camera) return;

        this._camera.drag({
            wheel: false,
            wheelScroll: 0
        });
    }

    public resizeRenderer(event: UIEvent = null): void
    {
        const width     = window.innerWidth;
        const height    = window.innerHeight;

        this.view.width     = width;
        this.view.height    = height;
        
        if(this._camera)
        {
            this._camera.resize(width, height);
            
            this._camera.position.x = 0;
            this._camera.position.y = 0;
        }

        this.eventDispatcher.dispatchEvent(new RendererViewEvent(RendererViewEvent.RESIZE, event));
    }

    private onMouseEvent(event: MouseEvent): void
    {
        if(!event || this._preventEvents) return;

        if(event.type === 'click')
        {
            if(this._preventNextClick)
            {
                this._preventNextClick = false;

                return;
            }
        }

        this.eventDispatcher.dispatchEvent(new RendererViewEvent(event.type, event));
    }

    private onResize(event: UIEvent): void
    {
        if(this._resizeTimer) clearTimeout(this._resizeTimer);

        this._resizeTimer = setTimeout(this.resizeRenderer.bind(this, event), 300);
    }

    public get camera(): INitroCamera
    {
        return this._camera;
    }

    public get pixiRenderer(): PIXI.Renderer | PIXI.CanvasRenderer
    {
        return this.renderer;
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