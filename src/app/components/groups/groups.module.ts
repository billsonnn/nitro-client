import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/index';
import { GroupInfoComponent } from './components/group-info/group-info.component';
import { GroupMembersComponent } from './components/group-members/group-members.component';
import { GroupMainComponent } from './components/main/main.component';
import { GroupRoomInfoComponent } from './components/room-info/room-info.component';
import { GroupsService } from './services/groups.service';

@NgModule({
    imports: [
        SharedModule
    ],
    exports: [
        GroupMainComponent,
        GroupInfoComponent,
        GroupMembersComponent,
        GroupRoomInfoComponent
    ],
    providers: [
        GroupsService
    ],
    declarations: [
        GroupMainComponent,
        GroupInfoComponent,
        GroupMembersComponent,
        GroupRoomInfoComponent
    ]
})
export class GroupsModule
{}