import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { IMessageEvent } from '../../../../client/core/communication/messages/IMessageEvent';
import { Nitro } from '../../../../client/nitro/Nitro';
import { SettingsService } from '../../../core/settings/service';
import { NotificationService } from '../../notification/services/notification.service';
import { AvatarEditorMainComponent } from '../components/main/main.component';

@Injectable()
export class AvatarEditorService implements OnDestroy
{
    private _component: AvatarEditorMainComponent = null;
    private _messages: IMessageEvent[] = [];

    constructor(
        private _notificationService: NotificationService,
        private _settingsService: SettingsService,
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
        this._ngZone.runOutsideAngular(() =>
        {
            this._messages = [
            ];

            for(let message of this._messages) Nitro.instance.communication.registerMessageEvent(message);
        });
    }

    public unregisterMessages(): void
    {
        this._ngZone.runOutsideAngular(() =>
        {
            for(let message of this._messages) Nitro.instance.communication.removeMessageEvent(message);

            this._messages = [];
        });
    }

    public loadOwnAvatarInEditor(): void
    {
        if(!this._component) return;

        const sessionData = Nitro.instance.sessionDataManager;

        this._component.loadAvatarInEditor(sessionData.figure, sessionData.gender, sessionData.clubLevel);
    }

    public get component(): AvatarEditorMainComponent
    {
        return this._component;
    }

    public set component(component: AvatarEditorMainComponent)
    {
        this._component = component;
    }
}