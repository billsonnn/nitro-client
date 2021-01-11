import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/index';
import { NotificationBroadcastMessageComponent } from './components/broadcast-message/broadcast-message.component';
import { NotificationConfirmComponent } from './components/confirm/confirm.component';
import { NotificationMainComponent } from './components/main/main.component';
import { NotificationModeratorMessageComponent } from './components/moderator-message/moderator-message.component';
import { NotificationMultipleMessagesComponent } from './components/motd/motd.component';
import { NotificationService } from './services/notification.service';

@NgModule({
	imports: [
        SharedModule
    ],
    exports: [
        NotificationConfirmComponent,
        NotificationBroadcastMessageComponent,
        NotificationModeratorMessageComponent,
        NotificationMainComponent,
        NotificationMultipleMessagesComponent
    ],
    providers: [
        NotificationService
    ],
    declarations: [
        NotificationConfirmComponent,
        NotificationBroadcastMessageComponent,
        NotificationModeratorMessageComponent,
        NotificationMainComponent,
        NotificationMultipleMessagesComponent
    ]
})
export class NotificationModule {}