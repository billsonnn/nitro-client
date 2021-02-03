import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/index';
import { ChatHistoryComponent } from './component/chat-history.component';
import { ChatHistoryService } from './services/chat-history.service';

@NgModule({
    imports: [
        SharedModule
    ],
    exports: [
        ChatHistoryComponent
    ],
    providers: [
        ChatHistoryService
    ],
    declarations: [
        ChatHistoryComponent
    ]
})
export class ChatHistoryModule 
{}