import { INitroManager } from '../common/INitroManager';

export interface INitroConfigurationManager extends INitroManager 
{
    getValue(key: string): string;
    setValue(key: string, value: string): void;
}