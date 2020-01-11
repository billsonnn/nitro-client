import React from 'react';
import { INitroInstance } from '../../../nitro/INitroInstance';
import { NitroContext } from './context';

export interface NitroProviderProps
{
	provider: {
		nitroInstance: INitroInstance;
	}
}

export interface NitroProviderState
{
	provider: {
		nitroInstance: INitroInstance;
	}
}

export class NitroProvider extends React.Component<NitroProviderProps, NitroProviderState>
{
	constructor(props: NitroProviderProps)
	{
		super(props);

		this.state = {
			provider: props.provider
		};
	}

	public render(): JSX.Element
	{
		return (
			<NitroContext.Provider value={ this.state.provider }>
				{ this.props.children }
			</NitroContext.Provider>
        );
	}
}