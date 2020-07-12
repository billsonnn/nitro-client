import React from 'react';

export interface CatalogProps
{
}

export function Catalog(props: CatalogProps): JSX.Element
{
    return (
        <div className="nitro-component catalog-view">
            <div className="component-header">
                <div className="header-title">Catalog</div>
            </div>
            <div className="component-body">
            </div>
        </div>
    );
}