import React from 'react';
import Draggable from 'react-draggable';

export interface NavigatorComponentProps {}

export interface NavigatorComponentState {}

export class NavigatorComponent extends React.Component<NavigatorComponentProps, NavigatorComponentState>
{
	constructor(props: NavigatorComponentProps)
	{
		super(props);

		this.state = {};
	}

	public render(): JSX.Element
	{
		return (
			<Draggable handle=".handle">
				<div className="nitro-component nitro-component-widget nitro-component-navigator">
					<div className="component-header handle">
						<div className="header-title">Navigator</div>
						<div className="header-close"><i className="fas fa-times"></i></div>
					</div>
					<div className="component-body">
						navigator
					</div>
				</div>
			</Draggable>
		);
	}
}