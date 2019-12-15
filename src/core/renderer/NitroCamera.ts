import { Viewport, ViewportOptions } from 'pixi-viewport';
import { INitroCamera } from './INitroCamera';

export class NitroCamera extends Viewport implements INitroCamera
{
    constructor(options?: ViewportOptions)
    {
        super(options);
    }
}