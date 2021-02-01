import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/index';
import { ModToolMainComponent } from './components/main/main.component';
import { ModToolRoomComponent } from './components/room-tool/room-tool.component';
import { ModToolService } from './services/mod-tool.service';
import { ModToolChatlogComponent } from './components/chatlog-tool/chatlog-tool.component';
import { ModToolUserComponent } from './components/user-tool/user-tool.component';
import { ModToolReportsComponent } from './components/reports-tool/reports-tool.component';
import { ModTool } from './components/tool.component';
import { BrowserModule } from '@angular/platform-browser';

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
		ModToolReportsComponent
    ],
    providers: [
        ModToolService
    ],
    declarations: [
        ModToolMainComponent,
        ModToolRoomComponent,
		ModToolChatlogComponent,
		ModToolUserComponent,
		ModToolReportsComponent,
		ModTool
    ]
})
export class ModToolModule
{}
