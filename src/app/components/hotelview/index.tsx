import React from 'react';

export interface HotelViewComponentProps {}

export interface HotelViewComponentState {}

export class HotelViewComponent extends React.Component<HotelViewComponentProps, HotelViewComponentState>
{
	constructor(props: HotelViewComponentProps)
	{
		super(props);

		this.state = {};
	}

	public render(): JSX.Element
	{
		return (
            <section className="hotel-view">
            </section>
        );
	}
}