import { INitroManager } from '../../core/common/INitroManager';
import { IRoomManager } from '../../room/IRoomManager';
import { INitroCommunicationManager } from '../communication/INitroCommunicationManager';
import { IRoomEngine } from '../room/IRoomEngine';
import { IRoomSession } from './IRoomSession';
import { ISessionDataManager } from './ISessionDataManager';

export interface IRoomSessionManager extends INitroManager
{
    getSession(id: number): IRoomSession;
    createSession(roomId: number, password?: string): boolean;
    communication: INitroCommunicationManager;
    sessionData: ISessionDataManager;
    roomEngine: IRoomEngine;
    roomManager: IRoomManager;
}