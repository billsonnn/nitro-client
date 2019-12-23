import { IAssetAnimation, IAssetAnimationSequence, IAssetAnimationSequenceFrameOffset } from '../../../../../core/asset/interfaces/visualization';
import { AnimationLayerData } from './AnimationLayerData';
import { DirectionalOffsetData } from './DirectionalOffsetData';

export class AnimationData
{
    private static TRANSITION_KEY: number = 10;

    private _layers: AnimationLayerData[];
    private _frameCount: number;
    private _randomStart: boolean;
    private _transitionTo: number;

    constructor()
    {
        this._layers        = [];
        this._frameCount    = -1;
        this._randomStart   = false;
        this._transitionTo  = -1;
    }

    public initialize(animation: IAssetAnimation): boolean
    {
        if(!animation) return false;

        const transitionTo = animation.transitionTo;

        if(transitionTo >= 0) this._transitionTo = transitionTo;

        const layers = animation.layers;

        if(layers)
        {
            for(let key in layers)
            {
                const layer = layers[key];

                if(!layer) continue;

                const layerId       = parseInt(key);
                const loopCount     = layer.loopCount !== undefined ? layer.loopCount : 1;
                const frameRepeat   = layer.frameRepeat !== undefined ? layer.frameRepeat : 1;
                const isRandom      = layer.random !== undefined ? layer.random === 1 : false;

                if(!this.processAnimationLayer(layerId, loopCount, frameRepeat, isRandom, layer.frameSequences)) return false;
            }
        }

        return true;
    }

    public dispose(): void
    {
        for(let i = this._layers.length - 1; i >= 0; i--)
        {
            const layer = this._layers[i];

            if(!layer) continue;

            layer.dispose();
        }

        this._transitionTo  = -1;
        this._layers        = [];
    }

    private processAnimationLayer(layerId: number, loopCount: number, frameRepeat: number, isRandom: boolean, frameSequences: { [index: string]: IAssetAnimationSequence }): boolean
    {
        const animationLayerData = new AnimationLayerData(loopCount, frameRepeat, isRandom);

        if(!animationLayerData) return false;

        for(let key in frameSequences)
        {
            const frameSequence = frameSequences[key];

            if(!frameSequence) continue;

            const sequenceData = animationLayerData.createFrameSequence();

            for(let frame in frameSequence.frames)
            {
                const frameData = frameSequence.frames[frame];

                if(!frameData) continue;

                let randomX = 0;
                let randomY = 0;
                
                sequenceData.addFrame(frameData.id, frameData.x, frameData.y, randomX, randomY, this.processDirectionalOffsets(frameData.offsets));
            }
        }

        this._layers[layerId] = animationLayerData;
        
        return true;
    }

    private processDirectionalOffsets(offsets: IAssetAnimationSequenceFrameOffset[]): DirectionalOffsetData
    {
        if(!offsets) return null;

        const totalOffsets = offsets.length;

        if(!totalOffsets) return null;

        const directionalOffsetData = new DirectionalOffsetData();

        for(let i = 0; i < totalOffsets; i++)
        {
            const offset = offsets[i];

            if(!offset) continue;

            directionalOffsetData.setDirection(offset.direction, offset.x, offset.y);
        }

        return directionalOffsetData;
    }

    public getLayer(layerId: number): AnimationLayerData
    {
        const existing = this._layers[layerId];

        if(!existing) return null;

        return existing;
    }

    public static getAnimationToTransition(animationId: number): number
    {
        return parseInt('' + AnimationData.TRANSITION_KEY + animationId);
    }

    public get transitionTo(): number
    {
        return this._transitionTo;
    }
}