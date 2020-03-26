import { IActionDefinition } from '../actions/IActionDefinition';
import { AnimationAction } from './animation/AnimationAction';

export class AnimationData
{
    private _actions: Map<string, AnimationAction>;

    constructor()
    {
        this._actions = new Map();
    }

    public parse(data: any): boolean
    {
        if(data.animations && (data.animations.length > 0))
        {
            for(let animation of data.animations)
            {
                if(!animation) continue;

                const newAnimation = new AnimationAction(animation);

                this._actions.set(newAnimation.id, newAnimation);
            }
        }

        return true;
    }

    public _Str_2244(action: IActionDefinition): AnimationAction
    {
        const existing = this._actions.get(action.id);

        if(!existing) return null;

        return existing;
    }

    public _Str_1408(k: IActionDefinition): number
    {
        const animationAction = this._Str_2244(k);

        if(!animationAction) return 0;

        return animationAction.frameCount;
    }
}