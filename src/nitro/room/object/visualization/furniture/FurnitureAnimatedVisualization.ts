import { IObjectVisualizationData } from '../../../../../room/object/visualization/IRoomObjectVisualizationData';
import { RoomObjectModelKey } from '../../RoomObjectModelKey';
import { AnimationData } from '../data/AnimationData';
import { AnimationFrame } from '../data/AnimationFrame';
import { AnimationStateData } from '../data/AnimationStateData';
import { ObjectVisualizationType } from '../ObjectVisualizationType';
import { FurnitureAnimatedVisualizationData } from './FurnitureAnimatedVisualizationData';
import { FurnitureVisualization } from './FurnitureVisualization';

export class FurnitureAnimatedVisualization extends FurnitureVisualization
{
    public static TYPE: string = ObjectVisualizationType.FURNITURE_ANIMATED;

    private static FRAME_INCREASE_AMOUNT: number = 1;

    public static _Str_13674: number = 0;

    protected _data: FurnitureAnimatedVisualizationData;

    private _Str_621: number;
    private _animationStateData: AnimationStateData;
    private _Str_16292: number;
    private _Str_12376: number;
    private _Str_5575: number;
    private _Str_9825: number;
    private _Str_9006: boolean;

    private _didSet: boolean;

    constructor()
    {
        super();

        this._Str_621               = -1;
        this._animationStateData    = new AnimationStateData();
        this._Str_16292             = 0;
        this._Str_12376             = 1;
        this._Str_5575              = 0;
        this._Str_9825              = 0;
        this._Str_9006              = false;

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

        if(this._animationStateData)
        {
            this._animationStateData.dispose();

            this._animationStateData = null;
        }
    }

    protected get _Str_24695(): number
    {
        return this._Str_9825;
    }

    protected get frameIncrease(): number
    {
        return FurnitureAnimatedVisualization.FRAME_INCREASE_AMOUNT;
    }

    protected setDirection(direction: number): void
    {
        if(this._direction === direction) return;

        super.setDirection(direction);
        
        this._Str_9006 = true;
    }

    public get animationId(): number
    {
        return this._animationStateData.animationId;
    }

    protected getAnimationId(k:AnimationStateData): number
    {
        var _local_2: number = this.animationId;
        if (((!(_local_2 == FurnitureAnimatedVisualization._Str_13674)) && (this._data.hasAnimation(_local_2))))
        {
            return _local_2;
        }
        return FurnitureAnimatedVisualization._Str_13674;
    }

