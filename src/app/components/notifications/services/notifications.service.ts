import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { IMessageEvent } from '../../../../client/core/communication/messages/IMessageEvent';
import { MOTDNotificationEvent } from '../../../../client/nitro/communication/messages/incoming/notifications/MOTDNotificationEvent';
import { Nitro } from '../../../../client/nitro/Nitro';
import { AlertService } from '../../alert/services/alert.service';
import { NotificationsMainComponent } from '../components/main/main.component';

@Injectable()
export class NotificationsService implements OnDestroy
{
    private _component: NotificationsMainComponent;
    private _messages: IMessageEvent[];

    constructor(
        private _alertService: AlertService,
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
            new MOTDNotificationEvent(this.onMOTDNotificationEvent.bind(this))
        ];

        for(let message of this._messages) Nitro.instance.communication.registerMessageEvent(message);
    }

    private unregisterMessages(): void
    {
        if(this._messages && this._messages.length)
        {
            for(let message of this._messages) Nitro.instance.communication.removeMessageEvent(message);
        }
    }

    private onMOTDNotificationEvent(event: MOTDNotificationEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        this._ngZone.run(() => this._alertService.alertMultipleMessages(parser.messages));
    }

    public get component(): NotificationsMainComponent
    {
        return this._component;
    }

    public set component(component: NotificationsMainComponent)
    {
        this._component = component;
    }
}