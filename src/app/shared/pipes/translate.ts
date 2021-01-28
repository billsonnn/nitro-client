import { Pipe, PipeTransform } from '@angular/core';
import { Nitro } from '../../../client/nitro/Nitro';

@Pipe({ name: 'translate' })
export class TranslatePipe implements PipeTransform
{
    public transform(key: string, parameter: string = null, replacement: string = null, parameters: string[] = [], replacements: string[] = []): string
    {
        if(!parameter && parameters.length === 0)
            return Nitro.instance.getLocalization(key);

        if(parameter && replacement)
            return Nitro.instance.getLocalizationWithParameter(key, parameter, replacement);

        if(parameters.length > 0 && replacements.length > 0 && parameters.length === replacements.length)
            return Nitro.instance.getLocalizationWithParameters(key, parameters, replacements);
    }
}