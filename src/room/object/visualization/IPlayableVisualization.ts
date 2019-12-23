import { IDisposable } from '../../../core/common/disposable/IDisposable';

export interface IPlayableVisualization extends IDisposable
{
    start(): void;
    update(delta: number): void;
    stop(): void;
    frameCount: number;
    totalTimeRunning: number;
}