import { IFurnitureDimension } from './IFurnitureDimension';

export interface IFurnitureData
{
    id: number;
    className: string;
    name: string;
    description: string;
    furniLine: string;
    colors: number[];
    dimensions: IFurnitureDimension;
    offerId: number;
    adUrl: string;
    excludeDynamic: boolean;
    specialType: number;
    customParams: string;
}