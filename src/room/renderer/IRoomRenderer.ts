import { IRoomRendererBase } from './IRoomRendererBase';
import { IRoomRenderingCanvas } from './IRoomRenderingCanvas';

export interface IRoomRenderer extends IRoomRendererBase 
{
    createCanvas(id: number, width: number, height: number, scale: number): IRoomRenderingCanvas;
}