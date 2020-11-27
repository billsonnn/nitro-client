import { Pipe, PipeTransform } from '@angular/core';
import { Nitro } from '../../../client/nitro/Nitro';

@Pipe({ name: 'translate' })
export class TranslatePipe implements PipeTransform
{
    public transform(value: string, replacements: string = null): string
    {

        return Nitro.instance.getLocalization(value, ((replacements && (typeof replacements === 'string') ? JSON.parse(replacements) : null) || null));
    }
}