import React from 'react';
import Draggable from 'react-draggable';

export interface CatalogComponentProps {}

export interface CatalogComponentState {}

export class CatalogComponent extends React.Component<CatalogComponentProps, CatalogComponentState>
{
	constructor(props: CatalogComponentProps)
	{
		super(props);

		this.state = {};
	}

	public render(): JSX.Element
	{
		return (
			<Draggable handle=".handle">
				<div className="nitro-component nitro-component-widget nitro-component-catalog">
					<div className="component-header handle">
						<div className="header-title">Catalog</div>
						<div className="header-close"><i className="fas fa-times"></i></div>
					</div>
					<div className="component-body">
						catalog
					</div>
				</div>
			</Draggable>
		);
	}
}