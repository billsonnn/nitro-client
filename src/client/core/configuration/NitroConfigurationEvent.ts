import { NitroEvent } from '../events/NitroEvent';

export class NitroConfigurationEvent extends NitroEvent
{
    public static LOADED: string    = 'NCE_LOADED';
    public static FAILED: string    = 'NCE_FAILED';

    constructor(type: string)
    {
        super(type);
    }
}