    protected updateObject(direction: number): boolean
    {
        if(super.updateObject(direction))
        {
            const state = this.object.state;

            if(state !== this._Str_621)
            {
                this.setAnimation(state);

                this._Str_621 = state;

                this._Str_16292 = this.object.model.getValue(RoomObjectModelKey.FURNITURE_STATE_UPDATE_TIME) as number || 0;
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
                const updateTime = this.object.model.getValue(RoomObjectModelKey.FURNITURE_STATE_UPDATE_TIME);

                if(updateTime > this._Str_16292)
                {
                    this._Str_16292 = updateTime;

                    this.setAnimation(this._Str_621);
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

    private _Str_25107(k:AnimationStateData, _arg_2: number): boolean
    {
        var _local_3: number = k.animationId;
        if (((AnimationData.isTransitionFromAnimation(_local_3)) || (AnimationData.isTransitionToAnimation(_local_3))))
        {
            if (_arg_2 == k.animationAfterTransitionId)
            {
                if (!k.animationOver)
                {
                    return true;
                }
            }
        }
        return false;
    }

    private _Str_22935(k:AnimationStateData): number
    {
        var _local_2: number = k.animationId;
        if (((AnimationData.isTransitionFromAnimation(_local_2)) || (AnimationData.isTransitionToAnimation(_local_2))))
        {
            return k.animationAfterTransitionId;
        }
        return _local_2;
    }

    protected setAnimation(k: number):void
    {
        if(!this._data) return;
        
        this._Str_17687(this._animationStateData, k, (this._Str_621 >= 0));
    }

    protected _Str_17687(k:AnimationStateData, _arg_2: number, _arg_3: boolean=true): boolean
    {
        var _local_5: number;
        var _local_6: number;
        var _local_4: number = k.animationId;
        if (_arg_3)
        {
            if (this._Str_25107(k, _arg_2))
            {
                return false;
            }
            _local_5 = this._Str_22935(k);
            if (_arg_2 != _local_5)
            {
                if (!this._data.isImmediateChange(_arg_2, _local_5))
                {
                    _local_6 = AnimationData.getTransitionFromAnimationId(_local_5);
                    if (this._data.hasAnimation(_local_6))
                    {
                        k.animationAfterTransitionId = _arg_2;
                        _arg_2 = _local_6;
                    }
                    else
                    {
                        _local_6 = AnimationData.getTransitionToAnimationId(_arg_2);
                        if (this._data.hasAnimation(_local_6))
                        {
                            k.animationAfterTransitionId = _arg_2;
                            _arg_2 = _local_6;
                        }
                    }
                }
            }
            else
            {
                if (AnimationData.isTransitionFromAnimation(_local_4))
                {
                    _local_6 = AnimationData.getTransitionToAnimationId(_arg_2);
                    if (this._data.hasAnimation(_local_6))
                    {
                        k.animationAfterTransitionId = _arg_2;
                        _arg_2 = _local_6;
                    }
                }
                else
                {
                    if (!AnimationData.isTransitionToAnimation(_local_4))
                    {
                        if (this.usesAnimationResetting())
                        {
                            _local_6 = AnimationData.getTransitionFromAnimationId(_local_5);
                            if (this._data.hasAnimation(_local_6))
                            {
                                k.animationAfterTransitionId = _arg_2;
                                _arg_2 = _local_6;
                            }
                            else
                            {
                                _local_6 = AnimationData.getTransitionToAnimationId(_arg_2);
                                if (this._data.hasAnimation(_local_6))
                                {
                                    k.animationAfterTransitionId = _arg_2;
                                    _arg_2 = _local_6;
                                }
                            }
                        }
                    }
                }
            }
        }
        if (_local_4 != _arg_2)
        {
            k.animationId = _arg_2;
            return true;
        }
        return false;
    }

    protected _Str_6660(k: number): boolean
    {
        return this._animationStateData.getLastFramePlayed(k);
    }

    protected resetAllAnimationFrames():void
    {
        if (this._animationStateData != null)
        {
            this._animationStateData.setLayerCount(this._Str_9825);
        }
    }

    protected updateAnimation(): number
    {
        if (this._data == null)
        {
            return 0;
        }
        if(!this._didSet)
        {
            this._Str_9825 = this._data.layerCount;
            this.resetAllAnimationFrames();

            this._didSet = true;
        }
        var _local_2: number = this.updateAnimations();
        this._Str_9006 = false;
        return _local_2;
    }

    protected updateAnimations(): number
    {
        var _local_2: number;
        if (((!(this._animationStateData.animationOver)) || (this._Str_9006)))
        {
            _local_2 = this._Str_18198(this._animationStateData);
            if (this._animationStateData.animationOver)
            {
                if (((AnimationData.isTransitionFromAnimation(this._animationStateData.animationId)) || (AnimationData.isTransitionToAnimation(this._animationStateData.animationId))))
                {
                    this.setAnimation(this._animationStateData.animationAfterTransitionId);
                    this._animationStateData.animationOver = false;
                }
            }
        }
        return _local_2;
    }

    protected _Str_18198(k:AnimationStateData): number
    {
        var _local_8: boolean;
        var _local_9: boolean;
        var _local_10:AnimationFrame;
        var sequenceId: number;
        if (((k.animationOver) && (!(this._Str_9006))))
        {
            return 0;
        }
        var frameCount: number = k.frameCounter;
        var _local_4: number = this.getAnimationId(k);
        if (frameCount == 0)
        {
            frameCount = this._data.getStartFrame(_local_4, this._direction);
        }
        frameCount = (frameCount + this.frameIncrease);
        k.frameCounter = frameCount;
        var _local_5: number;
        k.animationOver = true;
        var _local_6 = (1 << (this._Str_9825 - 1));
        var layerId: number = (this._Str_9825 - 1);
        while (layerId >= 0)
        {
            _local_8 = k.getAnimationPlayed(layerId);
            if (((!(_local_8)) || (this._Str_9006)))
            {
                _local_9 = k.getLastFramePlayed(layerId);
                _local_10 = k.getFrame(layerId);
                if (_local_10 != null)
                {
                    if (((_local_10.isLastFrame) && (_local_10.remainingFrameRepeats <= this.frameIncrease)))
                    {
                        _local_9 = true;
                    }
                }
                if ((((this._Str_9006) || (_local_10 == null)) || ((_local_10.remainingFrameRepeats >= 0) && ((_local_10.remainingFrameRepeats = (_local_10.remainingFrameRepeats - this.frameIncrease)) <= 0))))
                {
                    sequenceId = AnimationFrame.SEQUENCE_NOT_DEFINED;
                    if (_local_10 != null)
                    {
                        sequenceId = _local_10.activeSequence;
                    }
                    if (sequenceId == AnimationFrame.SEQUENCE_NOT_DEFINED)
                    {
                        _local_10 = this._data.getFrame(_local_4, this._direction, layerId, frameCount);
                    }
                    else
                    {
                        _local_10 = this._data.getFrameFromSequence(_local_4, this._direction, layerId, sequenceId, (_local_10.activeSequenceOffset + _local_10.repeats), frameCount);
                    }
                    k.setFrame(layerId, _local_10);
                    _local_5 = (_local_5 | _local_6);
                }
                if (((_local_10 == null) || (_local_10.remainingFrameRepeats == AnimationFrame.FRAME_REPEAT_FOREVER)))
                {
                    _local_9 = true;
                    _local_8 = true;
                }
                else
                {
                    k.animationOver = false;
                }
                k.setLastFramePlayed(layerId, _local_9);
                k.setAnimationPlayed(layerId, _local_8);
            }
            _local_6 = (_local_6 >> 1);
            layerId--;
        }
        return _local_5;
    }

    protected getFrameNumber(layerId: number): number
    {
        const currentFrame = this._animationStateData.getFrame(layerId);

        if(!currentFrame) return super.getFrameNumber(layerId);

        return currentFrame.id;
    }

    protected getLayerXOffset(direction: number, layerId: number): number
    {
        const offset = super.getLayerXOffset(direction, layerId);

        const currentFrame = this._animationStateData.getFrame(layerId);

        if(!currentFrame) return offset;

        return (offset + currentFrame.x);
    }

    protected getLayerYOffset(direction: number, layerId: number): number
    {
        const offset = super.getLayerYOffset(direction, layerId);

        const currentFrame = this._animationStateData.getFrame(layerId);

        if(!currentFrame) return offset;

        return (offset + currentFrame.y);
    }

    protected usesAnimationResetting(): boolean
    {
        return false;
    }
}