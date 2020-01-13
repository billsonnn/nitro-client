import React from 'react';
import { INitroInstance } from '../../../../../../../nitro/INitroInstance';
import { RoomUserData } from '../../../../../../../nitro/session/RoomUserData';
import { IRoomObjectController } from '../../../../../../../room/object/IRoomObjectController';
import { NitroContext } from '../../../../../../providers/nitro/context';

export interface ClientContextInfoUserComponentProps
{
    object: IRoomObjectController;
}

export interface ClientContextInfoUserComponentState
{
    userData: RoomUserData;
}

export class ClientContextInfoUserComponent extends React.Component<ClientContextInfoUserComponentProps, ClientContextInfoUserComponentState>
{
    public static contextType = NitroContext;

    public rendererRef: React.RefObject<HTMLDivElement>;

    constructor(props: ClientContextInfoUserComponentProps)
    {
        super(props);

        this.rendererRef    = React.createRef();
        this.state          = {
            userData: null
        };
    }

    public componentDidMount(): void
    {
        this.setUser();
    }

    public componentDidUpdate(prevProps: ClientContextInfoUserComponentProps): void
    {
        if(prevProps.object === this.props.object) return;
        
        this.setUser();
    }

    private setUser(): void
    {
        let userData: RoomUserData = null;

        const nitroInstance = this.context.nitroInstance as INitroInstance;

        if(nitroInstance && this.props.object)
        {
            const data = nitroInstance.roomSession.viewerSession.userData.getUserDataByIndex(this.props.object.id);

            if(data) userData = data;
        }

        this.setState({ userData });
            
        if(userData) this.setUserImage(userData);
    }

    private setUserImage(userData: RoomUserData): void
    {
        if(!this.props.object || !userData) return;

        const element = this.rendererRef.current;

        if(!element) return;

        element.children[0] && element.children[0].remove();

        const render = this.context.nitroInstance.avatar.renderAvatar(userData.figure, 4, 4);

        render.view.className = 'canvas';

        element.appendChild(render.view);
    }

    public render(): JSX.Element
    {
        return (
            <div className="nitro-component nitro-component-context nitro-component-context-user">
                <div className="component-header">
                    <div className="header-title">{ this.state.userData && this.state.userData.name }</div>
                    <div className="header-close"><i className="icon close-button"></i></div>
                </div>
                <div className="component-body">
                    <div className="body-canvas" ref={ this.rendererRef }></div>
                    <div className="user-info">
                    </div>
                    <div className="body-info">
                        <div className="body-description">{ this.state.userData && this.state.userData.motto }</div>
                    </div>
                </div>
                <div className="component-footer">

                </div>
            </div>
        );
    }
}