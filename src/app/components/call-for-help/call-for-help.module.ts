import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/index';
import { CallForHelpMainComponent } from './components/main/main.component';
import { CallForHelpService } from './services/call-for-help.service';

@NgModule({
    imports: [
        SharedModule
    ],
    exports: [
        CallForHelpMainComponent
    ],
    providers: [
        CallForHelpService
    ],
    declarations: [
        CallForHelpMainComponent
    ]
})
export class CallForHelpModule 
{}