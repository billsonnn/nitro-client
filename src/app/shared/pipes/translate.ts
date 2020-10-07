import { Pipe, PipeTransform } from '@angular/core';
import { Nitro } from '../../../client/nitro/Nitro';

@Pipe({ name: 'translate' })
export class TranslatePipe implements PipeTransform
{
    public transform(value: string): string
    {
        return Nitro.instance.localization.getValue(value);
    }
}