import { IAssetAnimationLayer } from './IAssetAnimationLayer';

export interface IAssetAnimation
{
    transitionTo?: number;
    transitionFrom?: number;
    layers: { [index: string]: IAssetAnimationLayer };
}