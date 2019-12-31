import { AnimationFrame } from './AnimationFrame';

export class AnimationActionPart
{
    private _setType: string;
    private _frames: AnimationFrame[];

    constructor(data: any)
    {
        if(!data) throw new Error('invalid_data');
        
        this._setType   = data['$']['set-type'];
        this._frames    = [];

        for(let frame of data.frame)
        {
            if(!frame) continue;

            const newFrame = new AnimationFrame(frame);

            if(!newFrame) continue;

            for(let i = 0; i < newFrame.repeats; i++) this._frames.push(newFrame);
        }
    }

    public getFrame(frameCount: number = 0): AnimationFrame
    {
        if(!this._frames) return null;

        const totalFrames = this._frames.length;

        if(!totalFrames) return null;

        const frameNumber = Math.floor(frameCount % this._frames.length);

        const frame = this._frames[frameNumber];

        if(!frame) return null;

        return frame;
    }

    public get setType(): string
    {
        return this._setType;
    }

    public get frames(): AnimationFrame[]
    {
        return this._frames;
    }
}