import { INitroManager } from '../../core/common/INitroManager';
import { INitroCommunicationManager } from '../communication/INitroCommunicationManager';
import { IRoomSession } from './IRoomSession';

export interface IRoomSessionManager extends INitroManager
{
    getSession(id: number): IRoomSession;
    createSession(roomId: number, password?: string): boolean;
    communication: INitroCommunicationManager;
    viewerSession: IRoomSession;
}