import { NitroManager } from '../../core/common/NitroManager';
import { IMessageEvent } from '../../core/communication/messages/IMessageEvent';
import { IAvatarRenderManager } from '../avatar/IAvatarRenderManager';
import { INitroCommunicationManager } from '../communication/INitroCommunicationManager';
import { UserCurrencyComposer } from '../communication/messages/outgoing/user/inventory/currency/UserCurrencyComposer';
import { IRoomEngine } from '../room/IRoomEngine';
import { ISessionDataManager } from '../session/ISessionDataManager';
import { INitroWindowManager } from '../window/INitroWindowManager';
import { INitroInventory } from './INitroInventory';

export class NitroInventory extends NitroManager implements INitroInventory
{
    private _communication: INitroCommunicationManager;
    private _windowManager: INitroWindowManager;
    private _roomEngine: IRoomEngine;
    private _avatarRenderManager: IAvatarRenderManager;
    private _sessionData: ISessionDataManager;
    private _catalog: INitroInventory;

    private _messages: IMessageEvent[];

    constructor(communication: INitroCommunicationManager, windowManager: INitroWindowManager, engine: IRoomEngine, avatarRenderManager: IAvatarRenderManager, sessionData: ISessionDataManager, catalog: INitroInventory)
    {
        super();

        this._communication         = communication;
        this._windowManager         = windowManager;
        this._roomEngine            = engine;
        this._avatarRenderManager   = avatarRenderManager;
        this._sessionData           = sessionData;
        this._catalog               = catalog;

        this._messages              = [];
    }

    public onInit(): void
    {
        console.log('here')
        this._communication.connection.send(new UserCurrencyComposer());
    }

    public onDispose(): void
    {
        
    }
}