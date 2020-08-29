﻿import { Nitro } from '../../Nitro';
import { Motion } from './Motion';

export class Interval extends Motion
{
    private _startTimeMs: number;
    private _duration: number;

    constructor(target: HTMLElement, duration: number)
    {
        super(target);

        this._complete  = false;
        this._duration  = duration;
    }

    public get duration(): number
    {
        return this._duration;
    }

    public start(): void
    {
        super.start();

        this._complete      = false;
        this._startTimeMs   = Nitro.instance.time;
    }

    public tick(time: number): void
    {
        super.tick(time);

        let elapsed = ((time - this._startTimeMs) / this._duration);

        if(elapsed < 1)
        {
            this.update(elapsed);
        }
        else
        {
            this.update(1);

            this._complete = true;
        }
    }
}