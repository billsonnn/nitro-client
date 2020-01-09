import React from 'react';
import { NitroCommunicationDemoEvent } from '../../nitro/communication/demo/NitroCommunicationDemoEvent';
import { INitroInstance } from '../../nitro/INitroInstance';
import { NitroConfiguration } from '../../NitroConfiguration';
import { DesktopComponent } from '../components/desktop';
import LoadingComponent from '../components/loading';

export interface NitroComponentProps
{
	nitroInstance: INitroInstance
}

export interface NitroComponentState
{
	isDownloading: boolean;
	isConnecting: boolean;
	isConnected: boolean;
	isHandshaking: boolean;
	isHandshaked: boolean;
	isAuthenticated: boolean;
	loadingMessage: string;
	loadingPercentage: number;
}

export class NitroComponent extends React.Component<NitroComponentProps, NitroComponentState>
{
	constructor(props: NitroComponentProps)
	{
		super(props);

		this.state = {
			isDownloading: false,
			isConnecting: false,
			isConnected: false,
			isHandshaking: false,
			isHandshaked: false,
			isAuthenticated: false,
			loadingMessage: 'Please Wait',
			loadingPercentage: 0
		};

		this.onNitroCommunicationDemoEvent	= this.onNitroCommunicationDemoEvent.bind(this);
	}
	
	public componentDidMount(): void
	{
		if(!this.props.nitroInstance) return;

		this.props.nitroInstance.events.addEventListener(NitroCommunicationDemoEvent.CONNECTION_AUTHENTICATED, this.onNitroCommunicationDemoEvent);
		this.props.nitroInstance.events.addEventListener(NitroCommunicationDemoEvent.CONNECTION_ESTABLISHED, this.onNitroCommunicationDemoEvent);
		this.props.nitroInstance.events.addEventListener(NitroCommunicationDemoEvent.CONNECTION_HANDSHAKING, this.onNitroCommunicationDemoEvent);
		this.props.nitroInstance.events.addEventListener(NitroCommunicationDemoEvent.CONNECTION_HANDSHAKED, this.onNitroCommunicationDemoEvent);

		this.setState({ isDownloading: true, loadingMessage: 'Loading Assets', loadingPercentage: 20 });

		this.props.nitroInstance.core.asset.downloadAssets(NitroConfiguration.PRELOAD_ASSETS, (status: boolean) =>
		{
			this.setState({ isDownloading: false, isConnecting: true });

			try
			{
				this.props.nitroInstance.init();
			}
	
			catch(err)
			{
				console.error(err.message || err);
	
				this.props.nitroInstance.core.dispose();
			}
		});
	}

	public componentWillUnmount(): void
	{
		if(this.props.nitroInstance)
		{
			this.props.nitroInstance.events.removeEventListener(NitroCommunicationDemoEvent.CONNECTION_AUTHENTICATED, this.onNitroCommunicationDemoEvent);
			this.props.nitroInstance.events.removeEventListener(NitroCommunicationDemoEvent.CONNECTION_ESTABLISHED, this.onNitroCommunicationDemoEvent);
			this.props.nitroInstance.events.removeEventListener(NitroCommunicationDemoEvent.CONNECTION_HANDSHAKING, this.onNitroCommunicationDemoEvent);
			this.props.nitroInstance.events.removeEventListener(NitroCommunicationDemoEvent.CONNECTION_HANDSHAKED, this.onNitroCommunicationDemoEvent);
		}
	}

	private onNitroCommunicationDemoEvent(event: NitroCommunicationDemoEvent): void
	{
		if(!event) return;

		switch(event.type)
		{
			case NitroCommunicationDemoEvent.CONNECTION_ESTABLISHED:
				this.setState({ isConnecting: false, isConnected: true, loadingMessage: 'Connection Established', loadingPercentage: 40 });
				return;
			case NitroCommunicationDemoEvent.CONNECTION_HANDSHAKING:
				this.setState({ isHandshaking: true, loadingMessage: 'Handshaking', loadingPercentage: 60 });
				return;
			case NitroCommunicationDemoEvent.CONNECTION_HANDSHAKED:
				this.setState({ isHandshaking: false, isHandshaked: true, loadingMessage: 'Handshaked', loadingPercentage: 80 });
				return;
			case NitroCommunicationDemoEvent.CONNECTION_AUTHENTICATED:
				this.setState({ isAuthenticated: true, loadingMessage: 'Authenticated', loadingPercentage: 100 });
				return;
		}
	}

	public render(): JSX.Element
	{
		const isLoading = !this.state.isAuthenticated;

		return (
			<section className="nitro">
				{ isLoading ? <LoadingComponent message={ this.state.loadingMessage } percentage={ this.state.loadingPercentage } /> : <DesktopComponent nitroInstance={ this.props.nitroInstance } /> }
			</section>
        );
	}
}