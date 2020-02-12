import React from 'react';
import { INitroInstance } from '../../../nitro/INitroInstance';
import { NitroContext } from '../../providers/nitro/context';
import { ClientChatComponent } from './components/chat';
import { ClientContextInfoComponent } from './components/contextinfo';

export interface ClientComponentProps {}

export interface ClientComponentState {}

export class ClientComponent extends React.Component<ClientComponentProps, ClientComponentState>
{
	public static contextType = NitroContext;

	public clientRef: React.RefObject<HTMLDivElement>;

	constructor(props: ClientComponentProps)
	{
		super(props);

		this.clientRef	= React.createRef();
		this.state 		= {};
	}

	public componentDidMount(): void
	{
		const nitroInstance = this.context.nitroInstance as INitroInstance;
		
		nitroInstance && this.clientRef && this.clientRef.current.append(nitroInstance.renderer.view);
	}

	public render(): JSX.Element
	{
		return (
			<section className="client" ref={ this.clientRef }>
				<ClientChatComponent />
				<ClientContextInfoComponent />
			</section>
		);
	}
}