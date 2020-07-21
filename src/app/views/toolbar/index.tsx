import React from 'react';
import { SessionData } from '../../hooks/session/useSessionData';
import { ToolbarUserView } from './user';

export interface ToolbarViewProps
{
    roomStatus: boolean;
    sessionData: SessionData;
    navigatorToggler: () => void;
    inventoryToggler: () => void;
    catalogToggler: () => void;
}

export function ToolbarView(props: ToolbarViewProps): JSX.Element
{
    const [ isExpanded, setIsExpanded ] = React.useState(true);

    return (
        <div className="nitro-component toolbar-view">
            <div className="component-header" onClick={ () => setIsExpanded(!isExpanded) }>
                <div className="header-title">Nitro</div>
            </div>
            { isExpanded && <div className="component-body">
                <div className="toolbar-items">
                    <div className="toolbar-item">
                        <i className={"icon " + ( props.roomStatus ? "icon-habbo" : "icon-house ")} />
                    </div>
                    <div className="toolbar-item" onClick={ () => props.navigatorToggler() }>
                        <i className="icon icon-rooms" />
                    </div>
                    <div className="toolbar-item" onClick={ () => props.inventoryToggler() }>
                        <i className="icon icon-inventory" />
                    </div>
                    <div className="toolbar-item" onClick={ () => props.catalogToggler() }>
                        <i className="icon icon-catalog" />
                    </div>
                </div>
            </div> }
            <div className="component-footer">
                <ToolbarUserView sessionData={ props.sessionData } />
            </div>
        </div>
    );
}