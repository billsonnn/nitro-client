import { RoomObjectUpdateMessage } from '../messages/RoomObjectUpdateMessage';
import { IVector3D } from '../utils/IVector3D';
import { IRoomObject } from './IRoomObject';
import { IRoomObjectEventHandler } from './logic/IRoomObjectEventHandler';
import { IRoomObjectGraphicVisualization } from './visualization/IRoomObjectGraphicVisualization';

export interface IRoomObjectController extends IRoomObject
{
    setLocation(vector: IVector3D, real?: boolean): void;
    setDirection(vector: IVector3D): void;
    setTempLocation(vector: IVector3D, silent?: boolean): void;
    setState(state: number, silent?: boolean): void;
    setVisualization(visualization: IRoomObjectGraphicVisualization): void;
    setLogic(logic: IRoomObjectEventHandler): void;
    processUpdateMessage(message: RoomObjectUpdateMessage): void;
    isReady: boolean;
    logic: IRoomObjectEventHandler;
}