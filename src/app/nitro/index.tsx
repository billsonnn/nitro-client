import React from 'react';
import { NitroCommunicationDemoEvent } from '../../nitro/communication/demo/NitroCommunicationDemoEvent';
import { INitroInstance } from '../../nitro/INitroInstance';
import { NitroConfiguration } from '../../NitroConfiguration';
import { DesktopComponent } from '../components/desktop';
import { NitroProvider } from '../providers/nitro';
import LoadingComponent, { LoadingOptions } from './components/loading';

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
	hideLoading: boolean;
	loadingOptions: LoadingOptions;
	provider: {
		nitroInstance: INitroInstance
	};
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
			hideLoading: false,
			loadingOptions: {
				message: '',
				percentage: 0,
				hideProgress: false
			},
			provider: {
				nitroInstance: props.nitroInstance
			}
		};

		this.onNitroCommunicationDemoEvent	= this.onNitroCommunicationDemoEvent.bind(this);
	}
	
	public componentDidMount(): void
	{
		if(!this.state.provider.nitroInstance) return;

		this.state.provider.nitroInstance.events.addEventListener(NitroCommunicationDemoEvent.CONNECTION_ESTABLISHED, this.onNitroCommunicationDemoEvent);
		this.state.provider.nitroInstance.events.addEventListener(NitroCommunicationDemoEvent.CONNECTION_HANDSHAKING, this.onNitroCommunicationDemoEvent);
		this.state.provider.nitroInstance.events.addEventListener(NitroCommunicationDemoEvent.CONNECTION_HANDSHAKED, this.onNitroCommunicationDemoEvent);
		this.state.provider.nitroInstance.events.addEventListener(NitroCommunicationDemoEvent.CONNECTION_HANDSHAKE_FAILED, this.onNitroCommunicationDemoEvent);
		this.state.provider.nitroInstance.events.addEventListener(NitroCommunicationDemoEvent.CONNECTION_AUTHENTICATED, this.onNitroCommunicationDemoEvent);
		this.state.provider.nitroInstance.events.addEventListener(NitroCommunicationDemoEvent.CONNECTION_ERROR, this.onNitroCommunicationDemoEvent);
		this.state.provider.nitroInstance.events.addEventListener(NitroCommunicationDemoEvent.CONNECTION_CLOSED, this.onNitroCommunicationDemoEvent);

		this.setLoadingOptions({ message: 'Loading Assets', percentage: 0 });
		this.setState({ isDownloading: true });

		this.props.nitroInstance.core.asset.downloadAssets(NitroConfiguration.PRELOAD_ASSETS, (status: boolean) =>
		{
			this.setLoadingOptions({ message: 'Connecting', percentage: 20 });
			this.setState({ isDownloading: false, isConnecting: true });

			this.props.nitroInstance.init();
		});
	}

	public componentWillUnmount(): void
	{
		if(this.state.provider.nitroInstance)
		{
			this.state.provider.nitroInstance.events.removeEventListener(NitroCommunicationDemoEvent.CONNECTION_ESTABLISHED, this.onNitroCommunicationDemoEvent);
			this.state.provider.nitroInstance.events.removeEventListener(NitroCommunicationDemoEvent.CONNECTION_HANDSHAKING, this.onNitroCommunicationDemoEvent);
			this.state.provider.nitroInstance.events.removeEventListener(NitroCommunicationDemoEvent.CONNECTION_HANDSHAKED, this.onNitroCommunicationDemoEvent);
			this.state.provider.nitroInstance.events.removeEventListener(NitroCommunicationDemoEvent.CONNECTION_HANDSHAKE_FAILED, this.onNitroCommunicationDemoEvent);
			this.state.provider.nitroInstance.events.removeEventListener(NitroCommunicationDemoEvent.CONNECTION_AUTHENTICATED, this.onNitroCommunicationDemoEvent);
			this.state.provider.nitroInstance.events.removeEventListener(NitroCommunicationDemoEvent.CONNECTION_ERROR, this.onNitroCommunicationDemoEvent);
			this.state.provider.nitroInstance.events.removeEventListener(NitroCommunicationDemoEvent.CONNECTION_CLOSED, this.onNitroCommunicationDemoEvent);
		}
	}

	private onNitroCommunicationDemoEvent(event: NitroCommunicationDemoEvent): void
	{
		if(!event) return;

		switch(event.type)
		{
			case NitroCommunicationDemoEvent.CONNECTION_ESTABLISHED:
				this.setLoadingOptions({ message: 'Connected', percentage: 40 });
				this.setState({ isConnecting: false, isConnected: true });
				return;
			case NitroCommunicationDemoEvent.CONNECTION_HANDSHAKING:
				this.setLoadingOptions({ message: 'Handshaking', percentage: 60 });
				this.setState({ isHandshaked: false, isHandshaking: true });
				return
			case NitroCommunicationDemoEvent.CONNECTION_HANDSHAKED:
				this.setLoadingOptions({ message: 'Handshaked', percentage: 80 });
				this.setState({ isHandshaking: false, isHandshaked: true });
				return;
			case NitroCommunicationDemoEvent.CONNECTION_HANDSHAKE_FAILED:
				this.setLoadingOptions({ message: 'Handshake Failed', hideProgress: true });
				this.setState({ isHandshaking: false, isHandshaked: false, isError: true, hideLoading: false });
				return;
			case NitroCommunicationDemoEvent.CONNECTION_AUTHENTICATED:
				this.setLoadingOptions({ message: 'Authenticated', percentage: 100 });
				this.setState({ isAuthenticated: true, hideLoading: true });
				return;
			case NitroCommunicationDemoEvent.CONNECTION_ERROR:
				this.setLoadingOptions({ message: 'Connection Error', hideProgress: true });
				this.setState({ isError: true, hideLoading: false });
				return;
			case NitroCommunicationDemoEvent.CONNECTION_CLOSED:
				this.setLoadingOptions({ message: 'Connection Closed', hideProgress: true });
				this.setState({ isError: true, hideLoading: false });
				return;
		}
	}

	private setLoadingOptions(options: LoadingOptions): void
	{
		let loadingOptions = this.state.loadingOptions;

		if(options.message !== loadingOptions.message) loadingOptions.message = options.message;
		if(options.percentage !== loadingOptions.percentage) loadingOptions.percentage = options.percentage;
		if(options.hideProgress !== loadingOptions.hideProgress) loadingOptions.hideProgress = options.hideProgress;

		this.setState({ loadingOptions });
	}

	public render(): JSX.Element
	{
		const displayLoading = !this.state.hideLoading;

		return (
			<NitroProvider provider={ this.state.provider }>
				<section className="nitro">
					{ displayLoading ? <LoadingComponent options={ this.state.loadingOptions } /> : <DesktopComponent /> }
				</section>
			</NitroProvider>
        );
	}
}