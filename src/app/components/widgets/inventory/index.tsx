import React from 'react';
import Draggable from 'react-draggable';

export interface InventoryComponentProps {}

export interface InventoryComponentState {}

export class InventoryComponent extends React.Component<InventoryComponentProps, InventoryComponentState>
{
	constructor(props: InventoryComponentProps)
	{
		super(props);

		this.state = {};
	}

	public render(): JSX.Element
	{
		return (
			<Draggable handle=".handle">
				<div className="nitro-component nitro-component-widget nitro-component-inventory">
					<div className="component-header handle">
						<div className="header-title">Inventory</div>
						<div className="header-close"><i className="fas fa-times"></i></div>
					</div>
					<div className="component-body">
						inventory
					</div>
				</div>
			</Draggable>
		);
	}
}