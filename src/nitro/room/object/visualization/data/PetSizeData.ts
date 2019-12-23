import { IAssetGesture, IAssetPosture } from '../../../../../core/asset/interfaces/visualization';
import { AnimationSizeData } from './AnimationSizeData';

export class PetSizeData extends AnimationSizeData
{
    public static DEFAULT_POSTURE: number = -1;

    private _posturesToAnimations: Map<string, number>;
    private _gesturesToAnimations: Map<string, number>;
    private _defaultPosture: string;

    constructor(layerCount: number, angle: number)
    {
        super(layerCount, angle);

        this._posturesToAnimations  = new Map();
        this._gesturesToAnimations  = new Map();
        this._defaultPosture        = null;
    }

    public processPostures(postures: { [index: string]: IAssetPosture }): boolean
    {
        if(!postures) return false;

        for(let key in postures)
        {
            const posture = postures[key];

            if(!posture) continue;

            if(this._posturesToAnimations.get(posture.id)) continue;

            if(this._defaultPosture === null) this._defaultPosture = posture.id;

            this._posturesToAnimations.set(posture.id, posture.animationId);
        }

        if(this._posturesToAnimations.get(this._defaultPosture) === undefined) return false;

        return true;
    }

    public processGestures(gestures: { [index: string]: IAssetGesture }): boolean
    {
        if(!gestures) return false;

        for(let key in gestures)
        {
            const gesture = gestures[key];

            if(!gesture) continue;

            if(this._gesturesToAnimations.get(gesture.id)) continue;

            this._gesturesToAnimations.set(gesture.id, gesture.animationId);
        }

        return true;
    }

    public postureToAnimation(posture: string): number
    {
        const existing = this._posturesToAnimations.get(posture);

        if(existing === undefined) return PetSizeData.DEFAULT_POSTURE;

        return existing;
    }

    public get totalPostures(): number
    {
        return this._posturesToAnimations.size;
    }

    public get totalGestures(): number
    {
        return this._gesturesToAnimations.size;
    }
}