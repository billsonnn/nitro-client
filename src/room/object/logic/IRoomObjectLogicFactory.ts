import { IRoomObjectLogic } from './IRoomObjectLogic';

export interface IRoomObjectLogicFactory
{
    getLogic(type: string): IRoomObjectLogic;
}