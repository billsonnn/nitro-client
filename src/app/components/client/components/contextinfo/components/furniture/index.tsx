import React from 'react';
import { INitroInstance } from '../../../../../../../nitro/INitroInstance';
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
            const data = nitroInstance.roomSession.sessionData.getFloorItemDataByName(this.props.object.type);

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

    public render(): JSX.Element
    {
        return (
            <div className="nitro-component nitro-component-context nitro-component-context-furniture">
                <div className="component-header">
                    <div className="header-title">{ (this.state.furnitureData && this.state.furnitureData.name) || '' }</div>
                    <div className="header-close"><i className="icon close-button"></i></div>
                </div>
                <div className="component-body">
                    <div className="body-canvas" ref={ this.rendererRef }></div>
                    <div className="body-info">
                        <div className="body-description">{ (this.state.furnitureData && this.state.furnitureData.description) || '' }</div>
                    </div>
                </div>
                <div className="component-footer">

                </div>
            </div>
        );
    }
}