import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/index';
import { NotificationsMainComponent } from './components/main/main.component';
import { NotificationsService } from './services/notifications.service';

@NgModule({
	imports: [
        SharedModule
    ],
    exports: [
        NotificationsMainComponent
    ],
    providers: [
        NotificationsService
    ],
    declarations: [
        NotificationsMainComponent
    ]
})
export class NotificationsModule {}