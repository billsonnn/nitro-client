import React from 'react';

export interface ToolbarComponentProps
{
    isClient?: boolean,
}

export class ToolbarComponent extends React.Component<ToolbarComponentProps, {}>
{
    public render(): JSX.Element
    {
		return (
            <section className={"toolbar" + (this.props.isClient ? " is-client" : '')}>
                <div className="toolbar-actions">
                </div>
            </section>
        );
	}
}