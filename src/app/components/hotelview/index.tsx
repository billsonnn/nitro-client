import React from 'react';
import { INitroInstance } from '../../../nitro/INitroInstance';

export interface HotelViewComponentProps
{
	nitroInstance: INitroInstance;
}

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
				<div className='hotel'>
				</div>
            </section>
        );
	}
}