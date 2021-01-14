import { Component, ComponentFactoryResolver, ComponentRef, NgZone, OnDestroy, OnInit, ViewChild, ViewContainerRef, ViewRef } from '@angular/core';
import { Nitro } from '../../../../../client/nitro/Nitro';
import { NotificationService } from '../../services/notification.service';
import { NotificationBroadcastMessageComponent } from '../broadcast-message/broadcast-message.component';
import { NotificationConfirmComponent } from '../confirm/confirm.component';
import { NotificationModeratorMessageComponent } from '../moderator-message/moderator-message.component';
import { NotificationMultipleMessagesComponent } from '../motd/motd.component';
import { NotificationDialogComponent } from '../notificationdialog/notificationdialog.component';

@Component({
    selector: 'nitro-notification-main-component',
    templateUrl: './main.template.html'
})
export class NotificationMainComponent implements OnInit, OnDestroy 
{
    @ViewChild('alertsContainer', { read: ViewContainerRef })
    public alertsContainer: ViewContainerRef;

    public _alerts: Map<NotificationBroadcastMessageComponent, ComponentRef<NotificationBroadcastMessageComponent>> = new Map();

    constructor(
        private _notificationService: NotificationService,
        private _componentFactoryResolver: ComponentFactoryResolver,
        private _ngZone: NgZone) 
    { }

    public ngOnInit(): void 
    {
        this._notificationService.component = this;
    }

    public ngOnDestroy(): void 
    {
        this._notificationService.component = null;
    }

    public alert(message: string, title: string = null): NotificationBroadcastMessageComponent 
    {
        return this.buildAlert(NotificationBroadcastMessageComponent, message, title);
    }

    public alertWithLink(message: string, link: string = null, title: string = null): NotificationBroadcastMessageComponent 
    {
        const component = (this.buildAlert(NotificationModeratorMessageComponent, message, title) as NotificationModeratorMessageComponent);

        if(!component) return null;

        component.link = link;

        return component;
    }

    public alertWithConfirm(message: string, title: string = null, callback: Function = null): NotificationBroadcastMessageComponent 
    {
        const component = (this.buildAlert(NotificationConfirmComponent, message, title) as NotificationConfirmComponent);

        if(!component) return null;

        component.callback = callback;

        return component;
    }

    public alertWithScrollableMessages(messages: string[], title: string = null): NotificationBroadcastMessageComponent 
    {
        const component = (this.buildAlert(NotificationMultipleMessagesComponent, null, title) as NotificationMultipleMessagesComponent);

        if(!component) return;

        const transformedMessages: string[] = [];

        for(const message of messages) 
        {
            if(!message) continue;

            transformedMessages.push(message.replace(/\r\n|\r|\n/g, '<br />'));
        }

        component.messages = transformedMessages;

        return component;
    }

    public buildAlert(type: typeof NotificationBroadcastMessageComponent, message: string, title: string = null): NotificationBroadcastMessageComponent 
    {
        let component: NotificationBroadcastMessageComponent = null;

        this._ngZone.run(() => 
        {
            component = this.createComponent(type);

            if(title) 
            {
                if(title.startsWith('${')) title = Nitro.instance.getLocalization(title);
            }
            else 
            {
                title = Nitro.instance.getLocalization('${mod.alert.title}');
            }

            if(message) 
            {
                if(message.startsWith('${')) message = Nitro.instance.getLocalization(message);

                message = message.replace(/\r\n|\r|\n/g, '<br />');
            }

            component.title = title;
            component.message = message;
        });

        if(!component) return null;

        return component;
    }

    private createComponent(type: typeof NotificationBroadcastMessageComponent): NotificationBroadcastMessageComponent 
    {
        if(!type) return null;

        let instance: NotificationBroadcastMessageComponent = null;

        const factory = this._componentFactoryResolver.resolveComponentFactory(type);

        let ref: ComponentRef<NotificationBroadcastMessageComponent> = null;

        if(factory) 
        {
            ref = this.alertsContainer.createComponent(factory);

            this._alerts.set(ref.instance, ref);
        }

        instance = ref.instance;

        return instance;
    }

    public close(component: NotificationBroadcastMessageComponent): void 
    {
        if(!component) return;

        const ref = this._alerts.get(component);

        if(!ref) return;

        this._alerts.delete(component);

        this.removeView(ref.hostView);
    }

    public closeAll(): void 
    {
        for(const component of this._alerts.keys()) this.close(component);
    }

    private removeView(view: ViewRef): void 
    {
        if(!view) return;

        const index = this.alertsContainer.indexOf(view);

        if(index === -1) return;

        this.alertsContainer.remove(index);
    }
}