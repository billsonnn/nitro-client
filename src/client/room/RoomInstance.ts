import { Disposable } from '../core/common/disposable/Disposable';
import { IRoomInstance } from './IRoomInstance';
import { IRoomInstanceContainer } from './IRoomInstanceContainer';
import { IRoomObjectManager } from './IRoomObjectManager';
import { IRoomObject } from './object/IRoomObject';
import { IRoomObjectController } from './object/IRoomObjectController';
import { IRoomObjectModel } from './object/IRoomObjectModel';
import { RoomObjectModel } from './object/RoomObjectModel';
import { IRoomRendererBase } from './renderer/IRoomRendererBase';

export class RoomInstance extends Disposable implements IRoomInstance
{
    private _id: string;
    private _container: IRoomInstanceContainer;
    private _renderer: IRoomRendererBase;
    private _managers: Map<number, IRoomObjectManager>;
    private _updateCategories: number[];
    private _model: IRoomObjectModel;

    constructor(id: string, container: IRoomInstanceContainer)
    {
        super();
        
        this._id                = id;
        this._container         = container;
        this._renderer          = null;
        this._managers          = new Map();
        this._updateCategories  = [];
        this._model             = new RoomObjectModel();
    }

    protected onDispose(): void
    {
        this.removeAllManagers();

        this.destroyRenderer();

        this._container = null;

        this._model.dispose();
    }

    public setRenderer(renderer: IRoomRendererBase): void
    {
        if(renderer === this._renderer) return;

        if(this._renderer) this.destroyRenderer();

        this._renderer = renderer;

        if(!this._renderer) return;

        this._renderer.reset();

        if(this._managers.size)
        {
            for(let manager of this._managers.values())
            {
                if(!manager) continue;

                const objects = manager.objects;

                if(!objects.length) continue;

                for(let object of objects.getValues())
                {
                    if(!object) continue;

                    this._renderer.addObject(object);
                }
            }
        }
    }

    private destroyRenderer(): void
    {
        if(!this._renderer) return;

        this._renderer.dispose();

        this._renderer = null;
    }

    public getManager(category: number): IRoomObjectManager
    {
        const manager = this._managers.get(category);

        if(!manager) return null;

        return manager;
    }

    private getManagerOrCreate(category: number): IRoomObjectManager
    {
        let manager = this.getManager(category);

        if(manager) return manager;

        manager = this._container.createRoomObjectManager(category);

        if(!manager) return null;

        this._managers.set(category, manager);

        return manager;
    }

    public getTotalObjectsForManager(category: number): number
    {
        const manager = this.getManager(category);

        if(!manager) return 0;

        return manager.totalObjects;
    }

    public getRoomObject(id: number, category: number): IRoomObject
    {
        const manager = this.getManager(category);

        if(!manager) return null;

        const object = manager.getObject(id);

        if(!object) return null;

        return object;
    }

    public getRoomObjectsForCategory(category: number): IRoomObject[]
    {
        const manager = this.getManager(category);

        return (manager ? manager.objects.getValues() : []);
    }

    public getRoomObjectByIndex(index: number, category: number): IRoomObject
    {
        const manager = this.getManager(category);

        if(!manager) return null;

        const object = manager.getObjectByIndex(index);

        if(!object) return null;

        return object;
    }

    public createRoomObject(id: number, stateCount: number, type: string, category: number): IRoomObjectController
    {
        const manager = this.getManagerOrCreate(category);

        if(!manager) return null;

        const object = manager.createObject(id, stateCount, type);

        if(!object) return null;

        if(this._renderer) this._renderer.addObject(object);

        return object;
    }

    public createRoomObjectAndInitalize(objectId: number, type: string, category: number): IRoomObject
    {
        if(!this._container) return null;

        return this._container.createRoomObjectAndInitalize(this._id, objectId, type, category);
    }

    public removeRoomObject(id: number, category: number): void
    {
        const manager = this.getManager(category);

        if(!manager) return;

        const object = manager.getObject(id);

        if(!object) return;

        object.tearDown();

        if(this._renderer) this._renderer.removeObject(object);

        manager.removeObject(id);
    }

    public removeAllManagers(): void
    {
        for(let manager of this._managers.values())
        {
            if(!manager) continue;

            if(this._renderer)
            {
                const objects = manager.objects;

                if(objects.length)
                {
                    for(let object of objects.getValues())
                    {
                        if(!object) continue;

                        this._renderer.removeObject(object);
                    }
                }
            }

            manager.dispose();
        }

        this._managers.clear();
    }

    public addUpdateCategory(category: number): void
    {
        const index = this._updateCategories.indexOf(category);

        if(index >= 0) return;

        this._updateCategories.push(category);
    }

    public removeUpdateCategory(category: number): void
    {
        const index = this._updateCategories.indexOf(category);

        if(index === -1) return;

        this._updateCategories.splice(index, 1);
    }

    public update(time: number, update: boolean = false): void
    {
        for(let category of this._updateCategories)
        {
            const manager = this.getManager(category);

            if(!manager) continue;

            const objects = manager.objects;

            if(!objects.length) continue;

            for(let object of objects.getValues())
            {
                if(!object) continue;

                const logic = object.logic;

                if(logic) logic.update(time);
            }
        }

        this._renderer && this._renderer.update(time, update);
    }

    public hasUninitializedObjects(): boolean
    {
        for(let manager of this._managers.values())
        {
            if(!manager) continue;

            for(let object of manager.objects.getValues())
            {
                if(!object) continue;

                if(!object.isReady) return true;
            }
        }

        return false;
    }

    public get id(): string
    {
        return this._id;
    }

    public get container(): IRoomInstanceContainer
    {
        return this._container;
    }

    public get renderer(): IRoomRendererBase
    {
        return this._renderer;
    }

    public get managers(): Map<number, IRoomObjectManager>
    {
        return this._managers;
    }

    public get model(): IRoomObjectModel
    {
        return this._model;
    }
}