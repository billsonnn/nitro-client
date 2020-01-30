import { IRoomObjectSprite } from '../../../../../../room/object/visualization/IRoomObjectSprite';
import { AvatarVisualization } from '../AvatarVisualization';
import { IAvatarAddition } from './IAvatarAddition';

export class TypingBubbleAddition implements IAvatarAddition
{
    private _id: number;
    private _visualization: AvatarVisualization;
    private _sprite: IRoomObjectSprite;

    constructor(id: number, visualization: AvatarVisualization)
    {
        this._id            = id;
        this._visualization = visualization;
        this._sprite        = null;
    }

    public dispose(): void
    {
        // if(this._sprite)
        // {
        //     this._visualization.removeSprite(this._sprite);

        //     this._sprite = null;
        // }
    }

    private getSpriteAssetName(): string
    {
        return `user_typing`;
    }

    public update(): void
    {
        // const assetName = this.getSpriteAssetName();

        // let sprite = this._visualization.getSprite(assetName);

        // if(this._sprite && this._sprite !== sprite) this._sprite.visible = false;

        // if(!sprite)
        // {
        //     sprite = this._visualization.createAndAddSprite(assetName, NitroConfiguration.ASSET_URL + `/images/additions/${ assetName }.png`);

        //     sprite.name = assetName;

        //     sprite.doesntHide = true;
        // }

        // this._sprite = sprite;

        // if(!this._sprite) return;

        // let offsetX = 46;
        // let offsetY = -83;

        // //if(this._visualization.posture === 'lay')
        
        // this._sprite.x          = offsetX;
        // this._sprite.y          = offsetY;
        // this._sprite.zIndex     = 100;

        // if(!this._sprite.visible) this._sprite.visible = true;
    }

    public animate(): void
    {
       return;
    }

    public get id(): number
    {
        return this._id;
    }
}