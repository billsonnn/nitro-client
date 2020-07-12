import React from 'react';

export interface NavigatorProps
{
}

export function Navigator(props: NavigatorProps): JSX.Element
{
    return (
        <div className="nitro-component navigator-view">
            <div className="component-header">
                <div className="header-title">Navigator</div>
            </div>
            <div className="component-body">
            </div>
        </div>
    );
}