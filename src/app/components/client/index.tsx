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

		if(nitroInstance)
		{
			const renderer = nitroInstance.renderer;

			if(!renderer) return;

			const camera = renderer.camera;

			if(!camera) return;

			const roomEngine = nitroInstance.roomEngine;

			if(roomEngine)
			{
				const roomId = roomEngine.activeRoomId;

				const display = roomEngine.getRoomDisplay(roomId, 1, window.innerWidth, window.innerHeight, 64);

				if(!display || display.parent === camera) return;

				camera.addChild(display);
			}

			this.clientRef && this.clientRef.current.append(renderer.view);
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