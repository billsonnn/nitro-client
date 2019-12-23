import { AnimationFrameSequenceData } from './AnimationFrameSequenceData';

export class AnimationLayerData
{
    private _frameSequences: AnimationFrameSequenceData[];
    private _frameCount: number;
    private _loopCount: number;
    private _frameRepeat: number;
    private _isRandom: boolean;

    constructor(loopCount: number, frameRepeat: number, isRandom: boolean)
    {
        this._frameSequences    = [];
        this._frameCount        = -1;
        this._loopCount         = loopCount < 0 ? 0 : loopCount;
        this._frameRepeat       = frameRepeat < 1 ? 1 : frameRepeat;
        this._isRandom          = isRandom || false;
    }
    
    public dispose(): void
    {
        for(let i = this._frameSequences.length - 1; i >= 0; i--)
        {
            const sequence = this._frameSequences[i];

            if(!sequence) continue;

            sequence.dispose();
        }

        this._frameSequences = [];
    }

    public createFrameSequence(): AnimationFrameSequenceData
    {
        const frameSequence = new AnimationFrameSequenceData(this._loopCount, this._frameRepeat);

        this._frameSequences.push(frameSequence);

        return frameSequence;
    }

    public getFrameSequence(): AnimationFrameSequenceData
    {
        let randomIndex = 0;

        if(this._isRandom)
        {
            const totalSequences = this._frameSequences.length;

            randomIndex = Math.floor(totalSequences * Math.random());

            if(randomIndex === totalSequences) randomIndex--;
        }

        return this._frameSequences[randomIndex] || null;
    }

    public get loopCount(): number
    {
        return this._loopCount;
    }

    public get frameRepeat(): number
    {
        return this._frameRepeat;
    }
}