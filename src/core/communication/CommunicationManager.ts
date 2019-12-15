import { IConnection } from './connections/IConnection';
import { IConnectionStateListener } from './connections/IConnectionStateListener';
import { SocketConnection } from './connections/SocketConnection';
import { ICommunicationManager } from './ICommunicationManager';

export class CommunicationManager implements ICommunicationManager
{
    private _connections: IConnection[]

    constructor()
    {
        this._connections = [];
    }

    public dispose(): void
    {
        if(this._connections)
        {
            for(let connection of this._connections.values())
            {
                if(!connection) continue;

                connection.dispose();
            }
        }
    }

    public createConnection(stateListener: IConnectionStateListener = null): IConnection
    {
        const connection = new SocketConnection(this, stateListener);

        if(!connection) return;

        this._connections.push(connection);

        return connection;
    }
}