import * as PIXI from 'pixi.js-legacy';
import { GraphicAssetCollection } from '../../../core/asset/GraphicAssetCollection';
import { IRoomGeometry } from '../../utils/IRoomGeometry';
import { IRoomObjectController } from '../IRoomObjectController';
import { IRoomObjectSprite } from './IRoomObjectSprite';
import { IRoomObjectSpriteVisualization } from './IRoomObjectSpriteVisualization';
import { IObjectVisualizationData } from './IRoomObjectVisualizationData';
import { RoomObjectSprite } from './RoomObjectSprite';

export class RoomObjectSpriteVisualization implements IRoomObjectSpriteVisualization
{
    private static VISUALIZATION_COUNTER: number = 0;

    private _id: number;
    private _object: IRoomObjectController;
    private _asset: GraphicAssetCollection;
    private _sprites: IRoomObjectSprite[];

    private _updateObjectCounter: number;
    private _updateModelCounter: number;
    private _updateSpriteCounter: number;

    constructor()
    {
        this._id                    = RoomObjectSpriteVisualization.VISUALIZATION_COUNTER++;
        this._object                = null;
        this._asset                 = null;
        this._sprites               = [];

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

    public dispose(): void
    {
        
    }

    public getSprite(index: number): IRoomObjectSprite
    {
        if((index >= 0) && (index < this._sprites.length)) return this._sprites[index];

        return null;
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

    public getBoundingRectangle(): PIXI.Rectangle
    {
        const totalSprites = this.totalSprites;

        const rectangle = new PIXI.Rectangle();

        let iterator = 0;

        while(iterator < totalSprites)
        {
            const sprite = this.getSprite(iterator);

            if(sprite && sprite.visible)
            {
                const texture = sprite.texture;

                if(texture)
                {
                    const point = new PIXI.Point(sprite.offsetX, sprite.offsetY);

                    if(iterator === 0)
                    {
                        rectangle.left      = point.x;
                        rectangle.top       = point.y;
                        rectangle.right     = (point.x + texture.width);
                        rectangle.bottom    = (point.y + texture.height);
                    }
                    else
                    {
                        if(point.x < rectangle.left) rectangle.left = point.x;

                        if(point.y < rectangle.top) rectangle.top = point.y;

                        if((point.x + sprite.width) > rectangle.right) rectangle.right = (point.x + sprite.width);

                        if((point.y + sprite.height) > rectangle.bottom) rectangle.bottom = (point.y + sprite.height);
                    }
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

    public get asset(): GraphicAssetCollection
    {
        return this._asset;
    }

    public set asset(asset: GraphicAssetCollection)
    {
        this._asset = asset;
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