import { AnimationFrameData } from './AnimationFrameData';
import { DirectionalOffsetData } from './DirectionalOffsetData';

export class AnimationFrameDirectionalData extends AnimationFrameData
{
    private _directionalOffsets: DirectionalOffsetData;

    constructor(id: number, x: number, y: number, randomX: number, randomY: number, offsets: DirectionalOffsetData, repeats: number)
    {
        super(id, x, y, randomX, randomY, repeats);

        this._directionalOffsets = offsets;
    }

    public get hasDirectionalOffsets(): boolean
    {
        return this._directionalOffsets !== null;
    }

    public x(direction: number): number
    {
        if(this._directionalOffsets) return this._directionalOffsets.getXOffset(direction, super.x(direction));

        return super.x(direction);
    }

    public y(direction: number): number
    {
        if(this._directionalOffsets) return this._directionalOffsets.getYOffset(direction, super.y(direction));

        return super.y(direction);
    }
}