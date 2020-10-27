import { INitroManager } from '../common/INitroManager';

export interface IConfigurationManager extends INitroManager 
{
    interpolate(value: string, regex?: RegExp): string;
    getValue<T>(key: string): T;
    setValue(key: string, value: string): void;
}