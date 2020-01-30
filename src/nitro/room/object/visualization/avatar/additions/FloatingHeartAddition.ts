import { IRoomObjectSprite } from '../../../../../../room/object/visualization/IRoomObjectSprite';
import { NitroInstance } from '../../../../../NitroInstance';
import { AvatarVisualization } from '../AvatarVisualization';
import { ExpressionAddition } from './ExpressionAddition';

export class FloatingHeartAddition extends ExpressionAddition
{
    private static DELAY_BEFORE_ANIMATION: number   = 300;
    private static STATE_DELAY: number              = 0;
    private static STATE_FADE_IN: number            = 1;
    private static STATE_FLOAT: number              = 2;
    private static STATE_COMPLETE: number           = 3;

    private _sprite: IRoomObjectSprite;

    private _state: number;
    private _startTime: number;
    private _delta: number;
    private _offsetY: number;

    constructor(id: number, type: number, visualization: AvatarVisualization)
    {
        super(id, type, visualization);

        this._sprite        = null;

        this._state         = 0;
        this._startTime     = NitroInstance.instance.renderer.totalTimeRunning;
        this._delta         = 0;
        this._offsetY       = 0;
    }

    public dispose(): void
    {
        // if(this._sprite)
        // {
        //     this.visualization.removeSprite(this._sprite);

        //     this._sprite = null;
        // }

        super.dispose();
    }

    private getSpriteAssetName(): string
    {
        return `user_blowkiss`;
    }

    public update(): void
    {
        // const assetName = this.getSpriteAssetName();

        // let sprite = this.visualization.getSprite(assetName);

        // if(this._sprite && this._sprite !== sprite) this._sprite.visible = false;

        // if(!sprite)
        // {
        //     sprite              = this.visualization.createAndAddSprite(assetName, NitroConfiguration.ASSET_URL + `/images/additions/${ assetName }.png`);
        //     sprite.name         = assetName;
        //     sprite.visible      = false;
        //     sprite.doesntHide   = true;
        // }

        // this._sprite = sprite;

        // if(!this._sprite) return;

        // let offsetX = 0;

        // this._offsetY = -70;
        
        // this._sprite.x          = offsetX;
        // this._sprite.y          = this._offsetY;
        // this._sprite.zIndex     = 100;
    }

    public animate(): void
    {
        // if(!this._sprite) return;

        // const totalTimeRunning = NitroInstance.instance.renderer.totalTimeRunning;

        // if(this._state === FloatingHeartAddition.STATE_DELAY)
        // {
        //     if((totalTimeRunning - this._startTime) < FloatingHeartAddition.DELAY_BEFORE_ANIMATION) return;

        //     this._state = FloatingHeartAddition.STATE_FADE_IN;
        //     this._delta = 0;

        //     this._sprite.alpha      = 0;
        //     this._sprite.visible    = true;

        //     return;
        // }

        // if(this._state === FloatingHeartAddition.STATE_FADE_IN)
        // {
        //     this._delta += 0.1;

        //     this._sprite.y      = this._offsetY;
        //     this._sprite.alpha  = Math.pow(this._delta, 0.9);

        //     if(this._delta >= 1)
        //     {
        //         this._state = FloatingHeartAddition.STATE_FLOAT;
        //         this._delta = 0;

        //         this._sprite.alpha  = 1;
        //     }

        //     return;
        // }

        // if(this._state === FloatingHeartAddition.STATE_FLOAT)
        // {
        //     const alpha = Math.pow(this._delta, 0.9);

        //     this._delta    += 0.05;
        //     this._offsetY  += ((this._delta < 1) ? alpha : 1) * -35;

        //     this._sprite.y      = this._offsetY;
        //     this._sprite.alpha  = 1 - alpha;

        //     if(this._sprite.alpha <= 0)
        //     {
        //         this._state = FloatingHeartAddition.STATE_COMPLETE;

        //         this._sprite.visible = false;
        //     }

        //     return;
        // }
    }
}