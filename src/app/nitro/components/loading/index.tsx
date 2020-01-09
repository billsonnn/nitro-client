import React from 'react';

export interface LoadingComponentProps
{
	message?: string;
	percentage?: number;
	hideProgress?: boolean;
}

export interface LoadingComponentState {}

export default class LoadingComponent extends React.Component<LoadingComponentProps, LoadingComponentState>
{
	constructor(props: LoadingComponentProps)
	{
		super(props);

		this.state = {};
	}

	public render(): JSX.Element
	{
		return (
			<section className="loading">
				<div className="splash">
					<div className="photo" />
					<div className="frame" />
				</div>
				{ this.props.message && <div className="text">{ this.props.message }</div> }
				{ !this.props.hideProgress &&
					<div>
						<div className="loading-progress">
   							<div className="bar" style={{ width: (this.props.percentage || 0) + '%' }}></div>
						</div>
						<div className="percent">{ this.props.percentage || 0 }%</div>
					</div>
				}
			</section>
   		);
	}
}