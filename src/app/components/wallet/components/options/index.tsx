import React from 'react';

export interface WalletOptionsComponentProps {}

export interface WalletOptionsComponentState {}

export class WalletOptionsComponent extends React.Component<WalletOptionsComponentProps, WalletOptionsComponentState>
{
	constructor(props: WalletOptionsComponentProps)
	{
		super(props);

		this.state = {};
	}

	public render(): JSX.Element
	{
		return (
			<section className="wallet-buttons">
				<a className="btn btn-blue">Help</a>
				<a className="btn btn-red icon icon-logout"></a>
				<a className="btn btn-gray icon icon-settings"></a>
			</section>
		);
	}
}