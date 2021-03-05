import { NgModule } from '@angular/core';
import { ModToolMainComponent } from './components/main/main.component';
import { ModToolRoomComponent } from './components/room-tool/room-tool.component';
import { ModToolService } from './services/mod-tool.service';
import { ModToolChatlogComponent } from './components/chatlog-tool/chatlog-tool.component';
import { ModToolUserComponent } from './components/user-tool/user-tool.component';
import { ModToolReportsComponent } from './components/reports-tool/reports-tool.component';
import { ModTool } from './components/tool.component';
import { BrowserModule } from '@angular/platform-browser';
import { SharedModule } from '../../shared/shared.module';
import { ModToolUserInfoService } from './services/mod-tool-user-info.service';
import { ModToolModActionUserComponent } from './components/mod-action-user/component';
import { ModToolUserVisitedRoomsComponent } from './components/user-room-visits/component';
import { ModToolUserSendMessageComponent } from './components/user-send-message/component';

@NgModule({
    imports: [
        SharedModule,
        BrowserModule
    ],
    exports: [
        ModToolMainComponent,
        ModToolRoomComponent,
        ModToolChatlogComponent,
        ModToolUserComponent,
        ModToolReportsComponent,
        ModToolModActionUserComponent,
        ModToolUserVisitedRoomsComponent,
        ModToolUserSendMessageComponent
    ],
    providers: [
        ModToolService,
        ModToolUserInfoService
    ],
    declarations: [
        ModToolMainComponent,
        ModToolRoomComponent,
        ModToolChatlogComponent,
        ModToolUserComponent,
        ModToolReportsComponent,
        ModTool,
        ModToolModActionUserComponent,
        ModToolUserVisitedRoomsComponent,
        ModToolUserSendMessageComponent
    ]
})
export class ModToolModule
{}
