import { IDisposable } from '../core/common/disposable/IDisposable';
import { IRoomInstanceContainer } from './IRoomInstanceContainer';
import { IRoomObjectManager } from './IRoomObjectManager';
import { IRoomObject } from './object/IRoomObject';
import { IRoomRendererBase } from './renderer/IRoomRendererBase';

export interface IRoomInstance extends IDisposable
{
    setRenderer(renderer: IRoomRendererBase): void;
    getManager(category: number): IRoomObjectManager;
    getRoomObject(id: number, category: number): IRoomObject;
    createRoomObject(id: number, type: string, category: number): IRoomObject;
    createRoomObjectAndInitalize(objectId: number, type: string, category: number): IRoomObject;
    removeRoomObject(id: number, category: number): void;
    removeAllManagers(): void;
    addUpdateCategory(category: number): void;
    removeUpdateCategory(category: number): void;
    update(time: number): void;
    id: number;
    container: IRoomInstanceContainer;
    renderer: IRoomRendererBase;
    managers: Map<number, IRoomObjectManager>;
}