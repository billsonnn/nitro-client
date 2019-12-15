import { IConnection } from './connections/IConnection';
import { IConnectionStateListener } from './connections/IConnectionStateListener';

export interface ICommunicationManager
{
    dispose(): void;
    createConnection(stateListener?: IConnectionStateListener): IConnection;
}