import React from 'react';

export interface ClientChatInputComponentProps {}

export interface ClientChatInputComponentState
{
    message: string;
}

export class ClientChatInputComponent extends React.Component<ClientChatInputComponentProps, ClientChatInputComponentState>
{
    constructor(props: ClientChatInputComponentProps)
    {
        super(props)

        this.state = {
            message: ''
        };

        this.updateChat = this.updateChat.bind(this);
    }

    private updateChat(event: any): void
    {
        this.setState({ message: event.target.value });
    }
    
    public render(): JSX.Element
    {
        return (
            <div className="nitro-component-chat-input">
                <input type="text" className="chat-input" placeholder="Click here to chat...." autoFocus value={ this.state.message } onChange={ this.updateChat } />
            </div>
        );
    }
}