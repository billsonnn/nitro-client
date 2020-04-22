import { IAssetGesture, IAssetPosture } from '../../../../../core/asset/interfaces/visualization';
import { AnimationSizeData } from './AnimationSizeData';

export class PetSizeData extends AnimationSizeData
{
    public static DEFAULT: number = -1;

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
        if(!this._posturesToAnimations.get(posture)) posture = this._defaultPosture;

        return this._posturesToAnimations.get(posture);
    }

    public _Str_18284(k: string): boolean
    {
        if(k === 'ded') return true;

        return false;
    }

    public gestureToAnimation(gesture: string): number
    {
        if(!this._gesturesToAnimations.get(gesture)) return PetSizeData.DEFAULT;

        return this._gesturesToAnimations.get(gesture);
    }

    public _Str_14207(k: number, _arg_2: boolean): string
    {
        if((k >= 0) && (k < this._posturesToAnimations.size))
        {
            const keys = this._posturesToAnimations.keys();

            for(;;)
            {
                const key = keys.next();

                if(key.done) return null;

                if(k <= 0) return key.value;

                --k;
            }
        }

        return (_arg_2) ? this._defaultPosture : null;
    }

    public _Str_17844(index: number): string
    {
        if((index >= 0) && (index < this._gesturesToAnimations.size))
        {
            const keys = this._gesturesToAnimations.keys();

            for(;;)
            {
                const key = keys.next();

                if(key.done) return null;

                if(index <= 0) return key.value;

                --index;
            }
        }
        
        return null;
    }

    public _Str_17976(k: number): string
    {
        for(let _local_2 of this._gesturesToAnimations.keys())
        {
            if(this._gesturesToAnimations.get(_local_2) === k) return _local_2;
        }

        return null;
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