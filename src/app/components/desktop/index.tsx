import React from 'react';
import { INitroInstance } from '../../../nitro/INitroInstance';
import { NitroInstance } from '../../../nitro/NitroInstance';
import { RoomSessionEvent } from '../../../nitro/session/events/RoomSessionEvent';
import { ClientComponent } from '../client';
import { HotelViewComponent } from '../hotelview';
import { ToolbarComponent } from '../toolbar';
import { WalletComponent } from '../wallet';

export interface DesktopComponentProps
{
	nitroInstance: INitroInstance;
}

export interface DesktopComponentState
{
	isInRoom: boolean;
}

export class DesktopComponent extends React.Component<DesktopComponentProps, DesktopComponentState>
{
	constructor(props: DesktopComponentProps)
	{
		super(props);

		this.state = {
			isInRoom: false
		};
	}
	
	public componentDidMount(): void
	{
		NitroInstance.instance.roomSession.events.addEventListener(RoomSessionEvent.STARTED, this.onRoomSessionEvent.bind(this));
		NitroInstance.instance.roomSession.events.addEventListener(RoomSessionEvent.ENDED, this.onRoomSessionEvent.bind(this));
	}

	public componentWillUnmount(): void
	{
		NitroInstance.instance.roomSession.events.removeEventListener(RoomSessionEvent.STARTED, this.onRoomSessionEvent.bind(this));
		NitroInstance.instance.roomSession.events.removeEventListener(RoomSessionEvent.ENDED, this.onRoomSessionEvent.bind(this));
	}

	private onRoomSessionEvent(event: RoomSessionEvent): void
	{
		if(!event) return;

		switch(event.type)
		{
			case RoomSessionEvent.STARTED:
				this.setState({ isInRoom: true });
				return;
			case RoomSessionEvent.ENDED:
				this.setState({ isInRoom: false });
				return;
		}
	}

	public render(): JSX.Element
	{
		return (
			<section className="desktop">
				{ this.state.isInRoom ? <ClientComponent /> : <HotelViewComponent /> }
				<WalletComponent />
				<ToolbarComponent isClient={ this.state.isInRoom } />
			</section>
        );
	}
}