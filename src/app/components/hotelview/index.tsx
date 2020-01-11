import React from 'react';
import { SessionDataEvent } from '../../../nitro/session/events/SessionDataEvent';
import { NitroContext } from '../../providers/nitro/context';

export interface HotelViewComponentProps {}

export interface HotelViewComponentState
{
	figure: string;
}

export class HotelViewComponent extends React.Component<HotelViewComponentProps, HotelViewComponentState>
{
	public static contextType = NitroContext;

	constructor(props: HotelViewComponentProps)
	{
		super(props);

		this.state = {
			figure: ''
		};
	}

	public componentDidMount(): void
	{
        if(this.context.nitroInstance)
        {
			this.context.nitroInstance.session.events.addEventListener(SessionDataEvent.FIGURE_UPDATED, this.onSessionDataEvent.bind(this));
		}
		
		this.setState({ figure: this.context.nitroInstance.session.figure });
	}

	public componentWillUnmount(): void
	{
        if(this.context.nitroInstance)
        {
			this.context.nitroInstance.session.events.removeEventListener(SessionDataEvent.FIGURE_UPDATED, this.onSessionDataEvent.bind(this));
        }
	}

	private onSessionDataEvent(event: SessionDataEvent): void
	{
		if(!event) return;

		switch(event.type)
		{
			case SessionDataEvent.FIGURE_UPDATED:
				this.setState({ figure: event.session.figure });
				return;
		}
	}

	public render(): JSX.Element
	{
		return (
            <section className="hotel-view">
				<div className="hotel" />
				<div className="user-avatar" style={{backgroundImage: "url('https://habbo.com.br/habbo-imaging/avatarimage?figure=" + ( this.state.figure ) +"&headonly=0&direction=2&head_direction=2&action=&gesture=&size=m')" }} />
            </section>
        );
	}
}