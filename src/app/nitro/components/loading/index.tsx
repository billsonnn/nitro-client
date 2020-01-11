import React from 'react';

export interface LoadingOptions
{
	message?: string;
	percentage?: number;
	hideProgress?: boolean;
}

export interface LoadingComponentProps
{
	options?: LoadingOptions;
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
				{ this.props.options.message && <div className="text">{ this.props.options.message }</div> }
				{ !this.props.options.hideProgress &&
					<div>
						<div className="loading-progress">
   							<div className="bar" style={{ width: (this.props.options.percentage || 0) + '%' }}></div>
						</div>
						<div className="percent">{ this.props.options.percentage || 0 }%</div>
					</div>
				}
			</section>
   		);
	}
}