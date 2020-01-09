import React from 'react';
import { INitroInstance } from '../../../nitro/INitroInstance';
import { WalletClubComponent } from './components/club';
import { WalletCurrencyComponent } from './components/currency';

export interface WalletComponentProps
{
	nitroInstance: INitroInstance;
}

export interface WalletComponentState {}

export class WalletComponent extends React.Component<WalletComponentProps, WalletComponentState>
{
	private static CREDITS_TYPE: number = -1;

	constructor(props: WalletComponentProps)
	{
		super(props);

		this.state = {
			currencies: new Map()
		};
	}

	public render(): JSX.Element
	{
		return (
			<section className="wallet">
				<WalletCurrencyComponent nitroInstance={ this.props.nitroInstance } />
				<WalletClubComponent nitroInstance={ this.props.nitroInstance } />
			</section>
		);
	}
}