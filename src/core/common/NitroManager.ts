import { Disposable } from './disposable/Disposable';
import { IDisposeable } from './disposable/IDisposable';
import { INitroLogger } from './logger/INitroLogger';
import { NitroLogger } from './logger/NitroLogger';

export class NitroManager extends Disposable implements IDisposeable
{
    private _logger: INitroLogger;

    private _isLoaded: boolean;
    private _isLoading: boolean;

    constructor(logger: INitroLogger = null)
    {
        super();

        this._logger        = logger instanceof NitroLogger ? logger : new NitroLogger(this.constructor.name);

        this._isLoaded      = false;
        this._isLoading     = false;
    }

    public async init(): Promise<void>
    {
        if(this._isLoaded || this._isLoading || this.isDisposing) return;
        
        this._isLoading     = true;

        this.onInit();

        this._isLoaded      = true;
        this._isLoading     = false;
    }

    protected onInit(): void
    {
        return;
    }

    protected onDispose(): void
    {
        return;
    }

    public reload(): void
    {
        this.dispose();
        this.init();
    }

    public get logger(): INitroLogger
    {
        return this._logger;
    }

    public get isLoaded(): boolean
    {
        return this._isLoaded;
    }

    public get isLoading(): boolean
    {
        return this._isLoading;
    }
}