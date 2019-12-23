import { INitroManager } from '../../core/common/INitroManager';
import { IRoomManager } from '../../room/IRoomManager';
import { INitroCommunicationManager } from '../communication/INitroCommunicationManager';
import { IRoomEngine } from '../room/IRoomEngine';
import { IRoomSession } from './IRoomSession';

export interface IRoomSessionManager extends INitroManager
{
    getSession(id: number): IRoomSession;
    createSession(roomId: number, password?: string): boolean;
    communication: INitroCommunicationManager;
    roomEngine: IRoomEngine;
    roomManager: IRoomManager;
}