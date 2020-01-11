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

    constructor(props: ClientContextInfoUserComponentProps)
    {
        super(props);

        this.state = {
            userData: null
        };
    }

    public componentDidMount(): void
    {
        this.setUserData();
    }

    public componentDidUpdate(prevProps: ClientContextInfoUserComponentProps): void
    {
        if(prevProps.object !== this.props.object) this.setUserData();
    }

    private setUserData(): void
    {
        if(this.state.userData)
        {
            if(!this.props.object)
            {
                this.setState({ userData: null });

                return;
            }
        }

        let userData: RoomUserData = null;

        const nitroInstance = this.context.nitroInstance as INitroInstance;

        if(nitroInstance && this.props.object)
        {
            userData = nitroInstance.roomSession.viewerSession.userData.getUserDataByIndex(this.props.object.id);
        }

        if(userData !== this.state.userData) this.setState({ userData });
    }

    public render(): JSX.Element
    {
        if(!this.state.userData) return null;

        return (
            <div className="nitro-component nitro-component-context nitro-component-user">
                <div className="component-header">
                    <div className="header-title">{ this.state.userData.name }</div>
                    <div className="header-close"><i className="icon close-button"></i></div>
                </div>
                <div className="component-body">
                    <div className="body-info">
                        <div className="body-description">{ this.state.userData.motto }</div>
                    </div>
                </div>
                <div className="component-footer">

                </div>
            </div>
        );
    }
}