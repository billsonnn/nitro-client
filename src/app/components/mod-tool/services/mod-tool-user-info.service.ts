import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { IMessageEvent } from '../../../../client/core/communication/messages/IMessageEvent';
import { NotificationService } from '../../notification/services/notification.service';
import { ModtoolRoomInfoEvent } from '../../../../client/nitro/communication/messages/incoming/modtool/ModtoolRoomInfoEvent';
import { UserInfoEvent } from '../../../../client/nitro/communication/messages/incoming/user/data/UserInfoEvent';
import { ModtoolUserChatlogEvent } from '../../../../client/nitro/communication/messages/incoming/modtool/ModtoolUserChatlogEvent';
import { ModtoolRoomChatlogEvent } from '../../../../client/nitro/communication/messages/incoming/modtool/ModtoolRoomChatlogEvent';
import { Nitro } from '../../../../client/nitro/Nitro';
import { ModtoolRequestUserInfoComposer } from '../../../../client/nitro/communication/messages/outgoing/modtool/ModtoolRequestUserInfoComposer';

@Injectable()
export class ModToolUserInfoService implements OnDestroy
{
    private _messages: IMessageEvent[];

    constructor(
        private _notificationService: NotificationService,
        private _ngZone: NgZone)
    {

        this.registerMessages();
    }

    public ngOnDestroy(): void
    {
        this.unregisterMessages();
    }

    private registerMessages(): void
    {
        if(this._messages) this.unregisterMessages();

        this._messages = [
        ];

        for(const message of this._messages) Nitro.instance.communication.registerMessageEvent(message);
    }

    private unregisterMessages(): void
    {
        if(this._messages && this._messages.length)
        {
            for(const message of this._messages) Nitro.instance.communication.removeMessageEvent(message);
        }
    }

    public load(userId: number): void
    {
        Nitro.instance.communication.connection.send(new ModtoolRequestUserInfoComposer(userId));
    }

}
