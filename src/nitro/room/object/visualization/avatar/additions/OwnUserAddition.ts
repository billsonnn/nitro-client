import { NitroConfiguration } from '../../../../../../NitroConfiguration';
import { IRoomObjectSprite } from '../../../../../../room/object/visualization/IRoomObjectSprite';
import { NitroInstance } from '../../../../../NitroInstance';
import { AvatarVisualization } from '../AvatarVisualization';
import { IAvatarAddition } from './IAvatarAddition';

export class OwnUserAddition implements IAvatarAddition
{
    public static ADDITION_TIMEOUT: number = 5000;

    private static DELAY_BEFORE_ANIMATION: number   = 300;
    private static STATE_DELAY: number              = 0;
    private static STATE_MOVE_DOWN: number          = 1;
    private static STATE_MOVE_UP: number            = 2;
    
    private _id: number;
    private _visualization: AvatarVisualization;
    private _sprite: IRoomObjectSprite;

    private _state: number;
    private _startTime: number;
    private _delta: number;
    private _offsetY: number;

    constructor(id: number, visualization: AvatarVisualization)
    {
        this._id            = id;
        this._visualization = visualization;
        this._sprite        = null;

        this._state         = 0;
        this._startTime     = NitroInstance.instance.renderer.totalTimeRunning;
        this._delta         = 0;
        this._offsetY       = 0;
    }

    public dispose(): void
    {
        if(this._sprite)
        {
            this._visualization.removeSprite(this._sprite);

            this._sprite = null;
        }
    }

    private getSpriteAssetName(): string
    {
        return `user_own`;
    }

    public update(): void
    {
        const assetName = this.getSpriteAssetName();

        let sprite = this._visualization.getSprite(assetName);

        if(this._sprite && this._sprite !== sprite) this._sprite.visible = false;

        if(!sprite)
        {
            sprite = this._visualization.createAndAddSprite(assetName, NitroConfiguration.ASSET_URL + `/images/additions/${ assetName }.png`);

            sprite.name = assetName;

            sprite.doesntHide = true;
        }

        this._sprite = sprite;

        if(!this._sprite) return;

        this._sprite.x          = 10;
        this._sprite.y          = -180 + this._offsetY;
        this._sprite.zIndex     = 100;

        if(!this._sprite.visible) this._sprite.visible = true;
    }

    public animate(): void
    {
        if(!this._sprite) return;

        const totalTimeRunning = NitroInstance.instance.renderer.totalTimeRunning;

        if(this._state === OwnUserAddition.STATE_DELAY)
        {
            if((totalTimeRunning - this._startTime) < OwnUserAddition.DELAY_BEFORE_ANIMATION) return;

            this._state = OwnUserAddition.STATE_MOVE_DOWN;
            this._delta = 0;
            
            this._sprite.visible = true;

            return;
        }

        if(this._state === OwnUserAddition.STATE_MOVE_DOWN)
        {
            this._delta    += 0.05;
            this._offsetY  += 1;

            if(this._delta >= 1)
            {
                this._state = OwnUserAddition.STATE_MOVE_UP;
                this._delta = 0;
            }

            return;
        }

        if(this._state === OwnUserAddition.STATE_MOVE_UP)
        {
            this._delta    += 0.05;
            this._offsetY  -= 1;
            
            if(this._delta >= 1)
            {
                this._state = OwnUserAddition.STATE_MOVE_DOWN;
                this._delta = 0;
            }

            return;
        }
    }

    public get id(): number
    {
        return this._id;
    }
}