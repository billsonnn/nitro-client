import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { IMessageEvent } from '../../../../client/core/communication/messages/IMessageEvent';
import { UserCreditsEvent } from '../../../../client/nitro/communication/messages/incoming/user/inventory/currency/UserCreditsEvent';
import { UserCurrencyEvent } from '../../../../client/nitro/communication/messages/incoming/user/inventory/currency/UserCurrencyEvent';
import { UserCurrencyComposer } from '../../../../client/nitro/communication/messages/outgoing/user/inventory/currency/UserCurrencyComposer';
import { Nitro } from '../../../../client/nitro/Nitro';

@Injectable()
export class PurseService implements OnDestroy
{
    private _messages: IMessageEvent[];
    private _currencies: Map<number, number>;

    constructor(
        private _ngZone: NgZone)
    {
        this._messages      = [];
        this._currencies    = new Map();

        this.registerMessages();
    }

    public ngOnDestroy(): void
    {
        this.unregisterMessages();
    }

    private registerMessages(): void
    {
        this._ngZone.runOutsideAngular(() =>
        {
            this.unregisterMessages();

            this._messages = [
                new UserCreditsEvent(this.onUserCreditsEvent.bind(this)),
                new UserCurrencyEvent(this.onUserCurrencyEvent.bind(this))
            ];

            for(let message of this._messages) Nitro.instance.communication.registerMessageEvent(message);
        });
    }

    private unregisterMessages(): void
    {
        this._ngZone.runOutsideAngular(() =>
        {
            if(this._messages && this._messages.length)
            {
                for(let message of this._messages) Nitro.instance.communication.removeMessageEvent(message);

                this._messages = [];
            }
        })
    }

    public requestUpdate(): void
    {
        Nitro.instance.communication.connection.send(new UserCurrencyComposer());
    }

    private onUserCreditsEvent(event: UserCreditsEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        this._ngZone.run(() =>
        {
            this.setCurrency(-1, parseFloat(parser.credits));
        });
    }

    private onUserCurrencyEvent(event: UserCurrencyEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        this._ngZone.run(() =>
        {
            for(let [ type, amount ] of parser.currencies) this.setCurrency(type, amount);
        });
    }

    private setCurrency(type: number, amount: number): void
    {
        this._currencies.set(type, amount);
    }

    public get currencies(): Map<number, number>
    {
        return this._currencies;
    }

    public get visibleCurrencies(): number[]
    {
        return Nitro.instance.getConfiguration<number[]>('system.currency.types', []);
    }
}