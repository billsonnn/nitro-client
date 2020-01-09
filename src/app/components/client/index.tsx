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
	constructor(props: ClientComponentProps)
	{
		super(props);

		this.state = {};
	}

	public componentDidMount(): void
	{
		if(this.props.nitroInstance)
		{
			const node = ReactDOM.findDOMNode(this) as HTMLElement;

			if(node)
			{
				const renderer = this.props.nitroInstance.renderer.view;

				renderer && node.append(renderer);
			}
		}
	}

	public render(): JSX.Element
	{
		return (
			<section className="client"></section>
		);
	}
}