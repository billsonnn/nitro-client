import { IDisposeable } from './disposable/IDisposable';
import { INitroLogger } from './logger/INitroLogger';

export interface INitroManager extends IDisposeable
{
    init(): void;
    logger: INitroLogger;
    isLoaded: boolean;
    isLoading: boolean;
}