import { INitroManager } from '../../core/common/INitroManager';

export interface INitroLocalizationManager extends INitroManager 
{
    getValue(key: string): string;
    setValue(key: string, value: string): void;
}