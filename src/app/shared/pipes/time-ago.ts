import { ChangeDetectorRef, OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { FriendlyTime } from '../../../client/nitro/utils/FriendlyTime';

@Pipe({ name: 'timeAgo' })
export class TimeAgoPipe implements PipeTransform, OnDestroy
{
    private _time: number = 0;
    private _timer: ReturnType<typeof setInterval> = null;

    constructor(private changeDetector: ChangeDetectorRef) 
    {}

    public ngOnDestroy(): void
    {
        this.clearInterval();
    }

    public transform(time: number): string
    {
        this._time = time;

        this.setupInterval();

        console.log(Date.now(), this._time);
        
        return FriendlyTime.format((Date.now() - this._time));
    }

    private clearInterval(): void
    {
        if(this._timer)
        {
            clearInterval(this._timer);

            this._timer = null;
        }
    }

    private setupInterval(): void
    {
        if(this._timer) return;

        this._timer = setInterval(this.updateTime.bind(this), 30000);
    }

    private updateTime(): void
    {
        this.changeDetector.markForCheck();
    }
}