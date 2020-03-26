import { IObjectVisualizationData } from '../../../../../room/object/visualization/IRoomObjectVisualizationData';
import { RoomObjectVariable } from '../../RoomObjectVariable';
import { RoomObjectVisualizationType } from '../../RoomObjectVisualizationType';
import { AnimationData } from '../data/AnimationData';
import { AnimationFrame } from '../data/AnimationFrame';
import { AnimationStateData } from '../data/AnimationStateData';
import { FurnitureAnimatedVisualizationData } from './FurnitureAnimatedVisualizationData';
import { FurnitureVisualization } from './FurnitureVisualization';

export class FurnitureAnimatedVisualization extends FurnitureVisualization
{
    private static FRAME_INCREASE_AMOUNT: number = 1;

    public static TYPE: string                  = RoomObjectVisualizationType.FURNITURE_ANIMATED;
    public static DEFAULT_ANIMATION_ID: number  = 0;

    protected _data: FurnitureAnimatedVisualizationData;

    private _state: number;
    private _animationData: AnimationStateData;
    private _animationChangeTime: number;
    private _animatedLayerCount: number;
    private _directionChanged: boolean;
    private _didSet: boolean;

    constructor()
    {
        super();

        this._state                 = -1;
        this._animationData         = new AnimationStateData();
        this._animationChangeTime   = 0;
        this._animatedLayerCount    = 0;
        this._directionChanged      = false;
        this._didSet                = false;
    }

    public initialize(data: IObjectVisualizationData): boolean
    {
        if(!(data instanceof FurnitureAnimatedVisualizationData)) return false;

        return super.initialize(data);
    }

    public dispose():void
    {
        super.dispose();

        if(this._animationData)
        {
            this._animationData.dispose();

            this._animationData = null;
        }
    }

    protected get animatedLayerCount(): number
    {
        return this._animatedLayerCount;
    }

    protected setDirection(direction: number): void
    {
        if(this._direction === direction) return;

        super.setDirection(direction);
        
        this._directionChanged = true;
    }

    public get animationId(): number
    {
        return this._animationData.animationId;
    }

    protected getAnimationId(animationData: AnimationStateData): number
    {
        if((this.animationId !== FurnitureAnimatedVisualization.DEFAULT_ANIMATION_ID) && this._data.hasAnimation(this.animationId)) return this.animationId;

        return FurnitureAnimatedVisualization.DEFAULT_ANIMATION_ID;
    }

    protected updateObject(direction: number): boolean
    {
        if(super.updateObject(direction))
        {
            const state = this.object.state;

            if(state !== this._state)
            {
                this.setAnimation(state);

                this._state = state;

                this._animationChangeTime = this.object.model.getValue(RoomObjectVariable.FURNITURE_STATE_UPDATE_TIME) as number || 0;
            }

            return true;
        }

        return false;
    }

    protected updateModel(): boolean
    {
        if(super.updateModel())
        {
            if(this.usesAnimationResetting())
            {
                const updateTime = this.object.model.getValue(RoomObjectVariable.FURNITURE_STATE_UPDATE_TIME);

                if(updateTime > this._animationChangeTime)
                {
                    this._animationChangeTime = updateTime;

                    this.setAnimation(this._state);
                }
            }

            // const automaticState = this.object.model.getValue(RoomObjectModelKey.FURNITURE_AUTOMATIC_STATE_INDEX) as number;

            // if(!isNaN(automaticState))
            // {
            //     const state = this._data.getAnimationId(automaticState);
            //     this.setAnimation(state);
            // }

            return true;
        }

        return false;
    }

    private isPlayingTransition(animationData: AnimationStateData, animationId: number): boolean
    {
        if(!AnimationData.isTransitionFromAnimation(animationData.animationId) && !AnimationData.isTransitionToAnimation(animationData.animationId)) return false;

        if(animationId !== animationData.animationAfterTransitionId) return false;

        if(animationData.animationOver) return false;

        return true;
    }

    private getCurrentState(animationData: AnimationStateData): number
    {
        if(!AnimationData.isTransitionFromAnimation(animationData.animationId) && !AnimationData.isTransitionToAnimation(animationData.animationId)) return animationData.animationId;

        return animationData.animationAfterTransitionId;
    }

    protected setAnimation(animationId: number):void
    {
        if(!this._data) return;
        
        this.setSubAnimation(this._animationData, animationId, (this._state >= 0));
    }

    protected setSubAnimation(animationData: AnimationStateData, animationId: number, _arg_3: boolean = true): boolean
    {
        if(_arg_3)
        {
            if(this.isPlayingTransition(animationData, animationId)) return false;

            const state = this.getCurrentState(animationData);

            if(animationId !== state)
            {
                if(!this._data.isImmediateChange(animationId, state))
                {
                    let transition = AnimationData.getTransitionFromAnimationId(state);

                    if(this._data.hasAnimation(transition))
                    {
                        animationData.animationAfterTransitionId = animationId;
                        animationId = transition;
                    }
                    else
                    {
                        transition = AnimationData.getTransitionToAnimationId(animationId);

                        if(this._data.hasAnimation(transition))
                        {
                            animationData.animationAfterTransitionId = animationId;
                            animationId = transition;
                        }
                    }
                }
            }
            else
            {
                if(AnimationData.isTransitionFromAnimation(animationData.animationId))
                {
                    const transition = AnimationData.getTransitionToAnimationId(animationId);

                    if(this._data.hasAnimation(transition))
                    {
                        animationData.animationAfterTransitionId = animationId;
                        animationId = transition;
                    }
                }
                else
                {
                    if(!AnimationData.isTransitionToAnimation(animationData.animationId))
                    {
                        if(this.usesAnimationResetting())
                        {
                            const transition = AnimationData.getTransitionFromAnimationId(state);

                            if(this._data.hasAnimation(transition))
                            {
                                animationData.animationAfterTransitionId = animationId;
                                animationId = transition;
                            }
                            else
                            {
                                const transition = AnimationData.getTransitionToAnimationId(animationId);

                                if(this._data.hasAnimation(transition))
                                {
                                    animationData.animationAfterTransitionId = animationId;
                                    animationId = transition;
                                }
                            }
                        }
                    }
                }
            }
        }

        if(animationData.animationId !== animationId)
        {
            animationData.animationId = animationId;

            return true;
        }

        return false;
    }

