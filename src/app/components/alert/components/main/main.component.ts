import { Component, ComponentFactoryResolver, ComponentRef, NgZone, OnDestroy, OnInit, ViewChild, ViewContainerRef, ViewRef } from '@angular/core';
import { Nitro } from '../../../../../client/nitro/Nitro';
import { AlertService } from '../../services/alert.service';
import { AlertConfirmComponent } from '../confirm/confirm.component';
import { AlertGenericLinkComponent } from '../generic-link/generic-link.component';
import { AlertGenericComponent } from '../generic/generic.component';
import { AlertMultipleMessagesComponent } from '../multiple-messages/multiple-messages.component';

@Component({
	selector: 'nitro-alert-main-component',
    templateUrl: './main.template.html'
})
export class AlertMainComponent implements OnInit, OnDestroy
{
    @ViewChild('alertsContainer', { read: ViewContainerRef })
    public alertsContainer: ViewContainerRef;

    private _alerts: Map<AlertGenericComponent, ComponentRef<AlertGenericComponent>> = new Map();

    constructor(
        private _alertService: AlertService,
        private _componentFactoryResolver: ComponentFactoryResolver,
        private _ngZone: NgZone) {}

    public ngOnInit(): void
    {
        this._alertService.component = this;
    }

    public ngOnDestroy(): void
    {
        this._alertService.component = null;
    }

    public alert(message: string, title: string = null): void
    {
        this.buildAlert(AlertGenericComponent, message, title);
    }

    public alertLink(message: string, link: string = null, title: string = null): void
    {
        const component = (this.buildAlert(AlertGenericLinkComponent, message, title) as AlertGenericLinkComponent);

        if(!component) return;

        component.link = link;
    }

    public alertConfirm(message: string, title: string = null, callback: Function = null): void
    {
        const component = (this.buildAlert(AlertConfirmComponent, message, title) as AlertConfirmComponent);

        if(!component) return;

        component.callback = callback;
    }

    public alertMultipleMessages(messages: string[], title: string = null): void
    {
        const component = (this.buildAlert(AlertMultipleMessagesComponent, null, title) as AlertMultipleMessagesComponent);

        if(!component) return;

        const transformedMessages: string[] = [];

        for(let message of messages)
        {
            if(!message) continue;

            transformedMessages.push(message.replace(/\r\n|\r|\n/g, '<br />'));
        }

        component.messages = transformedMessages;
    }

    public buildAlert(type: typeof AlertGenericComponent, message: string, title: string = null): AlertGenericComponent
    {
        const component = this.createComponent(type);

        if(!component) return null;

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

        component.title     = title;
        component.message   = message;

        return component;
    }

    private createComponent(type: typeof AlertGenericComponent): AlertGenericComponent
    {
        if(!type) return null;

        let instance: AlertGenericComponent = null;

        this._ngZone.run(() =>
        {
            const factory = this._componentFactoryResolver.resolveComponentFactory(type);

            let ref: ComponentRef<AlertGenericComponent> = null;

            if(factory)
            {
                ref = this.alertsContainer.createComponent(factory);

                this._alerts.set(ref.instance, ref);
            }

            instance = ref.instance;
        });

        return instance;
    }

    public close(component: AlertGenericComponent): void
    {
        if(!component) return;

        const ref = this._alerts.get(component);

        if(!ref) return;

        this._alerts.delete(component);

        this.removeView(ref.hostView);
    }

    public closeAll(): void
    {
        for(let component of this._alerts.keys()) this.close(component);
    }

    private removeView(view: ViewRef): void
    {
        if(!view) return;

        const index = this.alertsContainer.indexOf(view);

        if(index === -1) return;

        this.alertsContainer.remove(index);
    }
}