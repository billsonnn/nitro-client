import { INitroManager } from '../../core/common/INitroManager';
import { INitroCommunicationManager } from '../communication/INitroCommunicationManager';
import { IRoomSessionManager } from '../session/IRoomSessionManager';
import { ISessionDataManager } from '../session/ISessionDataManager';

export interface INitroNavigator extends INitroManager
{
    goToRoom(roomId: number, password?: string): void;
    communication: INitroCommunicationManager;
    session: ISessionDataManager;
    roomSession: IRoomSessionManager;
}