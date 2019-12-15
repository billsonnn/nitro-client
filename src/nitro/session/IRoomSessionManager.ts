import { INitroManager } from '../../core/common/INitroManager';
import { INitroCommunicationManager } from '../communication/INitroCommunicationManager';
import { IRoomEngine } from '../room/IRoomEngine';

export interface IRoomSessionManager extends INitroManager
{
    communication: INitroCommunicationManager;
    roomEngine: IRoomEngine;
}