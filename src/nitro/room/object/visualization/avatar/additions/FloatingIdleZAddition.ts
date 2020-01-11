import { NitroConfiguration } from '../../../../../../NitroConfiguration';
import { IRoomObjectSprite } from '../../../../../../room/object/visualization/IRoomObjectSprite';
import { Direction } from '../../../../../../room/utils/Direction';
import { NitroInstance } from '../../../../../NitroInstance';
import { AvatarVisualization } from '../AvatarVisualization';
import { IAvatarAddition } from './IAvatarAddition';

export class FloatingIdleZAddition implements IAvatarAddition
{
    private static DELAY_BEFORE_ANIMATION: number   = 2000;
    private static DELAY_PER_FRAME: number          = 2000;
    private static STATE_DELAY: number              = 0;
    private static STATE_FRAME_A: number            = 1;
    private static STATE_FRAME_B: number            = 2;

    private _id: number;
    private _visualization: AvatarVisualization;
    private _sprite: IRoomObjectSprite;
    private _state: number;
    private _startTime: number;

    constructor(id: number, visualization: AvatarVisualization)
    {
        this._id            = id;
        this._visualization = visualization;
        this._sprite        = null;

        this._state         = 0;
        this._startTime     = NitroInstance.instance.renderer.totalTimeRunning;
    }

    public dispose(): void
    {
        if(this._sprite)
        {
            this._visualization.removeSprite(this._sprite);

            this._sprite = null;
        }
    }

    private getSpriteAssetName(left: boolean, state: number): string
    {
        return `user_idle_${ left ? 'left' : 'right' }_${ state }`;
    }

    public update(): void
    {
        let direction = this._visualization.direction;

        if(this._visualization.posture === 'lay') direction = direction === Direction.NORTH ? Direction.SOUTH : Direction.EAST;

        const isLeft    = direction >= Direction.SOUTH_EAST && direction <= Direction.WEST;
        const assetName = this.getSpriteAssetName(isLeft, this._state === FloatingIdleZAddition.STATE_FRAME_A ? 1 : 2);

        let sprite = this._visualization.getSprite(assetName);

        if(this._sprite && this._sprite !== sprite) this._sprite.visible = false;

        if(!sprite)
        {
            sprite              = this._visualization.createAndAddSprite(assetName, NitroConfiguration.ASSET_URL + `/images/additions/${ assetName }.png`);
            sprite.name         = assetName;
            sprite.visible      = false;
            sprite.doesntHide   = true;
        }

        this._sprite = sprite;

        if(!this._sprite) return;

        let offsetX = isLeft ? 2 : 53;
        let offsetY = -70;

        if(this._visualization.posture === 'lay') offsetX -= isLeft ? -53 : 53;
        
        this._sprite.x          = offsetX;
        this._sprite.y          = offsetY;
        this._sprite.zIndex     = 100;
    }

    public animate(): void
    {
        if(!this._sprite) return;
        
        const totalTimeRunning = NitroInstance.instance.renderer.totalTimeRunning;

        if(this._state === FloatingIdleZAddition.STATE_DELAY)
        {
            if((totalTimeRunning - this._startTime) >= FloatingIdleZAddition.DELAY_BEFORE_ANIMATION)
            {
                this._state     = FloatingIdleZAddition.STATE_FRAME_A;
                this._startTime = totalTimeRunning;
            }
        }

        if(this._state === FloatingIdleZAddition.STATE_FRAME_A)
        {
            if((totalTimeRunning - this._startTime) >= FloatingIdleZAddition.DELAY_PER_FRAME)
            {
                this._state     = FloatingIdleZAddition.STATE_FRAME_B;
                this._startTime = totalTimeRunning;
            }
        }

        if(this._state === FloatingIdleZAddition.STATE_FRAME_B)
        {
            if((totalTimeRunning - this._startTime) >= FloatingIdleZAddition.DELAY_PER_FRAME)
            {
                this._state     = FloatingIdleZAddition.STATE_FRAME_A;
                this._startTime = totalTimeRunning;
            }
        }

        if(this._sprite) this._sprite.visible = true;
    }

    public get id(): number
    {
        return this._id;
    }
}