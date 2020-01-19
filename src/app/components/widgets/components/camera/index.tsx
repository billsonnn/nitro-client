import React from 'react';
import Draggable from 'react-draggable';

export interface CameraComponentProps {}

export interface CameraComponentState {}

export class CameraComponent extends React.Component<CameraComponentProps, CameraComponentState>
{
	constructor(props: CameraComponentProps)
	{
		super(props);

		this.state = {};
	}

	public render(): JSX.Element
	{
		return (
			<Draggable handle=".handle">
				<section className="camera-container">
					<div className="camera handle">
						<h1 className="title">Nitro Camera</h1>
						<div className="cameraActions">
							<button className="btn btn-r63b btn-action btn-red">
								<i className="icon icon-close"></i>
							</button>
						</div>
						<span className="snap"></span>
					</div>
				</section>
			</Draggable>
		);
	}
}