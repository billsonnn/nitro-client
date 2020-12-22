import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/index';
import { AlertConfirmComponent } from './components/confirm/confirm.component';
import { AlertGenericLinkComponent } from './components/generic-link/generic-link.component';
import { AlertGenericComponent } from './components/generic/generic.component';
import { AlertMainComponent } from './components/main/main.component';
import { AlertMultipleMessagesComponent } from './components/multiple-messages/multiple-messages.component';
import { AlertService } from './services/alert.service';

@NgModule({
	imports: [
        SharedModule
    ],
    exports: [
        AlertConfirmComponent,
        AlertGenericComponent,
        AlertGenericLinkComponent,
        AlertMainComponent,
        AlertMultipleMessagesComponent
    ],
    providers: [
        AlertService
    ],
    declarations: [
        AlertConfirmComponent,
        AlertGenericComponent,
        AlertGenericLinkComponent,
        AlertMainComponent,
        AlertMultipleMessagesComponent
    ]
})
export class AlertModule {}