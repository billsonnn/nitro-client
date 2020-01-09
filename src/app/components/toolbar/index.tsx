import React, { SyntheticEvent } from 'react';
import { DesktopViewComposer } from '../../../nitro/communication/messages/outgoing/desktop/DesktopViewComposer';
import { INitroInstance } from '../../../nitro/INitroInstance';
import { UserComponent } from './components/user';

export interface ToolbarComponentProps
{
    nitroInstance: INitroInstance;
    isInRoom: boolean;
}

export interface ToolbarComponentState
{
    isActionsOpen: boolean;
}

export class ToolbarComponent extends React.Component<ToolbarComponentProps, ToolbarComponentState>
{
    constructor(props: ToolbarComponentProps)
	{
        super(props);

		this.state = {
            isActionsOpen: true
        };
        
        this.toggleToolbarActions   = this.toggleToolbarActions.bind(this);
        this.toggleDesktopView      = this.toggleDesktopView.bind(this);
    }

    private toggleToolbarActions(event: SyntheticEvent): void
    {
        this.setState({ isActionsOpen: !this.state.isActionsOpen });
    }

    private toggleDesktopView(event: SyntheticEvent): void
    {
        const connection = this.props.nitroInstance.communication.connection;

        if(!connection) return;

        if(this.props.isInRoom) connection.send(new DesktopViewComposer());
    }
    
    public render(): JSX.Element
    {
		return (
            <section className={ "toolbar" + ( this.props.isInRoom ? " is-in-room" : "" ) }>
                <div className="toolbar-actions">
                    <i className={"toolbar-more" + ( !this.state.isActionsOpen ? " is-close" : '' ) } onClick={ this.toggleToolbarActions }></i>
                    <div className="toolbar-icons-content">
                        { this.state.isActionsOpen && <span className={"icon " + ( this.props.isInRoom ? "icon-habbo" : "icon-house" )} onClick={ this.toggleDesktopView } /> }
                        { this.state.isActionsOpen && <span className="icon icon-rooms" /> }
                        <span className="icon icon-catalogue"></span>
                        { this.props.isInRoom && <span className="icon icon-inventory"></span> }

                        <UserComponent nitroInstance={ this.props.nitroInstance } />
                        <span className="icon icon-camera"></span>
                    </div>
                </div>
            </section>
        );
	}
}