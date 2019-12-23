import { IDisposable } from '../../core/common/disposable/IDisposable';
import { IConnection } from '../../core/communication/connections/IConnection';
import { UserDataManager } from './UserDataManager';

export interface IRoomSession extends IDisposable
{
    setConnection(connection: IConnection): void;
    start(): boolean;
    reset(roomId: number): void;
    connection: IConnection;
    roomId: number;
    userData: UserDataManager;
    state: string;
}