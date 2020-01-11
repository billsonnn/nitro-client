import React from 'react';
import { WalletClubComponent } from './components/club';
import { WalletCurrencyComponent } from './components/currency';
import { WalletOptionsComponent } from './components/options';

export interface WalletComponentProps {}

export interface WalletComponentState {}

export class WalletComponent extends React.Component<WalletComponentProps, WalletComponentState>
{
	private static CREDITS_TYPE: number = -1;

	constructor(props: WalletComponentProps)
	{
		super(props);

		this.state = {};
	}

	public render(): JSX.Element
	{
		return (
			<section className="wallet">
				<WalletCurrencyComponent />
				<WalletClubComponent />
				<WalletOptionsComponent />
			</section>
		);
	}
}