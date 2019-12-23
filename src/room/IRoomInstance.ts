import { IDisposable } from '../core/common/disposable/IDisposable';
import { IRoomInstanceContainer } from './IRoomInstanceContainer';
import { IRoomObjectManager } from './IRoomObjectManager';
import { IRoomObjectController } from './object/IRoomObjectController';
import { IRoomRenderer } from './renderer/IRoomRenderer';

export interface IRoomInstance extends IDisposable
{
    setRenderer(renderer: IRoomRenderer): void;
    getManager(category: number): IRoomObjectManager;
    getObject(id: number, category: number): IRoomObjectController;
    getUnit(id: number): IRoomObjectController;
    removeUnit(id: number): void;
    getFurniture(id: number): IRoomObjectController;
    removeFurniture(id: number): void;
    createObject(id: number, type: string, category: number): IRoomObjectController;
    removeObject(id: number, category: number): void;
    removeAllManagers(): void;
    id: number;
    container: IRoomInstanceContainer;
    renderer: IRoomRenderer;
}