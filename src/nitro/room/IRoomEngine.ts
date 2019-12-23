import { INitroManager } from '../../core/common/INitroManager';
import { IRoomObjectLogicFactory } from '../../room/object/logic/IRoomObjectLogicFactory';
import { IRoomObjectVisualizationFactory } from '../../room/object/visualization/IRoomObjectVisualizationFactory';
import { IRoomRendererFactory } from '../../room/renderer/IRoomRendererFactory';

export interface IRoomEngine extends INitroManager
{
    roomRendererFactory: IRoomRendererFactory;
    visualizationFactory: IRoomObjectVisualizationFactory;
    logicFactory: IRoomObjectLogicFactory;
}