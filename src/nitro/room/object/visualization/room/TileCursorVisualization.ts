import { FurnitureAnimatedVisualization } from '../furniture/FurnitureAnimatedVisualization';

export class TileCursorVisualization extends FurnitureAnimatedVisualization
{
    protected getAdditionalLayerCount(): number
    {
        return 0;
    }
}