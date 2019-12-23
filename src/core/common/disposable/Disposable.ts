import { IDisposable } from './IDisposable';

export class Disposable implements IDisposable
{
    private _isDisposed: boolean;
    private _isDisposing: boolean;

    constructor()
    {
        this._isDisposed    = false;
        this._isDisposing   = false;
    }

    public dispose(): void
    {
        if(this._isDisposed || this._isDisposing) return;
        
        this._isDisposing   = true;
        
        this.onDispose();

        this._isDisposed    = true;
        this._isDisposing   = false;
    }

    protected onDispose(): void
    {
        return;
    }

    public get isDisposed(): boolean
    {
        return this._isDisposed;
    }

    public get isDisposing(): boolean
    {
        return this._isDisposing;
    }
}