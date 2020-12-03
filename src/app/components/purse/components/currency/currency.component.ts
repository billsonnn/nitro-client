import { Component, Input } from '@angular/core';
import { Nitro } from '../../../../../client/nitro/Nitro';

@Component({
    selector: '[nitro-purse-currency-component]',
    templateUrl: './currency.template.html'
})
export class PurseCurrencyComponent
{
    @Input()
    public type: number = -2;

    @Input()
    public value: number = 0;

    public get iconUrl(): string
    {
        let currencyUrl = Nitro.instance.getConfiguration<string>('currency.asset.icon.url', '');

        currencyUrl = currencyUrl.replace('%type%', this.type.toString());

        return `url('${ currencyUrl }')`;
    }
}