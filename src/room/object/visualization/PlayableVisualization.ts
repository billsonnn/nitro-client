import { Disposable } from '../../../core/common/disposable/Disposable';
import { NitroConfiguration } from '../../../NitroConfiguration';
import { IPlayableVisualization } from './IPlayableVisualization';

export class PlayableVisualization extends Disposable implements IPlayableVisualization
{
    public static FPS_TIME_MS = 60 / NitroConfiguration.FPS;

    private _frameCount: number;
    private _totalTimeRunning: number;

    private _isStarted: boolean;
    private _isStarting: boolean;
    private _isStopped: boolean;
    private _isStopping: boolean;
    private _isPlaying: boolean;

    constructor()
    {
        super();

        this._frameCount        = 0;
        this._totalTimeRunning  = 0;

        this._isStarted         = false;
        this._isStarting        = false;
        this._isStopped         = false;
        this._isStopping        = false;
        this._isPlaying         = false;
    }

    public start(): void
    {
        if(this._isStarted || this._isStarting) return;

        this._isStarting = true;
        
        this.onStart();

        this.startTicker();

        this._isStarted     = true;
        this._isStarting    = false;
    }

    public update(delta: number): void
    {
        if(this._isStopped || this._isStopping || this.isDisposed || this.isDisposing) return;

        this._totalTimeRunning += delta;
        
        this.onUpdate();
    }

    public stop(): void
    {
        if(!this._isStarted || this._isStopped || this._isStopping) return;

        this._isStopping = true;

        this.stopTicker();
        
        this.onStop();

        this._isStopped     = true;
        this._isStopping    = false;
    }

    protected startTicker(): void
    {
        if(this._isPlaying) return;

        this.resetTicker();

        PIXI.Ticker.shared.add(this.update, this);

        this._isPlaying = true;
    }

    protected stopTicker(): void
    {
        if(!this._isPlaying) return;

        PIXI.Ticker.shared.remove(this.update, this);

        this.resetTicker();

        this._isPlaying = false;
    }

    public resetFrameCount(): void
    {
        this._frameCount = 0;
    }

    public resetTimeRunning(): void
    {
        this._totalTimeRunning = 0;
    }

    public resetTicker(): void
    {
        this.resetFrameCount();
        this.resetTimeRunning();
    }

    public onStart(): void
    {
        return;
    }

    public onUpdate(): void
    {
        return;
    }

    public onStop(): void
    {
        return;
    }

    protected onDispose(): void
    {
        this.stop();

        super.onDispose();
    }

    public get frameCount(): number
    {
        return this._frameCount;
    }

    public set frameCount(count: number)
    {
        this._frameCount = count;
    }

    public get totalTimeRunning(): number
    {
        return this._totalTimeRunning;
    }

    public get isPlaying(): boolean
    {
        return this._isPlaying;
    }
}
