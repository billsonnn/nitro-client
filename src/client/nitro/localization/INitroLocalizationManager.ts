import { INitroManager } from '../../core/common/INitroManager';

export interface INitroLocalizationManager extends INitroManager 
{
    getValue(key: string): string;
}