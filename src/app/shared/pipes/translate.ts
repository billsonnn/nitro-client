import { Pipe, PipeTransform } from '@angular/core';
import { Nitro } from '../../../client/nitro/Nitro';

@Pipe({ name: 'translate' })
export class TranslatePipe implements PipeTransform
{
    public transform(key: string, parameter: string = null, replacement: string = null): string
    {
        return Nitro.instance.getLocalization(key);

        //return Nitro.instance.getLocalizationWithParameter(key, parameter, (replacement && replacement.toString()));
    }
}