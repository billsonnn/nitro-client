import React from 'react';
import { INitroInstance } from '../../../nitro/INitroInstance';
import { RoomEngineEvent } from '../../../nitro/room/events/RoomEngineEvent';
import { NitroContext } from '../../providers/nitro/context';
import { ClientComponent } from '../client';
import { HotelViewComponent } from '../hotelview';
import { ToolbarComponent } from '../toolbar';
import { WalletComponent } from '../wallet';
import { WidgetsComponent } from '../widgets';

export interface DesktopComponentProps {}

export interface DesktopComponentState
{
	isInRoom: boolean;
}

export class DesktopComponent extends React.Component<DesktopComponentProps, DesktopComponentState>
{
	public static contextType = NitroContext;

	constructor(props: DesktopComponentProps)
	{
		super(props);

		this.state = {
			isInRoom: false
		};
	}

	public componentDidMount(): void
	{
		const nitroInstance = this.context.nitroInstance as INitroInstance;

		if(nitroInstance)
		{
			nitroInstance.roomEngine.events.addEventListener(RoomEngineEvent.INITIALIZED, this.onRoomEngineEvent.bind(this));
			nitroInstance.roomEngine.events.addEventListener(RoomEngineEvent.DISPOSED, this.onRoomEngineEvent.bind(this));
		}
	}

	public componentWillUnmount(): void
	{
        const nitroInstance = this.context.nitroInstance as INitroInstance;

		if(nitroInstance)
		{
			nitroInstance.roomEngine.events.removeEventListener(RoomEngineEvent.INITIALIZED, this.onRoomEngineEvent.bind(this));
			nitroInstance.roomEngine.events.removeEventListener(RoomEngineEvent.DISPOSED, this.onRoomEngineEvent.bind(this));
		}
	}

	private onRoomEngineEvent(event: RoomEngineEvent): void
	{
		if(!event) return;

		switch(event.type)
		{
			case RoomEngineEvent.INITIALIZED:
				this.setState({ isInRoom: true });
				return;
			case RoomEngineEvent.DISPOSED:
				this.setState({ isInRoom: false });
				return;
		}
	}

	public render(): JSX.Element
	{
		return (
			<section className="desktop">
				{ this.state.isInRoom ? <ClientComponent /> : <HotelViewComponent /> }
				<WidgetsComponent />
				<WalletComponent />
				<ToolbarComponent isInRoom={ this.state.isInRoom } />
			</section>
        );
	}
}