import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/index';
import { GroupRoomInfoComponent } from './components/room-info/room-info.component';
import { GroupsService } from './services/groups.service';

@NgModule({
    imports: [
        SharedModule
    ],
    exports: [
        GroupRoomInfoComponent
    ],
    providers: [
        GroupsService
    ],
    declarations: [
        GroupRoomInfoComponent
    ]
})
export class GroupsModule
{}