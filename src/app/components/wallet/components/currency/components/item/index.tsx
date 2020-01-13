import React from 'react';

export interface WalletCurrencyItemComponentProps
{
	type: number;
	amount: number;
}

export interface WalletCurrencyItemComponentState {}

export class WalletCurrencyItemComponent extends React.Component<WalletCurrencyItemComponentProps, WalletCurrencyItemComponentState>
{
	public render(): JSX.Element
	{
		return (
			<div className={ "currency-item currency-" + this.props.type }>
				{ this.props.amount }<i className={ "icon icon-currency-" + this.props.type }></i>
			</div>
		);
	}
}