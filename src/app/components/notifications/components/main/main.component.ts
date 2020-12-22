import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { NotificationsService } from '../../services/notifications.service';

@Component({
	selector: 'nitro-notifications-main-component',
    templateUrl: './main.template.html'
})
export class NotificationsMainComponent implements OnInit, OnDestroy
{
    constructor(
        private _notificationsService: NotificationsService,
        private _ngZone: NgZone) {}

    public ngOnInit(): void
    {
        this._notificationsService.component = this;
    }

    public ngOnDestroy(): void
    {
        this._notificationsService.component = null;
    }
}