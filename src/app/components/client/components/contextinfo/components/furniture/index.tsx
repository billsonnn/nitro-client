import React from 'react';
import { INitroInstance } from '../../../../../../../nitro/INitroInstance';
import { ObjectOperationType } from '../../../../../../../nitro/room/object/logic/ObjectOperationType';
import { RoomObjectModelKey } from '../../../../../../../nitro/room/object/RoomObjectModelKey';
import { FurnitureVisualization } from '../../../../../../../nitro/room/object/visualization/furniture/FurnitureVisualization';
import { FurnitureVisualizationData } from '../../../../../../../nitro/room/object/visualization/furniture/FurnitureVisualizationData';
import { IFurnitureData } from '../../../../../../../nitro/session/furniture/interfaces/IFurnitureData';
import { IRoomObjectController } from '../../../../../../../room/object/IRoomObjectController';
import { NitroContext } from '../../../../../../providers/nitro/context';

export interface ClientContextInfoFurnitureComponentProps
{
    object: IRoomObjectController;
}

export interface ClientContextInfoFurnitureComponentState
{
    furnitureData: IFurnitureData;
}

export class ClientContextInfoFurnitureComponent extends React.Component<ClientContextInfoFurnitureComponentProps, ClientContextInfoFurnitureComponentState>
{
    public static contextType = NitroContext;

    public rendererRef: React.RefObject<HTMLDivElement>;

    constructor(props: ClientContextInfoFurnitureComponentProps)
    {
        super(props);

        this.rendererRef    = React.createRef();
        this.state          = {
            furnitureData: null
        };

        this.closePreview   = this.closePreview.bind(this);
    }

    public componentDidMount(): void
    {
        this.setFurniture();
    }

    public componentDidUpdate(prevProps: ClientContextInfoFurnitureComponentProps): void
    {
        if(prevProps.object === this.props.object) return;
        
        this.setFurniture();
    }

    private setFurniture(): void
    {
        let furnitureData: IFurnitureData = null;

        const nitroInstance = this.context.nitroInstance as INitroInstance;

        if(nitroInstance && this.props.object)
        {
            const data = nitroInstance.session.getFloorItemDataByName(this.props.object.type);

            if(data) furnitureData = data.data;
        }

        this.setState({ furnitureData });
            
        if(furnitureData) this.setFurnitureImage(furnitureData);
    }

    private setFurnitureImage(furnitureData: IFurnitureData): void
    {
        if(!this.props.object || !furnitureData) return;

        const visualization = this.props.object.visualization as FurnitureVisualization;

        if(!visualization) return;

        const data = visualization.data as FurnitureVisualizationData;

        if(!data) return;

        const element = this.rendererRef.current;

        if(!element) return;

        element.children[0] && element.children[0].remove();

        const render = data.renderFurniture(data.getValidDirection(4), this.props.object.model.getValue(RoomObjectModelKey.FURNITURE_COLOR) as number);

        render.view.className = 'canvas';

        element.appendChild(render.view);
    }

    private closePreview(): void
    {
        const nitroInstance = this.context.nitroInstance as INitroInstance;

        //nitroInstance.roomSession.roomEngine
    }

    private handleOperation(operation: string): void
    {
        if(!operation || !this.canMove(this.props.object)) return;

        const nitroInstance = this.context.nitroInstance as INitroInstance;

        if(!nitroInstance) return;

        const session = nitroInstance.roomSession.viewerSession;

        if(!session) return;

        switch(operation)
        {
            case ObjectOperationType.OBJECT_MOVE:
                nitroInstance.roomSession.roomEngine.objectEventHandler.handleRoomObjectOperation(this.props.object.room.id, this.props.object, ObjectOperationType.OBJECT_MOVE);
                return;
            case ObjectOperationType.OBJECT_ROTATE_POSITIVE:
                nitroInstance.roomSession.roomEngine.objectEventHandler.handleRoomObjectOperation(this.props.object.room.id, this.props.object, ObjectOperationType.OBJECT_ROTATE_POSITIVE);
                return;
            case ObjectOperationType.OBJECT_PICKUP:
                nitroInstance.roomSession.roomEngine.objectEventHandler.handleRoomObjectOperation(this.props.object.room.id, this.props.object, ObjectOperationType.OBJECT_PICKUP);
                return;
        }
    }

    private canMove(object: IRoomObjectController): boolean
    {
        return true;
    }

    public render(): JSX.Element
    {
        const name          = (this.state.furnitureData && this.state.furnitureData.name) || '';
        const description   = (this.state.furnitureData && this.state.furnitureData.description) || '';
        const ownerId       = this.props.object && this.props.object.model.getValue(RoomObjectModelKey.FURNITURE_OWNER_ID) as number;
        const ownerName     = this.props.object && this.props.object.model.getValue(RoomObjectModelKey.FURNITURE_OWNER_NAME) as string;

        return (
            <div className="nitro-component nitro-component-context nitro-component-context-furniture">
                <div className="component-header">
                    <div className="header-title">{ name }</div>
                    <div className="header-close" onClick={ this.closePreview }><i className="fas fa-times"></i></div>
                </div>
                <div className="component-body">
                    <div className="body-canvas" ref={ this.rendererRef }></div>
                    <div className="body-info">
                        <div className="body-description">{ description }</div>

                        { ownerName }
                    </div>
                </div>
                <div className="component-footer">
                    <div className="btn-group btn-group-toggle d-flex justify-content-center">
                        <button type="button" className="btn btn-sm btn-destiny" onClick={ () => this.handleOperation(ObjectOperationType.OBJECT_MOVE) }>Move</button>
                        <button type="button" className="btn btn-sm btn-destiny" onClick={ () => this.handleOperation(ObjectOperationType.OBJECT_ROTATE_POSITIVE) }>Rotate</button>
                        <button type="button" className="btn btn-sm btn-destiny" onClick={ () => this.handleOperation(ObjectOperationType.OBJECT_PICKUP) }>Pickup</button>
                        <button type="button" className="btn btn-sm btn-destiny">Use</button>
                    </div>
                </div>
            </div>
        );
    }
}