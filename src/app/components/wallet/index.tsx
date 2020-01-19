import React from 'react';
import { WalletClubComponent } from './components/club';
import { WalletCurrencyComponent } from './components/currency';

export interface WalletComponentProps {}

export interface WalletComponentState {}

export class WalletComponent extends React.Component<WalletComponentProps, WalletComponentState>
{
	constructor(props: WalletComponentProps)
	{
		super(props);

		this.state = {};
	}

	public render(): JSX.Element
	{
		return (
			<div className="nitro-component nitro-component-wallet">
				<div className="component-body">
					<WalletCurrencyComponent />
					<WalletClubComponent />
				</div>
			</div>
		);
	}
}