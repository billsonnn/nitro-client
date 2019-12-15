import { IEventDispatcher } from '../../events/IEventDispatcher';
import { IMessageComposer } from '../messages/IMessageComposer';
import { IMessageConfiguration } from '../messages/IMessageConfiguration';
import { IMessageEvent } from '../messages/IMessageEvent';

export interface IConnection extends IEventDispatcher
{
    init(socketUrl: string): void;
    dispose(): void;
    authenticated(): void;
    send(...composers: IMessageComposer[]): void;
    registerMessages(configuration: IMessageConfiguration): void;
    addMessageEvent(event: IMessageEvent): void;
    removeMessageEvent(event: IMessageEvent): void;
    isAuthenticated: boolean;
}