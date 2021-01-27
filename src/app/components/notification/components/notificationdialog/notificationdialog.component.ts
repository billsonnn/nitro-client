import { Component } from '@angular/core';
import { NotificationService } from '../../services/notification.service';

@Component({
    templateUrl: './notificationdialog.temlate.html'
})
export class NotificationDialogComponent
{
    public image: string = '';
    public message: string = '';

    public removing: boolean = false;

    constructor(
        private _notificationService: NotificationService
    )
    {
        setTimeout(() =>
        {
            this.removing = true;
        }, 1000);
        setTimeout(() =>
        {
            this.close();
        }, 5000);
    }

    public close(): void
    {
        this._notificationService.notificationCentre.close(this);
    }
}