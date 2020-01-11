import React from 'react';
import { ClientChatInputComponent } from './components/chatinput/index';

export interface ClientChatComponentProps {}

export interface ClientChatComponentState {}

export class ClientChatComponent extends React.Component<ClientChatComponentProps, ClientChatComponentState>
{
    public render(): JSX.Element
    {
        return (
            <section className="client-chat">
                <ClientChatInputComponent />
            </section>
        );
    }
}