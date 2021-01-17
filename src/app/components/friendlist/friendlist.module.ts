import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/index';
import { FriendListMainComponent } from './components/main/main.component';
import { FriendListThreadListComponent } from './components/thread-list/thread-list.component';
import { FriendListThreadViewerComponent } from './components/thread-viewer/thread-viewer.component';
import { FriendListService } from './services/friendlist.service';

@NgModule({
    imports: [
        SharedModule
    ],
    exports: [
        FriendListMainComponent,
        FriendListThreadListComponent,
        FriendListThreadViewerComponent
    ],
    providers: [
        FriendListService
    ],
    declarations: [
        FriendListMainComponent,
        FriendListThreadListComponent,
        FriendListThreadViewerComponent
    ]
})
export class FriendListModule 
{}