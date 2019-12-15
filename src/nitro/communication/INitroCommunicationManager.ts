import { INitroManager } from '../../core/common/INitroManager';
import { IConnection } from '../../core/communication/connections/IConnection';
import { IMessageEvent } from '../../core/communication/messages/IMessageEvent';

export interface INitroCommunicationManager extends INitroManager
{
    registerMessageEvent(event: IMessageEvent): IMessageEvent;
    removeMessageEvent(event: IMessageEvent): void;
    connection: IConnection;
}