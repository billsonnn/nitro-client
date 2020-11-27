import { INitroManager } from '../../core/common/INitroManager';

export interface INitroLocalizationManager extends INitroManager 
{
    getValue(key: string, replacements?: { [index: string]: any }): string
    setValue(key: string, value: string): void;
    registerParameter(key: string, parameter: string, value: string): void;
}