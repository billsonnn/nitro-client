import React from 'react';
import { UserSubscriptionEvent } from '../../../../../nitro/communication/messages/incoming/user/inventory/subscription/UserSubscriptionEvent';
import { UserSubscriptionComposer } from '../../../../../nitro/communication/messages/outgoing/user/inventory/subscription/UserSubscriptionComposer';
import { NitroContext } from '../../../../providers/nitro/context';

export interface WalletClubComponentProps {}

export interface WalletClubComponentState
{
	hasSubscription: boolean;
	secondsRemaining: number;
	remaining: number;
}

export class WalletClubComponent extends React.Component<WalletClubComponentProps, WalletClubComponentState>
{
	public static contextType = NitroContext;

	private static SUBSCRIPTION_TYPE: string 		= 'habbo_club';
	private static SUBSCRIPTION_INTERVAL: number	= 60000;

	private _subscriptionEvent: UserSubscriptionEvent;

	private _interval: any;

	constructor(props: WalletClubComponentProps)
	{
		super(props);

		this._subscriptionEvent	= new UserSubscriptionEvent(this.onUserSubscriptionEvent.bind(this));

		this._interval 			= null;

		this.state = {
			hasSubscription: false,
			secondsRemaining: 0,
			remaining: 0
		};
	}

	public componentDidMount(): void
	{
        if(this.context.nitroInstance)
        {
            const connection = this.context.nitroInstance.communication.connection;

			if(connection)
			{
				connection.addMessageEvent(this._subscriptionEvent);
			}
		}
		
		this.startRequesting();
	}

	public componentWillUnmount(): void
	{
		this.stopRequesting();

        if(this.context.nitroInstance)
        {
            const connection = this.context.nitroInstance.communication.connection;

			if(connection)
			{
				connection.removeMessageEvent(this._subscriptionEvent);
			}
        }
	}

	private startRequesting(): void
	{
		this.stopRequesting();

		this.requestSubscriptionUpdate();

		this._interval = setInterval(() => this.requestSubscriptionUpdate(), WalletClubComponent.SUBSCRIPTION_INTERVAL);
	}

	private stopRequesting(): void
	{
		if(!this._interval) return;

		clearInterval(this._interval);

		this._interval = null;
	}
	
	private requestSubscriptionUpdate(): void
	{
		if(!this.context.nitroInstance) return;

		this.context.nitroInstance.communication.connection.send(new UserSubscriptionComposer(WalletClubComponent.SUBSCRIPTION_TYPE));
	}
    
    private onUserSubscriptionEvent(event: UserSubscriptionEvent): void
    {
        if(!(event instanceof UserSubscriptionEvent)) return;

        const parser = event.getParser();

		if(!parser) return;

		this.setState({
			hasSubscription: true,
			secondsRemaining: parser.totalSeconds,
			remaining: Math.floor(parser.totalSeconds / 86400)
		});
	}

	public render(): JSX.Element
	{
		return (
			<div className="nitro-component-wallet-club rounded">
				<div className="text-center">
					{ this.state.hasSubscription && (<div>{ this.state.remaining }<br />Days</div>) }
				</div>
			</div>
		);
	}
}