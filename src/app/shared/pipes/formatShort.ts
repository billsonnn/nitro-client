import { Pipe, PipeTransform } from '@angular/core';
import { Nitro } from '../../../client/nitro/Nitro';

@Pipe({ name: 'formatShort' })
export class FormatShortPipe implements PipeTransform
{
    public transform(seconds:number): string
    {
        let loc = Nitro.instance.localization;

        let min: number = 60;

        let hour: number = (60 * min);
        
        let day: number = (24 * hour);

        let month: number = (31 * day);

        let year: number = (365 * day);

        let threshold: number = 3;

        let diff = (seconds * min);

        if (diff > (threshold * year))
        { 
            return loc.getValueWithParameter("friendlytime.years.short","amount",Math.round((diff / year)).toString());
        }

        if (diff > (threshold * month))
        { 
            return loc.getValueWithParameter("friendlytime.months.short","amount",Math.round((diff / month)).toString()); 
        }

        if (diff > (threshold * day))
        { 
            return loc.getValueWithParameter("friendlytime.days.short","amount",Math.round((diff / day)).toString()); 
        }

        if (diff > (threshold * hour))
        { 
            return loc.getValueWithParameter("friendlytime.hours.short","amount",Math.round((diff / hour)).toString()); 
        }

        if (diff > (threshold * min))
        { 
            return loc.getValueWithParameter("friendlytime.minutes.short","amount",Math.round((diff / min)).toString());
        }

        return loc.getValueWithParameter("friendlytime.seconds.short","amount",Math.round(diff).toString());
    }
}