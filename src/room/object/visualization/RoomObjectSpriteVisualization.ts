import { IRoomCollision } from '../../renderer/IRoomCollision';
import { RoomCollision } from '../../renderer/RoomCollision';
import { IRoomObjectController } from '../IRoomObjectController';
import { IRoomObjectSprite } from './IRoomObjectSprite';
import { IRoomObjectSpriteVisualization } from './IRoomObjectSpriteVisualization';
import { IObjectVisualizationData } from './IRoomObjectVisualizationData';
import { PlayableVisualization } from './PlayableVisualization';
import { RoomObjectSprite } from './RoomObjectSprite';

export class RoomObjectSpriteVisualization extends PlayableVisualization implements IRoomObjectSpriteVisualization
{
    private _object: IRoomObjectController;
    private _sprites: Map<string, IRoomObjectSprite>;
    private _spriteCounter: number;

    private _updateObjectCounter: number;
    private _updateModelCounter: number;

    protected _selfContained: boolean;
    protected _selfContainer: IRoomCollision;

    constructor()
    {
        super();

        this._object                = null;
        this._sprites               = new Map();
        this._spriteCounter         = 0;

        this._updateObjectCounter   = -1;
        this._updateModelCounter    = -1;

        this._selfContained         = false;
        this._selfContainer         = null;
    }

    public initialize(data: IObjectVisualizationData): boolean
    {
        if(this._selfContained)
        {
            if(!this._selfContainer)
            {
                this._selfContainer = new RoomCollision();

                if(this._object.room && this._object.room.renderer && this._object.room.renderer.collision) this._object.room.renderer.collision.addCollision(this._selfContainer);
            }
        }
        
        return false;
    }

    public onUpdate(): void
    {
        this.object.logic && this.object.logic.update(this.totalTimeRunning);
    }

    protected onDispose(): void
    {
        this.removeSprites();

        if(this._selfContainer)
        {
            if(this._object.room && this._object.room.renderer && this._object.room.renderer.collision) this._object.room.renderer.collision.removeCollision(this._selfContainer);

            this._selfContainer.destroy();

            this._selfContainer = null;
        }
        
        super.onDispose();
    }

    public getSprite(name: string): IRoomObjectSprite
    {
        const existing = this._sprites.get(name);

        if(!existing) return null;

        return existing;
    }

    public createAndAddSprite(name: string, source: string): IRoomObjectSprite
    {
        if(!name || !source) return null;

        return this.addSprite(name, new RoomObjectSprite(source, this._object));
    }

    public addSprite(name: string, sprite: IRoomObjectSprite): IRoomObjectSprite
    {
        const existing = this.getSprite(name);

        if(existing)
        {
            sprite.destroy();

            return existing;
        }

        this._sprites.set(name, sprite);

        if(this._selfContainer)
        {
            this._selfContainer.addCollision(sprite);
        }
        else
        {
            if(this._object.room && this._object.room.renderer && this._object.room.renderer.collision) this._object.room.renderer.collision.addCollision(sprite);
        }

        this._spriteCounter++;

        return sprite;
    }

    public removeSprites(): void
    {
        if(!this._sprites || !this._sprites.size) return;

        for(let sprite of this._sprites.values())
        {
            if(!sprite) continue;

            if(this._selfContainer)
            {
                this._selfContainer.removeCollision(sprite);
            }
            else
            {
                if(this._object.room && this._object.room.renderer && this._object.room.renderer.collision) this._object.room.renderer.collision.removeCollision(sprite);
            }

            sprite.destroy();
        }

        this._sprites.clear();
        this._spriteCounter = 0;
    }

    public removeSprite(sprite: IRoomObjectSprite): void
    {
        if(!sprite) return;

        const existing = this._sprites.get(sprite.name);

        if(!existing || existing !== sprite) return;

        if(this._selfContainer)
        {
            this._selfContainer.removeCollision(sprite);
        }
        else
        {
            if(this._object.room && this._object.room.renderer && this._object.room.renderer.collision) this._object.room.renderer.collision.removeCollision(sprite);
        }

        this._sprites.delete(sprite.name);

        existing.destroy();
    }

    public hideSprites(): void
    {
        if(!this._sprites || !this._sprites.size) return;

        for(let sprite of this._sprites.values())
        {
            if(!sprite || sprite.doesntHide) continue;

            sprite.visible = false;
        }
    }

    public updateSprites(): void
    {
        return;
    }

    public setObject(object: IRoomObjectController)
    {
        this._object = object;
    }

    public get object(): IRoomObjectController
    {
        return this._object;
    }

    public get sprites(): Map<string, IRoomObjectSprite>
    {
        return this._sprites;
    }

    public get totalSprites(): number
    {
        return this._spriteCounter
    }

    public get depth(): number
    {
        return this._object.position.calculatedDepth;
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
}