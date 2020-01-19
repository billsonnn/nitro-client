import React from 'react';
import { CameraComponent } from './components/camera';

export interface WidgetsComponentProps {}

export interface WidgetsComponentState
{
	cameraVisible: boolean;
}

export class WidgetsComponent extends React.Component<WidgetsComponentProps, WidgetsComponentState>
{
	constructor(props: WidgetsComponentProps)
	{
		super(props);

		this.state = {
			cameraVisible: false
		};
	}

	public render(): JSX.Element
	{
		return (
			<div>
				{ this.state.cameraVisible && <CameraComponent /> }
			</div>
		);
	}
}