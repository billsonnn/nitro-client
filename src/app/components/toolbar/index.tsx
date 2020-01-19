import React, { SyntheticEvent } from 'react';
import { DesktopViewComposer } from '../../../nitro/communication/messages/outgoing/desktop/DesktopViewComposer';
import { NitroContext } from '../../providers/nitro/context';
import { ToolbarUserComponent } from './components/user';

export interface ToolbarComponentProps
{
    isInRoom: boolean;
}

export interface ToolbarComponentState
{
    isOpen: boolean;
}

export class ToolbarComponent extends React.Component<ToolbarComponentProps, ToolbarComponentState>
{
    public static contextType = NitroContext;

    constructor(props: ToolbarComponentProps)
	{
        super(props);

		this.state = {
            isOpen: true
        };
        
        this.toggleOpen         = this.toggleOpen.bind(this);
        this.toggleDesktop      = this.toggleDesktop.bind(this);
        this.toggleNavigator    = this.toggleNavigator.bind(this);
        this.toggleInventory    = this.toggleInventory.bind(this);
        this.toggleCatalog      = this.toggleCatalog.bind(this);
        this.toggleCamera       = this.toggleCamera.bind(this);
    }

    private toggleOpen(event: SyntheticEvent): void
    {
        this.setState({ isOpen: !this.state.isOpen });
    }

    private toggleDesktop(event: SyntheticEvent): void
    {
        if(!this.context.nitroInstance) return;
        
        const connection = this.context.nitroInstance.communication.connection;

        if(!connection) return;

        if(this.props.isInRoom) connection.send(new DesktopViewComposer());
    }

    private toggleNavigator(event: SyntheticEvent): void
    {
        return;
    }

    private toggleInventory(event: SyntheticEvent): void
    {
        return;
    }

    private toggleCatalog(event: SyntheticEvent): void
    {
        return;
    }

    private toggleCamera(event: SyntheticEvent): void
    {
        return;
    }
    
    public render(): JSX.Element
    {
		return (
            <div className="nitro-component nitro-component-toolbar">
                <div className="component-header" onClick={ this.toggleOpen }>
                    <div className="header-title">Nitro</div>
                </div>
                { this.state.isOpen && <div className="component-body">
                    <div className="toolbar-items">
                        <div className="toolbar-item" onClick={ this.toggleDesktop }>
                            <i className={"icon " + ( this.props.isInRoom ? "icon-habbo" : "icon-house ")} />
                        </div>
                        <div className="toolbar-item" onClick={ this.toggleNavigator }>
                            <i className="icon icon-rooms" />
                        </div>
                        <div className="toolbar-item" onClick={ this.toggleInventory }>
                            <i className="icon icon-inventory" />
                        </div>
                        <div className="toolbar-item" onClick={ this.toggleCatalog }>
                            <i className="icon icon-catalog" />
                        </div>
                        <div className="toolbar-item" onClick={ this.toggleCamera }>
                            <i className="icon icon-camera" />
                        </div>
                    </div>
                </div> }
                <div className="component-footer">
                    <ToolbarUserComponent />
                </div>
            </div>
        );
	}
}