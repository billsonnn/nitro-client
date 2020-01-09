import React from 'react';
import { NitroCommunicationDemoEvent } from '../../nitro/communication/demo/NitroCommunicationDemoEvent';
import { INitroInstance } from '../../nitro/INitroInstance';
import { NitroConfiguration } from '../../NitroConfiguration';
import { DesktopComponent } from '../components/desktop';
import LoadingComponent from './components/loading';

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
	isError: boolean;
	isClosed: boolean;
	loadingMessage: string;
	loadingPercentage: number;
	loadingHideProgress: boolean;
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
			isError: false,
			isClosed: false,
			loadingMessage: 'Please Wait',
			loadingPercentage: 0,
			loadingHideProgress: false
		};

		this.onNitroCommunicationDemoEvent	= this.onNitroCommunicationDemoEvent.bind(this);
	}
	
	public componentDidMount(): void
	{
		if(!this.props.nitroInstance) return;

		this.props.nitroInstance.events.addEventListener(NitroCommunicationDemoEvent.CONNECTION_ESTABLISHED, this.onNitroCommunicationDemoEvent);
		this.props.nitroInstance.events.addEventListener(NitroCommunicationDemoEvent.CONNECTION_HANDSHAKING, this.onNitroCommunicationDemoEvent);
		this.props.nitroInstance.events.addEventListener(NitroCommunicationDemoEvent.CONNECTION_HANDSHAKED, this.onNitroCommunicationDemoEvent);
		this.props.nitroInstance.events.addEventListener(NitroCommunicationDemoEvent.CONNECTION_HANDSHAKE_FAILED, this.onNitroCommunicationDemoEvent);
		this.props.nitroInstance.events.addEventListener(NitroCommunicationDemoEvent.CONNECTION_AUTHENTICATED, this.onNitroCommunicationDemoEvent);
		this.props.nitroInstance.events.addEventListener(NitroCommunicationDemoEvent.CONNECTION_ERROR, this.onNitroCommunicationDemoEvent);
		this.props.nitroInstance.events.addEventListener(NitroCommunicationDemoEvent.CONNECTION_CLOSED, this.onNitroCommunicationDemoEvent);

		this.setState({ isDownloading: true, loadingMessage: 'Loading Assets', loadingPercentage: 20 });

		this.props.nitroInstance.core.asset.downloadAssets(NitroConfiguration.PRELOAD_ASSETS, (status: boolean) =>
		{
			this.setState({ isDownloading: false, isConnecting: true, loadingMessage: 'Connecting', loadingPercentage: 40 });

			this.props.nitroInstance.init();
		});
	}

	public componentWillUnmount(): void
	{
		if(this.props.nitroInstance)
		{
			this.props.nitroInstance.events.removeEventListener(NitroCommunicationDemoEvent.CONNECTION_ESTABLISHED, this.onNitroCommunicationDemoEvent);
			this.props.nitroInstance.events.removeEventListener(NitroCommunicationDemoEvent.CONNECTION_HANDSHAKING, this.onNitroCommunicationDemoEvent);
			this.props.nitroInstance.events.removeEventListener(NitroCommunicationDemoEvent.CONNECTION_HANDSHAKED, this.onNitroCommunicationDemoEvent);
			this.props.nitroInstance.events.removeEventListener(NitroCommunicationDemoEvent.CONNECTION_HANDSHAKE_FAILED, this.onNitroCommunicationDemoEvent);
			this.props.nitroInstance.events.removeEventListener(NitroCommunicationDemoEvent.CONNECTION_AUTHENTICATED, this.onNitroCommunicationDemoEvent);
			this.props.nitroInstance.events.removeEventListener(NitroCommunicationDemoEvent.CONNECTION_ERROR, this.onNitroCommunicationDemoEvent);
			this.props.nitroInstance.events.removeEventListener(NitroCommunicationDemoEvent.CONNECTION_CLOSED, this.onNitroCommunicationDemoEvent);
		}
	}

	private onNitroCommunicationDemoEvent(event: NitroCommunicationDemoEvent): void
	{
		if(!event) return;

		switch(event.type)
		{
			case NitroCommunicationDemoEvent.CONNECTION_ESTABLISHED:
				this.setState({ isConnecting: false, isConnected: true, loadingMessage: 'Connected' });
				return;
			case NitroCommunicationDemoEvent.CONNECTION_HANDSHAKING:
				this.setState({ isHandshaking: true, loadingMessage: 'Handshaking', loadingPercentage: 60 });
				return;
			case NitroCommunicationDemoEvent.CONNECTION_HANDSHAKED:
				this.setState({ isHandshaking: false, isHandshaked: true, loadingMessage: 'Handshaked', loadingPercentage: 80 });
				return;
			case NitroCommunicationDemoEvent.CONNECTION_HANDSHAKE_FAILED:
				this.setState({ isHandshaking: false, isError: true, loadingMessage: 'An error occured', loadingPercentage: 0, loadingHideProgress: true });
				return;
			case NitroCommunicationDemoEvent.CONNECTION_AUTHENTICATED:
				this.setState({ isAuthenticated: true, loadingMessage: 'Authenticated', loadingPercentage: 100 });
				return;
			case NitroCommunicationDemoEvent.CONNECTION_ERROR:
				this.setState({ isError: true, loadingMessage: 'Connection Error', loadingPercentage: 0, loadingHideProgress: true });
				return;
			case NitroCommunicationDemoEvent.CONNECTION_CLOSED:
				this.setState({ isClosed: true, loadingMessage: 'Connection Closed', loadingPercentage: 0, loadingHideProgress: true });
				return;
		}
	}

	public render(): JSX.Element
	{
		const isLoading = !this.state.isAuthenticated || this.state.isError || this.state.isClosed

		return (
			<section className="nitro">
				{ isLoading ? <LoadingComponent message={ this.state.loadingMessage } percentage={ this.state.loadingPercentage } hideProgress={ this.state.loadingHideProgress } /> : <DesktopComponent nitroInstance={ this.props.nitroInstance } /> }
			</section>
        );
	}
}