import React from 'react';
import ReactDOM from 'react-dom';
import { NitroInstance } from '../../../nitro/NitroInstance';

export interface ClientComponentProps {}

export class ClientComponent extends React.Component<ClientComponentProps, {}>
{
	public componentDidMount(): void
	{
		const node = ReactDOM.findDOMNode(this) as HTMLElement;

		const renderer = NitroInstance.instance.renderer.view;

		if(renderer) node.append(renderer);
	}

	public render(): JSX.Element
	{
		return (
			<section className="client"></section>
		);
	}
}