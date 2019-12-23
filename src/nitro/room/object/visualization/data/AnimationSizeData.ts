import { IAssetAnimation } from '../../../../../core/asset/interfaces/visualization';
import { AnimationData } from './AnimationData';
import { SizeData } from './SizeData';

export class AnimationSizeData extends SizeData
{
    private _animations: { [index: string]: AnimationData };
    private _animationIds: number[];

    constructor(layerCount: number, angle: number)
    {
        super(layerCount, angle);

        this._animations    = {};
        this._animationIds  = [];
    }

    public dispose(): void
    {
        for(let key in this._animations)
        {
            const animation = this._animations[key];

            if(!animation) continue;

            animation.dispose();
        }

        this._animations    = {};
        this._animationIds  = [];

        super.dispose();
    }

    protected reset(): void
    {
        super.reset();

        this._animations    = {};
        this._animationIds  = [];
    }

    public processAnimations(animations: { [index: string]: IAssetAnimation }): boolean
    {
        if(!animations) return false;

        for(let key in animations)
        {
            const animation = animations[key];

            if(!animation) continue;

            const animationId = parseInt(key);

            if(this._animations[animationId]) return false;

            const animationData = new AnimationData();

            if(!animationData.initialize(animation))
            {
                animationData.dispose();

                return false;
            }

            this._animations[key] = animationData;
            
            this._animationIds.push(animationId);
        }

        return true;
    }

    public getAnimation(animationId: number): AnimationData
    {
        const existing = this._animations[animationId.toString()];

        if(!existing) return null;

        return existing;
    }

    public hasAnimation(animationId: number): boolean
    {
        return this.getAnimation(animationId) !== null;
    }
}