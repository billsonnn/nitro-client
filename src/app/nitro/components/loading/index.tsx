import React from 'react';

export interface LoadingComponentProps
{
	message?: string;
	percentage?: number;
}

export interface LoadingComponentState {}

export default class LoadingComponent extends React.Component<LoadingComponentProps, LoadingComponentState>
{
	public render(): JSX.Element
	{
		return (
			<section className="loading">
				<div className="splash">
					<div className="photo" />
					<div className="frame" />
				</div>
				{ this.props.message && <div className="text">{ this.props.message }</div> }
   			 	<div className="loading-progress">
   					<div className="bar" style={{ width: (this.props.percentage || 0) + '%' }}></div>
   				</div>
   				<div className="percent">{ this.props.percentage || 0 }%</div>
			</section>
   		);
	}
}