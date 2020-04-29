import { IRoomWidget } from '../../IRoomWidget';

export interface ITrophyFurniWidget extends IRoomWidget
{
    name: string;
    date: string;
    message: string;
    color: number;
}