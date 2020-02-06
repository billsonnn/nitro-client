import { IDisposable } from '../../core/common/disposable/IDisposable';
import { IConnection } from '../../core/communication/connections/IConnection';
import { UserDataManager } from './UserDataManager';

export interface IRoomSession extends IDisposable
{
    setConnection(connection: IConnection): void;
    setControllerLevel(level: number): void;
    setOwnUserRoomId(userId: number): void;
    setRoomOwner(): void;
    start(): boolean;
    reset(roomId: number): void;
    connection: IConnection;
    roomId: number;
    state: string;
    userData: UserDataManager;
    controllerLevel: number;
    ownerUserRoomId: number
    roomOwner: boolean;
}