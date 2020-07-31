import { IRoomObjectGraphicVisualization } from './IRoomObjectGraphicVisualization';
import { IRoomObjectSprite } from './IRoomObjectSprite';

export interface IRoomObjectSpriteVisualization extends IRoomObjectGraphicVisualization
{
    getSprite(index: number): IRoomObjectSprite;
    sprites: IRoomObjectSprite[];
    updateObjectCounter: number;
    updateModelCounter: number;
}