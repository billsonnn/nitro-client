import { Component, ComponentFactoryResolver, ComponentRef, NgZone, OnDestroy, OnInit, ViewChild, ViewContainerRef, ViewRef } from '@angular/core';
import { Nitro } from '../../../../../client/nitro/Nitro';
import { NotificationService } from '../../services/notification.service';
import { NotificationDialogComponent } from '../notificationdialog/notificationdialog.component';

@Component({
    selector: 'nitro-notification-centre-component',
    templateUrl: './nc.template.html'
})
export class NotificationCentreComponent implements OnInit, OnDestroy
{
    @ViewChild('alertsContainer', { read: ViewContainerRef })
    public alertsContainer: ViewContainerRef;

    private _alerts: Map<NotificationDialogComponent, ComponentRef<NotificationDialogComponent>> = new Map();

    constructor(
        private _notificationService: NotificationService,
        private _componentFactoryResolver: ComponentFactoryResolver,
        private _ngZone: NgZone)
    { }

    public ngOnInit(): void
    {
        this._notificationService.notificationCentre = this;
    }

    public ngOnDestroy(): void
    {
        this._notificationService.notificationCentre = null;
    }

    public publish(params: Array<string>, type: string): NotificationDialogComponent
    {
        const asset = params[0].split('}');

        const image = Nitro.instance.core.configuration.getValue('c.images.url') + '/' + asset[1];

        return this.buildPublish(params[2], image);
    }

    public buildPublish(message: string, image: string): NotificationDialogComponent
    {
        let component: NotificationDialogComponent = null;

        this._ngZone.run(() =>
        {
            component = this.createComponent(NotificationDialogComponent);

            if(message)
            {
                if(message.startsWith('${')) message = Nitro.instance.getLocalization(message);

                message = message.replace(/\r\n|\r|\n/g, '<br />');
            }

            component.message = message;

            component.image = image;
        });

        if(!component) return null;

        return component;
    }

    private createComponent(type: typeof NotificationDialogComponent): NotificationDialogComponent
    {
        if(!type) return null;

        let instance: NotificationDialogComponent = null;

        const factory = this._componentFactoryResolver.resolveComponentFactory(type);

        let ref: ComponentRef<NotificationDialogComponent> = null;

        if(factory)
        {
            ref = this.alertsContainer.createComponent(factory);

            this._alerts.set(ref.instance, ref);
        }

        instance = ref.instance;

        return instance;
    }

    public close(component: NotificationDialogComponent): void
    {
        if(!component) return;

        const ref = this._alerts.get(component);

        if(!ref) return;

        this._alerts.delete(component);

        this.removeView(ref.hostView);
    }

    public removeView(view: ViewRef): void
    {
        if(!view) return;

        const index = this.alertsContainer.indexOf(view);

        if(index === -1) return;

        this.alertsContainer.remove(index);
    }

    public get alerts(): Map<NotificationDialogComponent, ComponentRef<NotificationDialogComponent>>
    {
        return this._alerts;
    }
}