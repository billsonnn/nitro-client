import { IRoomObjectController } from '../IRoomObjectController';
import { IPlayableVisualization } from './IPlayableVisualization';
import { IRoomObjectSprite } from './IRoomObjectSprite';
import { IObjectVisualizationData } from './IRoomObjectVisualizationData';

export interface IRoomObjectSpriteVisualization extends IPlayableVisualization
{
    initialize(data: IObjectVisualizationData): boolean;
    dispose(): void;
    getSprite(name: string): IRoomObjectSprite;
    createAndAddSprite(name: string, source: string): IRoomObjectSprite;
    addSprite(name: string, sprite: IRoomObjectSprite): void;
    removeSprites(): void;
    hideSprites(): void;
    updateSprites(): void;
    setObject(object: IRoomObjectController): void;
    object: IRoomObjectController;
    sprites: Map<string, IRoomObjectSprite>;
    updateObjectCounter: number;
    updateModelCounter: number;
    depth: number;
}