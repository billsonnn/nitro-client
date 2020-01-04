import { IRoomObjectManager } from './IRoomObjectManager';
import { IRoomObjectController } from './object/IRoomObjectController';
import { RoomObject } from './object/RoomObject';

export class RoomObjectManager implements IRoomObjectManager
{
    private _category: number;
    private _objects: Map<number, IRoomObjectController>;

    constructor(category: number)
    {
        this._category  = category;
        this._objects   = new Map();
    }

    public dispose(): void
    {
        this.removeAllObjects();
    }

    public getObject(id: number): IRoomObjectController
    {
        const object = this._objects.get(id);

        if(!object) return null;

        return object;
    }

    public createObject(id: number, type: string): IRoomObjectController
    {
        const object: RoomObject = new RoomObject(id, type);

        if(!object) return null;

        return this.addObject(id, object);
    }

    private addObject(id: number, object: IRoomObjectController): IRoomObjectController
    {
        if(!object) return null;

        if(this._objects.get(id))
        {
            object.dispose();

            return null;
        }

        object.setCategory(this._category);

        this._objects.set(id, object);

        return object;
    }

    public removeObject(id: number): void
    {
        const object = this.getObject(id);

        if(!object) return;

        this._objects.delete(id);

        object.dispose();
    }

    public removeAllObjects(): void
    {
        for(let object of this._objects.values())
        {
            if(!object) continue;

            this._objects.delete(object.id);

            object.dispose();
        }
    }

    public get category(): number
    {
        return this._category;
    }

    public get objects(): Map<number, IRoomObjectController>
    {
        return this._objects;
    }
}