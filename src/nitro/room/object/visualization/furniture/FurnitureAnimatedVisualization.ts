import { IObjectVisualizationData } from '../../../../../room/object/visualization/IRoomObjectVisualizationData';
import { AnimationData } from '../data/AnimationData';
import { AnimationFrameData } from '../data/AnimationFrameData';
import { AnimationFrameSequenceData } from '../data/AnimationFrameSequenceData';
import { ObjectVisualizationType } from '../ObjectVisualizationType';
import { FurnitureAnimatedVisualizationData } from './FurnitureAnimatedVisualizationData';
import { FurnitureVisualization } from './FurnitureVisualization';

export class FurnitureAnimatedVisualization extends FurnitureVisualization
{
    public static TYPE: string = ObjectVisualizationType.FURNITURE_ANIMATED;

    protected _data: FurnitureAnimatedVisualizationData;

    protected _animationId: number;
    protected _realAnimationId: number;
    protected _animationAfterTransition: number;
    protected _animationFinished: boolean;
    protected _currentFrames: AnimationFrameData[];
    protected _layerFrames: number[];
    protected _layerSequence: AnimationFrameSequenceData[];
    protected _layerFramesFinished: boolean[];
    protected _layerLoopCount: number[];
    protected _needsAnimationUpdate: boolean;

    constructor()
    {
        super();

        this._animationId               = -1;
        this._realAnimationId           = -1;
        this._animationAfterTransition  = -1;
        this._animationFinished         = false;
        this._currentFrames             = [];
        this._layerFrames               = [];
        this._layerSequence             = [];
        this._layerFramesFinished       = [];
        this._layerLoopCount            = [];
        this._needsAnimationUpdate      = false;
    }

    public initialize(data: IObjectVisualizationData): boolean
    {
        if(!(data instanceof FurnitureAnimatedVisualizationData)) return false;

        return super.initialize(data);
    }

    public dispose(): void
    {
        super.dispose();

        this.resetAnimation();

        this._needsAnimationUpdate = false;
    }

    private resetAnimation(): void
    {
        this.resetLayers();

        this._animationAfterTransition  = -1;
        this._animationFinished         = false;
        this._animationAfterTransition  = -1;
        this._currentFrames             = [];
        this._layerFrames               = [];
        this._layerSequence             = [];
        this._layerFramesFinished       = [];
        this._layerLoopCount            = [];
        this._needsAnimationUpdate      = true;
    }

    protected updateObject(): boolean
    {
        if(super.updateObject())
        {
            const state = this.object.state;

            if(state !== this._realAnimationId)
            {
                this.setAnimation(state);

                this._realAnimationId = state;
            }

            return true;
        }

        return false;
    }

    protected updateAnimation(): boolean
    {
        if(!this._needsAnimationUpdate) return false;

        let currentFrameCount = 0;

        if(this._animationFinished)
        {
            if(this._animationAfterTransition === -1)
            {
                this._needsAnimationUpdate = false;

                return false;
            }

            this.setAnimation(this._animationAfterTransition, false);
        }
        
        const animationData = this._data.getAnimation(this._animationId);

        if(!animationData)
        {
            this._needsAnimationUpdate = false;

            return false;
        }

        const direction = this._direction;

        let doesLoop        = false;
        let layersFinished  = 0;
        let needsUpdate     = false;

        for(let i = 0; i < this.layerCount; i++)
        {
            if(this._layerFramesFinished[i])
            {
                layersFinished++;

                continue;
            }

            if(this._layerFrames[i] === undefined) this._layerFrames[i]                 = -1;
            if(this._layerSequence[i] === undefined) this._layerSequence[i]             = null;
            if(this._layerFramesFinished[i] === undefined) this._layerFramesFinished[i] = false;
            if(this._layerLoopCount[i] === undefined) this._layerLoopCount[i]           = 0;

            const animationLayer = animationData.getLayer(i);

            let currentFrame        = this._currentFrames[i];
            let currentSequence     = this._layerSequence[i];
            let nextFrameNumber     = 0;

            if(animationLayer)
            {
                if(!currentSequence)
                {
                    this._layerSequence[i] = animationLayer.getFrameSequence();

                    currentSequence = this._layerSequence[i];
                }
                
                if(currentSequence)
                {
                    const lastFrameNumber = currentSequence.frameNumbers[currentSequence.frameNumbers.length - 1];

                    const frameData = currentSequence.getFrameForCount(currentFrameCount);

                    if(frameData)
                    {
                        if(frameData.id === lastFrameNumber)
                        {
                            this._layerLoopCount[i]++;

                            this._layerSequence[i] = null;
                        }

                        if(animationLayer.loopCount === 0) doesLoop = true;

                        else if((animationLayer.loopCount >= 1) && (this._layerLoopCount[i] === animationLayer.loopCount)) this._layerFramesFinished[i] = true;

                        if(currentFrame && (currentFrame.x(direction) !== frameData.x(direction) || currentFrame.y(direction) !== frameData.y(direction) || currentFrame.id !== frameData.id)) needsUpdate = true;

                        if(!currentFrame || (currentFrame.id !== frameData.id)) needsUpdate = true;

                        this._currentFrames[i] = frameData;

                        nextFrameNumber = frameData.id;
                    }
                    else this._currentFrames[i] = null;
                }
            }
            else this._layerFramesFinished[i] = true;

            this._layerFrames[i] = nextFrameNumber;
        }

        let animationFinished = !doesLoop && (layersFinished === this.layerCount);

        if(animationFinished)
        {
            this._animationFinished         = true;
            this._animationAfterTransition  = animationData.transitionTo;
        }
        
        return needsUpdate;
    }

    protected setAnimation(animationId: number, transition: boolean = true): boolean
    {
        if(this._animationId === -1) transition = false;

        if(this._animationId === animationId)
        {
            this._needsAnimationUpdate = false;
            
            return false;
        }

        if(transition)
        {
            const animationTransition = AnimationData.getAnimationToTransition(animationId);

            if(this._animationId === animationTransition) return false;

            if(this._data.hasAnimation(animationTransition)) animationId = animationTransition;
        }
        else
        {
            this._realAnimationId = animationId;
        }

        //this.resetTicker();

        this.object.setState(animationId, true);

        this._animationId = animationId;

        this.resetAnimation();

        return true;
    }

    protected getFrameNumber(layerId: number): number
    {
        const existing = this._layerFrames[layerId];

        if(existing) return existing;

        return 0;
    }

    protected getLayerXOffset(direction: number, layerId: number): number
    {
        const existing = super.getLayerXOffset(direction, layerId);

        const currentFrame = this._currentFrames[layerId];

        if(!currentFrame) return existing;

        return existing + currentFrame.x(direction);
    }

    protected getLayerYOffset(direction: number, layerId: number): number
    {
        const existing = super.getLayerYOffset(direction, layerId);

        const currentFrame = this._currentFrames[layerId];

        if(!currentFrame) return existing;

        return existing + currentFrame.y(direction);
    }
}