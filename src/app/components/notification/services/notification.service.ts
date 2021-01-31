import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { NotificationDialogMessageEvent } from 'src/client/nitro/communication/messages/incoming/notifications/NotificationDialogMessageEvent';
import { IMessageEvent } from '../../../../client/core/communication/messages/IMessageEvent';
import { ModeratorMessageEvent } from '../../../../client/nitro/communication/messages/incoming/moderation/ModeratorMessageEvent';
import { HabboBroadcastMessageEvent } from '../../../../client/nitro/communication/messages/incoming/notifications/HabboBroadcastMessageEvent';
import { MOTDNotificationEvent } from '../../../../client/nitro/communication/messages/incoming/notifications/MOTDNotificationEvent';
import { Nitro } from '../../../../client/nitro/Nitro';
import { AlertCenterComponent } from '../components/alert-center/alert-center.component';
import { NotificationBroadcastMessageComponent } from '../components/broadcast-message/broadcast-message.component';
import { NotificationChoice } from '../components/choices/choices.component';
import { NotificationCenterComponent } from '../components/notification-center/notification-center.component';
import { NotificationDialogComponent } from '../components/notification-dialog/notification-dialog.component';

@Injectable()
export class NotificationService implements OnDestroy
{
    private _alertCenter: AlertCenterComponent;
    private _notificationCenter: NotificationCenterComponent;

    private _messages: IMessageEvent[];

    constructor(private _ngZone: NgZone)
    {
        this._alertCenter           = null;
        this._notificationCenter    = null;

        this.registerMessages();
    }

    public ngOnDestroy(): void
    {
        this.unregisterMessages();
    }

    private registerMessages(): void
    {
        this._ngZone.runOutsideAngular(() =>
        {
            if(this._messages) this.unregisterMessages();

            this._messages = [
                new HabboBroadcastMessageEvent(this.onHabboBroadcastMessageEvent.bind(this)),
                new ModeratorMessageEvent(this.onModeratorMessageEvent.bind(this)),
                new MOTDNotificationEvent(this.onMOTDNotificationEvent.bind(this)),
                new NotificationDialogMessageEvent(this.onNotificationDialogMessageEvent.bind(this))
            ];

            for(const message of this._messages) Nitro.instance.communication.registerMessageEvent(message);
        });
    }

    private unregisterMessages(): void
    {
        this._ngZone.runOutsideAngular(() =>
        {
            for(const message of this._messages) Nitro.instance.communication.removeMessageEvent(message);

            this._messages = [];
        });
    }

    private onHabboBroadcastMessageEvent(event: HabboBroadcastMessageEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        this._ngZone.run(() => this.alert(parser.message));
    }

    private onNotificationDialogMessageEvent(event: NotificationDialogMessageEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        this._ngZone.run(() => this.displayNotification(parser.type, parser.parameters));
    }

    private onModeratorMessageEvent(event: ModeratorMessageEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        this._ngZone.run(() => this.alertWithLink(parser.message, parser.link));
    }

    private onMOTDNotificationEvent(event: MOTDNotificationEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        this._ngZone.run(() => this.alertWithScrollableMessages(parser.messages));
    }

    public alert(message: string, title: string = null): NotificationBroadcastMessageComponent
    {
        if(!this._alertCenter) return null;

        return this._alertCenter.alert(message, title);
    }

    public alertWithLink(message: string, link: string, title: string = null): NotificationBroadcastMessageComponent
    {
        if(!this._alertCenter) return null;

        return this._alertCenter.alertWithLink(message, link, title);
    }

    public alertWithConfirm(message: string, title: string = null, callback: Function = null): NotificationBroadcastMessageComponent
    {
        if(!this._alertCenter) return null;

        return this._alertCenter.alertWithConfirm(message, title, callback);
    }

    public alertWithChoices(message: string, choices: NotificationChoice[], title: string = null): NotificationBroadcastMessageComponent
    {
        if(!this._alertCenter) return null;

        return this._alertCenter.alertWithChoices(message, choices, title);
    }

    public alertWithScrollableMessages(messages: string[], title: string = null): NotificationBroadcastMessageComponent
    {
        if(!this._alertCenter) return null;

        return this._alertCenter.alertWithScrollableMessages(messages, title);
    }

    public displayNotification(type: string, parameters: Map<string, string>): NotificationDialogComponent
    {
        if(!this._notificationCenter) return null;

        return this._notificationCenter.displayNotification(type, parameters);
    }

    public closeAlert(component: NotificationBroadcastMessageComponent): void
    {
        if(!component || !this._alertCenter) return;

        this._alertCenter.closeAlert(component);
    }

    public closeNotification(component: NotificationDialogComponent): void
    {
        if(!component || !this._notificationCenter) return;

        this._notificationCenter.closeNotification(component);
    }

    public closeAll(): void
    {
        if(!this._alertCenter) return;

        this._alertCenter.closeAllAlerts();
        this._notificationCenter.closeAllNotifications();
    }

    public get alertCenter(): AlertCenterComponent
    {
        return this._alertCenter;
    }

    public set alertCenter(component: AlertCenterComponent)
    {
        this._alertCenter = component;
    }

    public get notificationCenter(): NotificationCenterComponent
    {
        return this._notificationCenter;
    }

    public set notificationCenter(component: NotificationCenterComponent)
    {
        this._notificationCenter = component;
    }
}