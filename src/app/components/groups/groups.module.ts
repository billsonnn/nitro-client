import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/index';
import { GroupCreatorImageSelectorComponent } from './components/group-creator/components/image-selector/image-selector.component';
import { GroupCreatorComponent } from './components/group-creator/components/main/group-creator.component';
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
        GroupRoomInfoComponent,
        GroupCreatorComponent,
        GroupCreatorImageSelectorComponent

    ],
    providers: [
        GroupsService
    ],
    declarations: [
        GroupMainComponent,
        GroupInfoComponent,
        GroupMembersComponent,
        GroupRoomInfoComponent,
        GroupCreatorComponent,
        GroupCreatorImageSelectorComponent
    ],
    entryComponents: [GroupCreatorComponent]
})
export class GroupsModule
{}