import React from 'react';
import { UserCreditsEvent } from '../../../../../nitro/communication/messages/incoming/user/inventory/currency/UserCreditsEvent';
import { UserCurrencyEvent } from '../../../../../nitro/communication/messages/incoming/user/inventory/currency/UserCurrencyEvent';
import { UserCurrencyComposer } from '../../../../../nitro/communication/messages/outgoing/user/inventory/currency/UserCurrencyComposer';
import { INitroInstance } from '../../../../../nitro/INitroInstance';
import { WalletCurrencyItemComponent } from './components/item';

export interface WalletCurrencyComponentProps
{
	nitroInstance: INitroInstance;
}

export interface WalletCurrencyComponentState
{
	currencies: Map<number, number>;
}

export class WalletCurrencyComponent extends React.Component<WalletCurrencyComponentProps, WalletCurrencyComponentState>
{
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
        if(this.props.nitroInstance)
        {
            const connection = this.props.nitroInstance.communication.connection;

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
        if(this.props.nitroInstance)
        {
            const connection = this.props.nitroInstance.communication.connection;

            if(connection)
            {
                connection.removeMessageEvent(this._creditsEvent);
                connection.removeMessageEvent(this._currencyEvent);
            }
        }
	}
	
	private requestCurrencyUpdate(): void
	{
		if(!this.props.nitroInstance) return;

		this.props.nitroInstance.communication.connection.send(new UserCurrencyComposer());
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
			<section className="wallet-currencies">
				{
					[...this.state.currencies.entries()].map(([key, value]) => {
						return <WalletCurrencyItemComponent key={ key } type={ key } amount={ value } />
					})
				}
			</section>
		);
	}
}