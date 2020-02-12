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
            nitroInstance.roomEngine.events.addEventListener(RoomEngineObjectEvent.SELECTED, this.onRoomEngineObjectEvent);
            nitroInstance.roomEngine.events.addEventListener(RoomEngineObjectEvent.DESELECTED, this.onRoomEngineObjectEvent);
        }
    }

    public componentWillUnmount(): void
    {
        const nitroInstance = this.context.nitroInstance as INitroInstance;

        if(nitroInstance)
        {
            nitroInstance.roomEngine.events.removeEventListener(RoomEngineObjectEvent.SELECTED, this.onRoomEngineObjectEvent);
            nitroInstance.roomEngine.events.removeEventListener(RoomEngineObjectEvent.DESELECTED, this.onRoomEngineObjectEvent);
        }
    }

    private onRoomEngineObjectEvent(event: RoomEngineObjectEvent): void
    {
        // if(!event) return;

        // switch(event.type)
        // {
        //     case RoomEngineObjectEvent.SELECTED:
        //         this.setState({ object: event.object });
        //         break;
        //     case RoomEngineObjectEvent.DESELECTED:
        //         this.setState({ object: null });
        //         break;
        // }
    }

    public render(): JSX.Element
    {
        if(!this.state.object) return null;

        let contextComponent: JSX.Element = null;

        switch(this.state.object.category)
        {
            case RoomObjectCategory.FLOOR:
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