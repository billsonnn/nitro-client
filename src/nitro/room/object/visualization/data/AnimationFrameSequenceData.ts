import { AnimationFrameData } from './AnimationFrameData';
import { AnimationFrameDirectionalData } from './AnimationFrameDirectionalData';
import { DirectionalOffsetData } from './DirectionalOffsetData';

export class AnimationFrameSequenceData
{
    private _loopCount: number;
    private _frameRepeat: number;
    private _frames: AnimationFrameData[];
    private _frameNumbers: number[];

    constructor(loopCount: number, frameRepeat: number)
    {
        this._loopCount     = loopCount < 0 ? 0 : loopCount;
        this._frameRepeat   = frameRepeat < 1 ? 1 : frameRepeat;
        this._frames        = [];
        this._frameNumbers  = [];
    }

    public dispose(): void
    {
        this._loopCount     = 1;
        this._frameRepeat   = 1;
        this._frames        = [];
        this._frameNumbers  = [];
    }

    public getFrame(frame: number): AnimationFrameData
    {
        const existing = this._frames[frame];

        if(!existing) return null;

        return existing;
    }

    public getFrameForCount(frameCount: number): AnimationFrameData
    {
        frameCount = Math.floor((frameCount % (this._frames.length * this._frameRepeat)) / this._frameRepeat);

        return this.getFrame(frameCount);
    }

    public addFrame(id: number, x: number, y: number, randomX: number, randomY: number, offsets: DirectionalOffsetData = null): AnimationFrameData
    {
        let frameData: AnimationFrameData = null;

        if(offsets) frameData = new AnimationFrameDirectionalData(id, x, y, randomX, randomY, offsets, 0)
        else frameData = new AnimationFrameData(id, x, y, randomX, randomY, 0);

        this._frames.push(frameData);
        this._frameNumbers.push(id);

        return frameData;
    }

    public get loopCount(): number
    {
        return this._loopCount;
    }

    public get frameRepeat(): number
    {
        return this._frameRepeat;
    }

    public get frames(): AnimationFrameData[]
    {
        return this._frames;
    }

    public get frameNumbers(): number[]
    {
        return this._frameNumbers;
    }

    public get frameCount(): number
    {
        return this._frames.length;
    }
}