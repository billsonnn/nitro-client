import { INitroManager } from '../../core/common/INitroManager';

export interface INitroLocalizationManager extends INitroManager
{
    getValue(key: string, doParams?: boolean): string;
    getValueWithParameter(key: string, parameter: string, replacement: string): string;
    setValue(key: string, value: string): void;
    registerParameter(key: string, parameter: string, value: string): void;
}