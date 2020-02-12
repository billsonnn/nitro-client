import React from 'react';
import ReactDOM from 'react-dom';
import { INitroInstance } from '../../../../../nitro/INitroInstance';
import { RoomEngineObjectEvent } from '../../../../../nitro/room/events/RoomEngineObjectEvent';
import { NitroContext } from '../../../../providers/nitro/context';

export interface ContextMenuComponentProps {}

export interface ContextMenuComponentState {}

export class ClientContextMenuComponent extends React.Component<ContextMenuComponentProps, ContextMenuComponentState>
{
    public static contextType = NitroContext;

    constructor(props: ContextMenuComponentProps)
    {
        super(props);

        this.state = {};

        this.onRoomEngineObjectEvent = this.onRoomEngineObjectEvent.bind(this);
    }

    public componentDidMount(): void
    {
        const nitroInstance = this.context.nitroInstance as INitroInstance;

        if(nitroInstance)
        {
            nitroInstance.roomEngine.events.addEventListener(RoomEngineObjectEvent.SELECTED, this.onRoomEngineObjectEvent);
        }
    }

    public componentWillUnmount(): void
    {
        const nitroInstance = this.context.nitroInstance as INitroInstance;

        if(nitroInstance)
        {
            nitroInstance.roomEngine.events.removeEventListener(RoomEngineObjectEvent.SELECTED, this.onRoomEngineObjectEvent);
        }
    }

    private onRoomEngineObjectEvent(event: RoomEngineObjectEvent): void
    {
        if(!event) return;

        //const object = event.object;

        // if(!object)
        // {
        //     // clear existing context menu
        //     return;
        // }

        const node = ReactDOM.findDOMNode(this) as HTMLElement;

        //const gloalPoint = object.room.renderer.toGlobal(new PIXI.Point(screenPosition.x, screenPosition.y));

        //node.style.top = `${ gloalPoint.y }px`;
        //node.style.left = `${ gloalPoint.x }px`;
    }

    public render(): JSX.Element
    {
        return (
            <section className="context-menu">
                <div className="menu-header">Bill</div>
                <ul className="menu-actions"></ul>
                <div className="menu-footer">
                    <i className="icon icon-carret-up"></i>
                </div>
            </section>
        );
    }
}