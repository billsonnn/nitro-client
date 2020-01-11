import React from 'react';
import { INitroInstance } from '../../../../../nitro/INitroInstance';
import { RoomEngineObjectEvent } from '../../../../../nitro/room/events/RoomEngineObjectEvent';
import { RoomObjectCategory } from '../../../../../nitro/room/object/RoomObjectCategory';
import { IRoomObjectController } from '../../../../../room/object/IRoomObjectController';
import { NitroContext } from '../../../../providers/nitro/context';
import { ClientContextInfoFurnitureComponent } from './components/furniture';
import { ClientContextInfoUserComponent } from './components/user';

export interface ClientContextInfoComponentProps {}

export interface ClientContextInfoComponentState
{
    object: IRoomObjectController;
}

export class ClientContextInfoComponent extends React.Component<ClientContextInfoComponentProps, ClientContextInfoComponentState>
{
    public static contextType = NitroContext;

    constructor(props: ClientContextInfoComponentProps)
    {
        super(props);

        this.state = {
            object: null
        };

        this.onRoomEngineObjectEvent = this.onRoomEngineObjectEvent.bind(this);
    }

    public componentDidMount(): void
    {
        const nitroInstance = this.context.nitroInstance as INitroInstance;

        if(nitroInstance)
        {
            nitroInstance.roomSession.roomEngine.events.addEventListener(RoomEngineObjectEvent.SELECTED, this.onRoomEngineObjectEvent);
        }
    }

    public componentWillUnmount(): void
    {
        const nitroInstance = this.context.nitroInstance as INitroInstance;

        if(nitroInstance)
        {
            nitroInstance.roomSession.roomEngine.events.removeEventListener(RoomEngineObjectEvent.SELECTED, this.onRoomEngineObjectEvent);
        }
    }

    private onRoomEngineObjectEvent(event: RoomEngineObjectEvent): void
    {
        if(!event || event.object === this.state.object) return;

        this.setState({ object: event.object });
    }

    public render(): JSX.Element
    {
        if(!this.state.object) return null;

        let contextComponent: JSX.Element = null;

        switch(this.state.object.category)
        {
            case RoomObjectCategory.FURNITURE:
                contextComponent = <ClientContextInfoFurnitureComponent object={ this.state.object } />;
                break;
            case RoomObjectCategory.UNIT:
                contextComponent = <ClientContextInfoUserComponent object={ this.state.object } />;
        }

        return (
            <section className="context-info">
                { contextComponent }
            </section>
        );
    }
}