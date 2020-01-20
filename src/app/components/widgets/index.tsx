import React from 'react';
import { CatalogComponent } from './catalog';
import { InventoryComponent } from './inventory';
import { NavigatorComponent } from './navigator';

export interface WidgetsComponentProps {}

export interface WidgetsComponentState
{
	catalogVisible: boolean;
	inventoryVisible: boolean;
	navigatorVisible: boolean;
}

export class WidgetsComponent extends React.Component<WidgetsComponentProps, WidgetsComponentState>
{
	constructor(props: WidgetsComponentProps)
	{
		super(props);

		this.state = {
			catalogVisible: false,
			inventoryVisible: false,
			navigatorVisible: false
		};
	}

	public render(): JSX.Element
	{
		return (
			<div>
				{ this.state.catalogVisible && <CatalogComponent /> }
				{ this.state.inventoryVisible && <InventoryComponent /> }
				{ this.state.navigatorVisible && <NavigatorComponent /> }
			</div>
		);
	}
}