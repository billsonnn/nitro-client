import { IDisposeable } from '../../core/common/disposable/IDisposable';
import { IConnection } from '../../core/communication/connections/IConnection';
import { UserDataManager } from './UserDataManager';

export interface IRoomSession extends IDisposeable
{
    connection: IConnection;
    userData: UserDataManager;
}