import React, { SyntheticEvent } from 'react';
import { IConnection } from '../../../core/communication/connections/IConnection';
import { UserInfoEvent } from '../../../nitro/communication/messages/incoming/user/data/UserInfoEvent';
import { DesktopViewComposer } from '../../../nitro/communication/messages/outgoing/desktop/DesktopViewComposer';
import { NitroInstance } from '../../../nitro/NitroInstance';

export interface ToolbarComponentProps
{
    isClient: boolean;
}

export interface ToolbarComponentState
{
    connection: IConnection;
    isActionsOpen: boolean;
    figure: string;
}

export class ToolbarComponent extends React.Component<ToolbarComponentProps, ToolbarComponentState>
{
    private _userInfoEvent: UserInfoEvent;

    constructor(props: ToolbarComponentProps)
	{
        super(props);

        this._userInfoEvent = new UserInfoEvent(this.onUserInfoEvent.bind(this));

		this.state = {
            connection: NitroInstance.instance.communication.connection,
            isActionsOpen: true,
            figure: null
        };
        
        this.toggleToolbarActions   = this.toggleToolbarActions.bind(this);
        this.toggleDesktopView      = this.toggleDesktopView.bind(this);
    }

    public componentDidMount(): void
	{
		//this.state.connection.addMessageEvent(this._userInfoEvent);
	}

	public componentWillUnmount(): void
	{
        console.log('unmount')
        //this.state.connection.removeMessageEvent(this._userInfoEvent);
    }
    
    private onUserInfoEvent(event: UserInfoEvent): void
    {
        if(!(event instanceof UserInfoEvent)) return;

        const parser = event.getParser();

        if(!parser) return;

        this.setState({ figure: parser.userInfo && parser.userInfo.username })
    }

    private toggleToolbarActions(event: SyntheticEvent): void
    {
        this.setState({ isActionsOpen: !this.state.isActionsOpen });
    }

    private toggleDesktopView(event: SyntheticEvent): void
    {
        const connection = NitroInstance.instance.communication.connection;

        if(!connection) return;

        if(this.props.isClient) connection.send(new DesktopViewComposer());
    }
    
    public render(): JSX.Element
    {
		return (
            <section className={"toolbar" + (this.props.isClient ? " is-client" : "")}>
                <div className="toolbar-actions">
                    <i className={"toolbar-more" + (!this.state.isActionsOpen ? " is-close" : '')} onClick={ this.toggleToolbarActions }></i>
                    <div className="toolbar-icons-content">
                        { this.state.isActionsOpen && <span className={"icon " + ( this.props.isClient ? "icon-house" : "icon-habbo" )} onClick={ this.toggleDesktopView }></span> }
                        <span className="icon icon-catalogue"></span>
                        { this.props.isClient && <span className="icon icon-inventory"></span> }

                        <span className="user">
                            <i className="notification">3</i>
                            <img src={"https://habbo.com.br/habbo-imaging/avatarimage?figure=" + (this.state.figure) + "&headonly=0&direction=2&head_direction=2&action=&gesture=&size=m"} />
                        </span>
                    </div>
                </div>
            </section>
        );
	}
}