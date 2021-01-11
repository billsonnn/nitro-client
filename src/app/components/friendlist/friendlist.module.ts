import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/index';
import { FriendListMainComponent } from './components/main/main.component';
import { FriendListService } from './services/friendlist.service';

@NgModule({
	imports: [
        SharedModule
    ],
    exports: [
        FriendListMainComponent
    ],
    providers: [
        FriendListService
    ],
    declarations: [
        FriendListMainComponent
    ]
})
export class FriendListModule {}