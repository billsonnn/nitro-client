import { AnimationActionPart } from './AnimationActionPart';

export class AnimationAction
{
    private _id: string;
    private _actionParts: { [index: string]: AnimationActionPart };
    private _bodyPartOffsets: { [index: number]: { [index: number]: { [index: string]: PIXI.Point } } };
    private _frameCount: number;

    constructor(data: any)
    {
        if(!data) throw new Error('invalid_data');

        this._id                = data['$'].id;
        this._actionParts       = {};
        this._bodyPartOffsets   = {};
        this._frameCount        = 0;

        for(let part of data.part)
        {
            const newPart = new AnimationActionPart(part);

            this._actionParts[newPart.setType] = newPart;

            this._frameCount = Math.max(this._frameCount, newPart.frames.length);
        }

        if(data.offsets && data.offsets[0] && data.offsets[0].frame)
        {
            for(let offset of data.offsets[0].frame)
            {
                const frameId = parseInt(offset['$'].id);

                this._frameCount = Math.max(this._frameCount, frameId);

                const frameOffsets: { [index: number]: { [index: number]: PIXI.Point } } = [];

                this._bodyPartOffsets[frameId] = frameOffsets;

                if(offset.directions && offset.directions[0])
                {
                    for(let directionOffset of offset.directions[0].direction)
                    {
                        const direction = parseInt(directionOffset['$'].id);

                        const directionOffsets: { [index: string]: PIXI.Point } = {};

                        frameOffsets[direction] = directionOffsets;
                        
                        for(let bodyPart of directionOffset.bodypart)
                        {
                            const id    = bodyPart['$'].id;
                            const x     = parseInt(bodyPart['$'].dx) || 0;
                            const y     = parseInt(bodyPart['$'].dy) || 0;

                            directionOffsets[id] = new PIXI.Point(x, y);
                        }
                    }
                }

                //let repeats = parseInt(offset['$'].repeats);
            }
        }
    }

    public getPartForType(type: string): AnimationActionPart
    {
        if(!type) return null;

        const existing = this._actionParts[type];

        if(!existing) return null;

        return existing;
    }

    public getAnimationOffset(frameCount: number = 0, direction: number = 0): { [index: string]: PIXI.Point }
    {
        const frameNumber = Math.floor(frameCount % this._frameCount);

        const existingFrame = this._bodyPartOffsets[frameNumber];

        if(!existingFrame) return null;

        const existingDirectionalOffset = existingFrame[direction];

        if(!existingDirectionalOffset) return null;

        return existingDirectionalOffset;
    }

    public get id(): string
    {
        return this._id;
    }

    public get actionsParts(): { [index: string]: AnimationActionPart }
    {
        return this._actionParts;
    }

    public get frameCount(): number
    {
        return this._frameCount;
    }
}