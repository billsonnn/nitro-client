import { NitroManager } from '../../core/common/NitroManager';
import { IMessageEvent } from '../../core/communication/messages/IMessageEvent';
import { IAvatarRenderManager } from '../avatar/IAvatarRenderManager';
import { INitroCommunicationManager } from '../communication/INitroCommunicationManager';
import { UserCreditsEvent } from '../communication/messages/incoming/user/inventory/currency/UserCreditsEvent';
import { IRoomEngine } from '../room/IRoomEngine';
import { IRoomSessionManager } from '../session/IRoomSessionManager';
import { ISessionDataManager } from '../session/ISessionDataManager';
import { INitroCatalog } from './INitroCatalog';

export class NitroCatalog extends NitroManager implements INitroCatalog
{
    private _communication: INitroCommunicationManager;
    private _roomEngine: IRoomEngine;
    private _avatarRenderManager: IAvatarRenderManager;
    private _sessionData: ISessionDataManager;
    private _roomSession: IRoomSessionManager;

    private _messages: IMessageEvent[];

    constructor(communication: INitroCommunicationManager, engine: IRoomEngine, avatarRenderManager: IAvatarRenderManager, sessionData: ISessionDataManager, roomSession: IRoomSessionManager)
    {
        super();

        this._communication         = communication;
        this._roomEngine            = engine;
        this._avatarRenderManager   = avatarRenderManager;
        this._sessionData           = sessionData;
        this._roomSession           = roomSession;

        this._messages              = [];
    }

    public onInit(): void
    {
        this.addMessageEvent(new UserCreditsEvent(this.onUserCreditsEvent.bind(this)));
    }

    public onDispose(): void
    {
        if(this._messages)
        {
            for(let message of this._messages) this._communication.removeMessageEvent(message);

            this._messages = null;
        }
    }

    private addMessageEvent(event: IMessageEvent): void
    {
        this._messages.push(this._communication.registerMessageEvent(event));
    }

    private onUserCreditsEvent(event: UserCreditsEvent): void
    {
        console.log(event);
    }
}