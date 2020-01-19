export interface IVector3D
{
    toScreen(): IVector3D;
    x: number;
    y: number;
    z: number;
    length: number;
    isScreen: boolean;
}
