import React from 'react';
import { ClientComponent } from '../client';
import { ToolbarComponent } from '../toolbar';

export interface DesktopComponentProps
{
	isLoading: boolean
}

export class DesktopComponent extends React.Component<DesktopComponentProps, {}>
{
	public render(): JSX.Element
	{
		return (
            <section className="desktop">
				<ClientComponent />
				<ToolbarComponent />
            </section>
        );
	}
}