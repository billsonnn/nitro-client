import { INitroCore } from './INitroCore';
import { NitroCore } from './NitroCore';

export class NitroCoreFactory
{
    public static createCoreInstance(): INitroCore
    {
        return new NitroCore();
    }
}