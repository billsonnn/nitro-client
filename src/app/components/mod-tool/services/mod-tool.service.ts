import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { IMessageEvent } from '../../../../client/core/communication/messages/IMessageEvent';
import { CallForHelpResultMessageEvent } from '../../../../client/nitro/communication/messages/incoming/help/CallForHelpResultMessageEvent';
import { Nitro } from '../../../../client/nitro/Nitro';
import { NotificationService } from '../../notification/services/notification.service';
import { ModToolMainComponent } from '../components/main/main.component';

@Injectable()
export class ModToolService implements OnDestroy
{
    private _component: ModToolMainComponent;
    private _messages: IMessageEvent[];

    constructor(
        private _notificationService: NotificationService,
        private _ngZone: NgZone)
    {
        this._component = null;

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

    public get component(): ModToolMainComponent
    {
        return this._component;
    }

    public set component(component: ModToolMainComponent)
    {
        this._component = component;
    }
}
