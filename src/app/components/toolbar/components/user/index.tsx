import React from 'react';
import { UserFigureEvent } from '../../../../../nitro/communication/messages/incoming/user/data/UserFigureEvent';
import { UserInfoEvent } from '../../../../../nitro/communication/messages/incoming/user/data/UserInfoEvent';
import { INitroInstance } from '../../../../../nitro/INitroInstance';

export interface UserComponentProps
{
    nitroInstance: INitroInstance;
}

export interface UserComponentComponentState
{
    figure: string;
    gender: string;
}

export class UserComponent extends React.Component<UserComponentProps, UserComponentComponentState>
{
    private _userInfoEvent: UserInfoEvent;
    private _userFigureEvent: UserFigureEvent;

    constructor(props: UserComponentProps)
	{
        super(props);

        this._userInfoEvent     = new UserInfoEvent(this.onUserInfoEvent.bind(this));
        this._userFigureEvent   = new UserFigureEvent(this.onUserFigureEvent.bind(this));

		this.state = {
            figure: null,
            gender: null
        };
    }

    public componentDidMount(): void
	{
        if(this.props.nitroInstance)
        {
            const connection = this.props.nitroInstance.communication.connection;

            if(connection)
            {
                connection.addMessageEvent(this._userInfoEvent);
                connection.addMessageEvent(this._userFigureEvent);
            }
        }
	}

	public componentWillUnmount(): void
	{
        if(this.props.nitroInstance)
        {
            const connection = this.props.nitroInstance.communication.connection;

            if(connection)
            {
                connection.removeMessageEvent(this._userInfoEvent);
                connection.removeMessageEvent(this._userFigureEvent);
            }
        }
    }
    
    private onUserInfoEvent(event: UserInfoEvent): void
    {
        if(!(event instanceof UserInfoEvent)) return;

        const parser = event.getParser();

        if(!parser) return;

        this.setState({
            figure: parser.userInfo && parser.userInfo.figure,
            gender: parser.userInfo && parser.userInfo.gender
        });
    }

    private onUserFigureEvent(event: UserFigureEvent): void
    {
        if(!(event instanceof UserFigureEvent)) return;

        const parser = event.getParser();

        if(!parser) return;

        this.setState({
            figure: parser.figure,
            gender: parser.gender
        });
    }
    
    public render(): JSX.Element
    {
		return (
            <section className="user">
                <div className="user-avatar" style={{backgroundImage: "url('https://habbo.com.br/habbo-imaging/avatarimage?figure=" + ( this.state.figure ) +"&headonly=0&direction=2&head_direction=2&action=&gesture=&size=m')" }} />
            </section>
        );
	}
}