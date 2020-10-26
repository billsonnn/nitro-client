import { Container, Point, Rectangle, RenderTexture, Sprite } from 'pixi.js';
import { RoomObjectSpriteData } from '../../data/RoomObjectSpriteData';
import { IRoomGeometry } from '../../utils/IRoomGeometry';
import { TextureUtils } from '../../utils/TextureUtils';
import { IRoomObjectController } from '../IRoomObjectController';
import { IRoomObjectSprite } from './IRoomObjectSprite';
import { IRoomObjectSpriteVisualization } from './IRoomObjectSpriteVisualization';
import { IObjectVisualizationData } from './IRoomObjectVisualizationData';
import { RoomObjectSprite } from './RoomObjectSprite';
import { IGraphicAssetCollection } from './utils/IGraphicAssetCollection';

export class RoomObjectSpriteVisualization implements IRoomObjectSpriteVisualization
{
    private static VISUALIZATION_COUNTER: number = 0;

    private _id: number;
    private _object: IRoomObjectController;
    private _asset: IGraphicAssetCollection;
    private _sprites: IRoomObjectSprite[];

    protected _scale: number;

    private _updateObjectCounter: number;
    private _updateModelCounter: number;
    private _updateSpriteCounter: number;

    constructor()
    {
        this._id                    = RoomObjectSpriteVisualization.VISUALIZATION_COUNTER++;
        this._object                = null;
        this._asset                 = null;
        this._sprites               = [];

        this._scale                 = -1;

        this._updateObjectCounter   = -1;
        this._updateModelCounter    = -1;
        this._updateSpriteCounter   = -1;
    }

    public initialize(data: IObjectVisualizationData): boolean
    {
        return false;
    }

    public update(geometry: IRoomGeometry, time: number, update: boolean, skipUpdate: boolean): void
    {
        return;
    }

    protected reset(): void
    {
        this._scale = -1;
    }

    public dispose(): void
    {
        if(this._sprites)
        {
            while(this._sprites.length)
            {
                const sprite = (this._sprites[0] as RoomObjectSprite);

                if(sprite) sprite.dispose();

                this._sprites.pop();
            }

            this._sprites = null;
        }

        this._object    = null;
        this._asset     = null;
    }

    public getSprite(index: number): IRoomObjectSprite
    {
        if((index >= 0) && (index < this._sprites.length)) return this._sprites[index];

        return null;
    }

    public getSpriteList(): RoomObjectSpriteData[]
    {
        return null;
    }

    public createSprite(): IRoomObjectSprite
    {
        return this.createSpriteAtIndex(this._sprites.length);
    }

    public createSpriteAtIndex(index: number): IRoomObjectSprite
    {
        const sprite = new RoomObjectSprite();

        if(index >= this._sprites.length)
        {
            this._sprites.push(sprite);
        }
        else
        {
            this._sprites.splice(index, 0, sprite);
        }

        return sprite;
    }

    protected setSpriteCount(count: number): void
    {
        while(this._sprites.length > count)
        {
            const sprite = this._sprites[(this._sprites.length - 1)] as RoomObjectSprite;

            if(sprite) sprite.dispose();

            this._sprites.pop();
        }

        while(this._sprites.length < count)
        {
            this._sprites.push(new RoomObjectSprite());
        }
    }

    public get image(): RenderTexture
    {
        return this.getImage(0, -1);
    }

    public getImage(bgColor: number, originalId: number): RenderTexture
    {
        const boundingRectangle = this.getBoundingRectangle();

        if((boundingRectangle.width * boundingRectangle.height) === 0) return null;

        let spriteCount                     = this.totalSprites;
        let spriteList: IRoomObjectSprite[] = [];

        let index = 0;

        while(index < spriteCount)
        {
            const objectSprite = this.getSprite(index);

            if(objectSprite && objectSprite.visible && objectSprite.texture) spriteList.push(objectSprite);

            index++;
        }

        spriteList.sort((a, b) =>
        {
            return b.relativeDepth - a.relativeDepth;
        });

        const container = new Container();

        index = 0;

        while(index < spriteList.length)
        {
            const objectSprite  = spriteList[index];
            const texture       = objectSprite.texture;

            if(texture)
            {
                const sprite = Sprite.from(texture);

                sprite.alpha            = (objectSprite.alpha / 255);
                sprite.tint             = objectSprite.color;
                sprite.x                = objectSprite.offsetX;
                sprite.y                = objectSprite.offsetY;
                sprite.blendMode        = objectSprite.blendMode;
                sprite.filters          = objectSprite.filters;

                if(objectSprite.flipH) sprite.scale.x = -1;

                if(objectSprite.flipV) sprite.scale.y = -1;

                container.addChild(sprite);
            }

            index++;
        }

        const texture = TextureUtils.generateTexture(container);

        if(!texture) return null;

        return texture;
    }

    public getBoundingRectangle(): Rectangle
    {
        const totalSprites  = this.totalSprites;
        const rectangle     = new Rectangle();

        let iterator = 0;

        while(iterator < totalSprites)
        {
            const sprite = this.getSprite(iterator);

            if(sprite && sprite.texture && sprite.visible)
            {
                let offsetX = ((sprite.flipH) ? (-(sprite.width) + sprite.offsetX) : sprite.offsetX);
                let offsetY = ((sprite.flipV) ? (-(sprite.height) + sprite.offsetY) : sprite.offsetY);

                const point = new Point(offsetX, offsetY);

                if(iterator === 0)
                {
                    rectangle.x         = point.x;
                    rectangle.y         = point.y;
                    rectangle.width     = sprite.width;
                    rectangle.height    = sprite.height;
                }
                else
                {
                    if(point.x < rectangle.x) rectangle.x = point.x;

                    if(point.y < rectangle.y) rectangle.y = point.y;

                    if((point.x + sprite.width) > rectangle.right) rectangle.width = ((point.x + sprite.width) - rectangle.x);

                    if((point.y + sprite.height) > rectangle.bottom) rectangle.height = ((point.y + sprite.height) - rectangle.y);
                }
            }

            iterator++;
        }

        return rectangle;
    }

    public get instanceId(): number
    {
        return this._id;
    }

    public get object(): IRoomObjectController
    {
        return this._object;
    }

    public set object(object: IRoomObjectController)
    {
        this._object = object;
    }

    public get asset(): IGraphicAssetCollection
    {
        return this._asset;
    }

    public set asset(asset: IGraphicAssetCollection)
    {
        if(this._asset) this._asset.removeReference();

        this._asset = asset;

        if(this._asset) this._asset.addReference();
    }

    public get sprites(): IRoomObjectSprite[]
    {
        return this._sprites;
    }

    public get totalSprites(): number
    {
        return this._sprites.length;
    }

    public get updateObjectCounter(): number
    {
        return this._updateObjectCounter;
    }

    public set updateObjectCounter(count: number)
    {
        this._updateObjectCounter = count;
    }

    public get updateModelCounter(): number
    {
        return this._updateModelCounter;
    }

    public set updateModelCounter(count: number)
    {
        this._updateModelCounter = count;
    }

    public get updateSpriteCounter(): number
    {
        return this._updateSpriteCounter;
    }

    public set updateSpriteCounter(count: number)
    {
        this._updateSpriteCounter = count;
    }
}