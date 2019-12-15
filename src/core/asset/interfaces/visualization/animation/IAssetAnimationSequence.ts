import { IAssetAnimationSequenceFrame } from './IAssetAnimationSequenceFrame';

export interface IAssetAnimationSequence
{
    frames: { [index: string]: IAssetAnimationSequenceFrame };
}