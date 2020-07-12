import React from 'react';

export interface InventoryProps
{
}

export function Inventory(props: InventoryProps): JSX.Element
{
    return (
        <div className="nitro-component inventory-view">
            <div className="component-header">
                <div className="header-title">Inventory</div>
            </div>
            <div className="component-body">
            </div>
        </div>
    );
}