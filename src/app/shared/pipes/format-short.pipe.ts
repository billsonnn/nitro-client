import { Pipe, PipeTransform } from '@angular/core';
import { FriendlyTime } from 'nitro-renderer/src/nitro/utils/FriendlyTime';

@Pipe({ name: 'formatShort' })
export class FormatShortPipe implements PipeTransform
{
    public transform(seconds: number): string
    {
        return FriendlyTime.shortFormat(seconds);
    }
}
