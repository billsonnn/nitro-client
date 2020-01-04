import { Disposable } from '../core/common/disposable/Disposable';
import { NitroInstance } from '../nitro/NitroInstance';
import { IRoomInstance } from './IRoomInstance';
import { IRoomInstanceContainer } from './IRoomInstanceContainer';
import { IRoomObjectManager } from './IRoomObjectManager';
import { IRoomObjectController } from './object/IRoomObjectController';
import { IRoomRenderer } from './renderer/IRoomRenderer';

export class RoomInstance extends Disposable implements IRoomInstance
{
    private _id: number;
    private _container: IRoomInstanceContainer;
    private _renderer: IRoomRenderer;
    private _managers: Map<number, IRoomObjectManager>;

    constructor(id: number, container: IRoomInstanceContainer)
    {
        super();
        
        this._id        = id;
        this._container = container;
        this._renderer  = null;
        this._managers  = new Map();
    }

    protected onDispose(): void
    {
        this.removeAllManagers();

        this.destroyRenderer();

        this._container = null;
    }

    public setRenderer(renderer: IRoomRenderer): void
    {
        if(!renderer) return;

        if(renderer === this._renderer) return;

        if(this._renderer) this.destroyRenderer();
        
        NitroInstance.instance.renderer.view.onclick = event =>
        {
            if(NitroInstance.instance.renderer.preventEvents) return;

            if(NitroInstance.instance.renderer.preventNextClick)
            {
                NitroInstance.instance.renderer.preventNextClick = false;

                return;
            }

            renderer.click(event);
        }

        NitroInstance.instance.renderer.view.onmousemove = event =>
        {
            if(NitroInstance.instance.renderer.preventEvents) return;

            renderer.mouseMove(event);
        }

        NitroInstance.instance.renderer.view.onmousedown = event =>
        {
            if(NitroInstance.instance.renderer.preventEvents) return;

            renderer.mouseDown(event);
        }

        NitroInstance.instance.renderer.view.onmouseup = event =>
        {
            if(NitroInstance.instance.renderer.preventEvents) return;

            renderer.mouseUp(event);
        }

        this._renderer = renderer;
    }

    private destroyRenderer(): void
    {
        if(!this._renderer) return;

        this._renderer.dispose();

        this._renderer = null;

        NitroInstance.instance.renderer.view.onclick        = null;
        NitroInstance.instance.renderer.view.onmousemove    = null;
        NitroInstance.instance.renderer.view.onmousedown    = null;
        NitroInstance.instance.renderer.view.onmouseup      = null;

    }

    public getManager(category: number): IRoomObjectManager
    {
        const manager = this._managers.get(category);

        if(!manager) return null;

        return manager;
    }

    private getManagerOrCreate(category: number): IRoomObjectManager
    {
        const existing = this.getManager(category);

        if(existing) return existing;

        const manager = this._container.createRoomObjectManager(category);

        if(!manager) return null;

        this._managers.set(category, manager);

        return manager;
    }

    public getObject(id: number, category: number): IRoomObjectController
    {
        const manager = this.getManager(category);

        if(!manager) return null;

        const object = manager.getObject(id);

        if(!object) return null;

        return object;
    }

    public createObject(id: number, type: string, category: number): IRoomObjectController
    {
        const manager = this.getManagerOrCreate(category);

        if(!manager) return null;

        const object = manager.createObject(id, type);

        if(!object) return null;

        object.setRoom(this);

        return object;
    }

    public removeObject(id: number, category: number): void
    {
        const manager = this.getManager(category);

        if(!manager) return;

        manager.removeObject(id);
    }

    public removeAllManagers(): void
    {
        for(let manager of this._managers.values())
        {
            if(!manager) continue;

            manager.dispose();
        }

        this._managers.clear();
    }

    public get id(): number
    {
        return this._id;
    }

    public get container(): IRoomInstanceContainer
    {
        return this._container;
    }

    public get renderer(): IRoomRenderer
    {
        return this._renderer;
    }
}