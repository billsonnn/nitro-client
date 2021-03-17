import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { IMessageEvent } from 'nitro-renderer/src/core/communication/messages/IMessageEvent';
import { ModtoolUserInfoEvent } from 'nitro-renderer/src/nitro/communication/messages/incoming/modtool/ModtoolUserInfoEvent';
import { ModtoolRequestUserInfoComposer } from 'nitro-renderer/src/nitro/communication/messages/outgoing/modtool/ModtoolRequestUserInfoComposer';
import { _Str_5467 } from 'nitro-renderer/src/nitro/communication/messages/parser/modtool/utils/_Str_5467';
import { Nitro } from 'nitro-renderer/src/nitro/Nitro';
import { NotificationService } from '../../notification/services/notification.service';

@Injectable()
export class ModToolUserInfoService implements OnDestroy
{
    private _messages: IMessageEvent[];

    private _currentUserInfo: _Str_5467;

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
            new ModtoolUserInfoEvent(this.onUserInfoEvent.bind(this)),
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

    private onUserInfoEvent(event: ModtoolUserInfoEvent): void
    {
        if(!event) return;

        const parser = event.getParser();
        if(!parser || !parser.data) return;

        this._ngZone.run(() =>this._currentUserInfo = parser.data);

    }

    public get currentUserInfo(): _Str_5467
    {
        return this._currentUserInfo;
    }

}
