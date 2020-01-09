import React from 'react';
import ReactDOM from 'react-dom';
import { INitroInstance } from '../../../nitro/INitroInstance';

export interface ClientComponentProps
{
	nitroInstance: INitroInstance;
}

export interface ClientComponentState {}

export class ClientComponent extends React.Component<ClientComponentProps, ClientComponentState>
{
	public componentDidMount(): void
	{
		if(!this.props.nitroInstance) return;

		const node = ReactDOM.findDOMNode(this) as HTMLElement;

		const renderer = this.props.nitroInstance.renderer.view;

		if(renderer) node.append(renderer);
	}

	public render(): JSX.Element
	{
		return (
			<section className="client"></section>
		);
	}
}