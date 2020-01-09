import { NitroEvent } from '../../../core/events/NitroEvent';
import { ISessionDataManager } from '../ISessionDataManager';

export class SessionDataEvent extends NitroEvent
{
    public static UPDATED: string           = 'SDE_UPDATED';
    public static FIGURE_UPDATED: string    = 'SDE_FIGURE_UPDATED';

    private _session: ISessionDataManager;

    constructor(type: string, session: ISessionDataManager)
    {
        super(type);

        this._session = session;
    }

    public get session(): ISessionDataManager
    {
        return this._session;
    }
}