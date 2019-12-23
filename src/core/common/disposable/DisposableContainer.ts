import * as PIXI from 'pixi.js-legacy';
import { IDisposable } from './IDisposable';

export class DisposableContainer extends PIXI.Container implements IDisposable
{
    private _isDisposed: boolean;
    private _isDisposing: boolean;

    constructor()
    {
        super();

        this._isDisposed    = false;
        this._isDisposing   = false;
    }

    public dispose(): void
    {
        if(this._isDisposed || this._isDisposing) return;

        this._isDisposing = true;

        if(this.parent) this.parent.removeChild(this);

        this.onDispose();

        this.destroy();

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