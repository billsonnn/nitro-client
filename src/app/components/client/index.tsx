import React from 'react';
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
		if(this.context.nitroInstance)
		{
			const renderer = this.context.nitroInstance.renderer.view;

			renderer && this.clientRef && this.clientRef.current.append(renderer);
		}
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