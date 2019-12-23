import { IRoomObjectController } from './object/IRoomObjectController';

export interface IRoomObjectManager
{
    dispose(): void;
    getObject(id: number): IRoomObjectController;
    createObject(id: number, type: string): IRoomObjectController;
    removeObject(id: number): void;
    removeAllObjects(): void;
    objects: Map<number, IRoomObjectController>;
}