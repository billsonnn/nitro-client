import { IRoomInstance } from '../IRoomInstance';
import { RoomObjectUpdateMessage } from '../messages/RoomObjectUpdateMessage';
import { Position } from '../utils/Position';
import { IRoomObject } from './IRoomObject';
import { IRoomObjectLogic } from './logic/IRoomObjectLogic';
import { IRoomObjectSpriteVisualization } from './visualization/IRoomObjectSpriteVisualization';

export interface IRoomObjectController extends IRoomObject
{
    setRoom(room: IRoomInstance): void;
    setPosition(position: Position): void;
    setTempPosition(position: Position, silent?: boolean): void;
    setState(state: number, silent?: boolean): void;
    setVisualization(visualization: IRoomObjectSpriteVisualization): void;
    setLogic(logic: IRoomObjectLogic): void;
    processUpdateMessage(message: RoomObjectUpdateMessage): void;
    isReady: boolean;
}