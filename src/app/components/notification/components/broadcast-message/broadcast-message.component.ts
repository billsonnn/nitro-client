import { Component } from '@angular/core';
import { NotificationService } from '../../services/notification.service';

@Component({
    templateUrl: './broadcast-message.template.html'
})
export class NotificationBroadcastMessageComponent
{
    public title: string    = '';
    public message: string  = '';

    constructor(
        private _notificationService: NotificationService
    ) {}

    public close(): void
    {
        this._notificationService.closeAlert(this);
    }
}