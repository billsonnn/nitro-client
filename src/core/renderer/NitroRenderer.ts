import * as PIXI from 'pixi.js-legacy';
import { NitroConfiguration } from '../../NitroConfiguration';
import { INitroCamera } from './INitroCamera';
import { INitroRenderer } from './INitroRenderer';
import { NitroCamera } from './NitroCamera';

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
PIXI.Ticker.shared.maxFPS = 24;

export class NitroRenderer extends PIXI.Application implements INitroRenderer
{
    private _camera: INitroCamera;
    private _preventEvents: boolean;
    private _preventNextClick: boolean;

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
    }

    public setup(): void
    {
        this.view.className = 'nitro-client';

        this.setBackgroundColor(NitroConfiguration.BACKGROUND_COLOR);

        this.setupCamera();
    }

    private setupCamera(): void
    {
        if(this._camera) return;

        this._camera = new NitroCamera({
            screenWidth: this.view.width,
            screenHeight: this.view.height,
            worldWidth: this.view.width,
            worldHeight: this.view.height
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

    public resizeRenderer(width: number, height: number): void
    {
        this.view.width     = width;
        this.view.height    = height;
        
        if(this._camera) this._camera.resize(width, height, width, height);
    }

    public get camera(): INitroCamera
    {
        return this._camera;
    }

    public get pixiRenderer(): PIXI.Renderer | PIXI.CanvasRenderer
    {
        return this.renderer;
    }

    public get preventEvents(): boolean
    {
        return this._preventEvents;
    }

    public get preventNextClick(): boolean
    {
        return this._preventNextClick;
    }

    public set preventNextClick(flag: boolean)
    {
        this._preventNextClick = flag;
    }

    public get totalTimeRunning(): number
    {
        return PIXI.Ticker.shared.lastTime;
    }
}