    protected getLastFramePlayed(layerId: number): boolean
    {
        return this._animationData.getLastFramePlayed(layerId);
    }

    protected resetAllAnimationFrames(): void
    {
        if(!this._animationData) return;
        
        this._animationData.setLayerCount(this._animatedLayerCount);
    }

    protected updateAnimation(): number
    {
        if(!this._data) return 0;

        if(!this._didSet)
        {
            this._animatedLayerCount = this._data.layerCount;
            this.resetAllAnimationFrames();

            this._didSet = true;
        }

        const update = this.updateAnimations();

        this._directionChanged = false;

        return update;;
    }

    protected updateAnimations(): number
    {
        if(this._animationData.animationOver && !this._directionChanged) return 0;

        const update = this.updateFramesForAnimation(this._animationData);

        if(this._animationData.animationOver)
        {
            if((AnimationData.isTransitionFromAnimation(this._animationData.animationId)) || (AnimationData.isTransitionToAnimation(this._animationData.animationId)))
            {
                this.setAnimation(this._animationData.animationAfterTransitionId);
                this._animationData.animationOver = false;
            }
        }

        return update;
    }

    protected updateFramesForAnimation(animationData: AnimationStateData): number
    {
        if((animationData.animationOver) && (!(this._directionChanged))) return 0;

        let animationId = this.getAnimationId(animationData);
        let frameCount  = animationData.frameCounter;

        if(!frameCount) frameCount = this._data.getStartFrame(animationId, this._direction);

        frameCount                  = (frameCount + FurnitureAnimatedVisualization.FRAME_INCREASE_AMOUNT);
        animationData.frameCounter  = frameCount;
        animationData.animationOver = true;

        let animationPlayed = false;
        let layerId         = (this._animatedLayerCount - 1);
        let update          = 0;
        let layerUpdate     = (1 << (this._animatedLayerCount - 1));

        while (layerId >= 0)
        {
            let sequenceId: number = 0;

            animationPlayed = animationData.getAnimationPlayed(layerId);

            if(!animationPlayed || this._directionChanged)
            {
                let lastFramePlayed = animationData.getLastFramePlayed(layerId);
                let frame           = animationData.getFrame(layerId);

                if(frame)
                {
                    if(frame.isLastFrame && (frame.remainingFrameRepeats <= FurnitureAnimatedVisualization.FRAME_INCREASE_AMOUNT))
                    {
                        lastFramePlayed = true;
                    }
                }

                if((this._directionChanged || !frame) || ((frame.remainingFrameRepeats >= 0) && ((frame.remainingFrameRepeats = (frame.remainingFrameRepeats - FurnitureAnimatedVisualization.FRAME_INCREASE_AMOUNT)) <= 0)))
                {
                    sequenceId = AnimationFrame.SEQUENCE_NOT_DEFINED;

                    if(frame) sequenceId = frame.activeSequence;

                    if(sequenceId === AnimationFrame.SEQUENCE_NOT_DEFINED)
                    {
                        frame = this._data.getFrame(animationId, this._direction, layerId, frameCount);
                    }
                    else
                    {
                        frame = this._data.getFrameFromSequence(animationId, this._direction, layerId, sequenceId, (frame.activeSequenceOffset + frame.repeats), frameCount);
                    }

                    animationData.setFrame(layerId, frame);

                    update = (update | layerUpdate);
                }

                if(!frame || (frame.remainingFrameRepeats == AnimationFrame.FRAME_REPEAT_FOREVER))
                {
                    lastFramePlayed = true;
                    animationPlayed = true;
                }
                else
                {
                    animationData.animationOver = false;
                }

                animationData.setLastFramePlayed(layerId, lastFramePlayed);
                animationData.setAnimationPlayed(layerId, animationPlayed);
            }

            layerUpdate = (layerUpdate >> 1);

            layerId--;
        }
        
        return update;
    }

    protected getFrameNumber(layerId: number): number
    {
        const currentFrame = this._animationData.getFrame(layerId);

        if(!currentFrame) return super.getFrameNumber(layerId);

        return currentFrame.id;
    }

    protected getLayerXOffset(direction: number, layerId: number): number
    {
        const offset = super.getLayerXOffset(direction, layerId);

        const currentFrame = this._animationData.getFrame(layerId);

        if(!currentFrame) return offset;

        return (offset + currentFrame.x);
    }

    protected getLayerYOffset(direction: number, layerId: number): number
    {
        const offset = super.getLayerYOffset(direction, layerId);

        const currentFrame = this._animationData.getFrame(layerId);

        if(!currentFrame) return offset;

        return (offset + currentFrame.y);
    }

    protected usesAnimationResetting(): boolean
    {
        return false;
    }
}