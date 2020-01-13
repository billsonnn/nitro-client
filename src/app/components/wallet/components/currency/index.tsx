import React from 'react';
import { UserCreditsEvent } from '../../../../../nitro/communication/messages/incoming/user/inventory/currency/UserCreditsEvent';
import { UserCurrencyEvent } from '../../../../../nitro/communication/messages/incoming/user/inventory/currency/UserCurrencyEvent';
import { UserCurrencyComposer } from '../../../../../nitro/communication/messages/outgoing/user/inventory/currency/UserCurrencyComposer';
import { NitroContext } from '../../../../providers/nitro/context';
import { WalletCurrencyItemComponent } from './components/item';

export interface WalletCurrencyComponentProps {}

export interface WalletCurrencyComponentState
{
	currencies: Map<number, number>;
}

export class WalletCurrencyComponent extends React.Component<WalletCurrencyComponentProps, WalletCurrencyComponentState>
{
	public static contextType = NitroContext;

	private static CREDITS_TYPE: number = -1;

	private _creditsEvent: UserCreditsEvent;
	private _currencyEvent: UserCurrencyEvent;

	constructor(props: WalletCurrencyComponentProps)
	{
		super(props);

		this._creditsEvent 	= new UserCreditsEvent(this.onUserCreditsEvent.bind(this));
		this._currencyEvent	= new UserCurrencyEvent(this.onUserCurrencyEvent.bind(this));

		this.state = {
			currencies: new Map()
		};
	}

	public componentDidMount(): void
	{
        if(this.context.nitroInstance)
        {
            const connection = this.context.nitroInstance.communication.connection;

            if(connection)
            {
                connection.addMessageEvent(this._creditsEvent);
                connection.addMessageEvent(this._currencyEvent);
			}
			
			this.requestCurrencyUpdate();
        }
	}

	public componentWillUnmount(): void
	{
        if(this.context.nitroInstance)
        {
            const connection = this.context.nitroInstance.communication.connection;

            if(connection)
            {
                connection.removeMessageEvent(this._creditsEvent);
                connection.removeMessageEvent(this._currencyEvent);
            }
        }
	}
	
	private requestCurrencyUpdate(): void
	{
		if(!this.context.nitroInstance) return;

		this.context.nitroInstance.communication.connection.send(new UserCurrencyComposer());
	}
    
    private onUserCreditsEvent(event: UserCreditsEvent): void
    {
        if(!(event instanceof UserCreditsEvent)) return;

        const parser = event.getParser();

		if(!parser) return;
		
		this.state.currencies.set(WalletCurrencyComponent.CREDITS_TYPE, parseInt(parser.credits));

		this.forceUpdate();
	}
	
	private onUserCurrencyEvent(event: UserCurrencyEvent): void
    {
        if(!(event instanceof UserCurrencyEvent)) return;

        const parser = event.getParser();

		if(!parser) return;

		if(parser.currencies && parser.currencies.size)
		{
			for(let [ type, amount ] of parser.currencies.entries()) this.state.currencies.set(type, amount);
		}

		this.forceUpdate();
    }

	public render(): JSX.Element
	{
		return (
			<div className="nitro-component-wallet-currency">
				{
					[...this.state.currencies.entries()].map(([key, value]) => {
						return <WalletCurrencyItemComponent key={ key } type={ key } amount={ value } />
					})
				}
			</div>
		);
	}
}