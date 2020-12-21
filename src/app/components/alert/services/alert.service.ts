import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { IMessageEvent } from '../../../../client/core/communication/messages/IMessageEvent';
import { GenericAlertEvent } from '../../../../client/nitro/communication/messages/incoming/generic/GenericAlertEvent';
import { GenericAlertLinkEvent } from '../../../../client/nitro/communication/messages/incoming/generic/GenericAlertLinkEvent';
import { Nitro } from '../../../../client/nitro/Nitro';
import { AlertGenericComponent } from '../components/generic/generic.component';
import { AlertMainComponent } from '../components/main/main.component';

@Injectable()
export class AlertService implements OnDestroy
{
    private _component: AlertMainComponent;
    private _messages: IMessageEvent[];

    constructor(
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
            new GenericAlertEvent(this.onGenericAlertEvent.bind(this)),
            new GenericAlertLinkEvent(this.onGenericAlertLinkEvent.bind(this))
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

    private onGenericAlertEvent(event: GenericAlertEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        this._ngZone.run(() => this.alert(parser.message));
    }

    private onGenericAlertLinkEvent(event: GenericAlertLinkEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        this._ngZone.run(() => this.alertLink(parser.message, parser.link));
    }

    public alert(message: string, title: string = null): void
    {
        if(!this._component) return;

        this._component.alert(message, title);
    }

    public alertLink(message: string, link: string, title: string = null): void
    {
        if(!this._component) return;

        this._component.alertLink(message, link, title);
    }

    public alertConfirm(message: string, title: string = null, callback: Function = null): void
    {
        if(!this._component) return;

        this._component.alertConfirm(message, title, callback);
    }

    public alertMultipleMessages(messages: string[], title: string = null): void
    {
        if(!this._component) return;

        this._component.alertMultipleMessages(messages, title);
    }

    public closeAlert(component: AlertGenericComponent): void
    {
        if(!component || !this._component) return;

        this._component.close(component);
    }

    public closeAll(): void
    {
        if(!this._component) return;

        this._component.closeAll();
    }

    public get component(): AlertMainComponent
    {
        return this._component;
    }

    public set component(component: AlertMainComponent)
    {
        this._component = component;
    }
}