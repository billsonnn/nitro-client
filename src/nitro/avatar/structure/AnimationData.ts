import { AnimationAction } from './animation/AnimationAction';

export class AnimationData
{
    private _actions: { [index: string]: AnimationAction };

    private _isReady: boolean;

    constructor()
    {
        this._actions   = {};

        this._isReady   = false;
    }

    public parse(data: any): boolean
    {
        if(!data) return false;

        for(let animation of data.action)
        {
            const action = new AnimationAction(animation);

            if(!action) continue;

            this._actions[action.id] = action;
        }

        this._isReady = true;

        return true;
    }

    public getAnimation(id: string): AnimationAction
    {
        if(!id) return null;

        const existing = this._actions[id];

        if(!existing) return null;

        return existing;
    }

    public get isReady(): boolean
    {
        return this._isReady;
    }
}