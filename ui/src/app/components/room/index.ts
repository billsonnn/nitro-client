import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared';
import { RoomComponent } from './component';
import { RoomChatInputComponent } from './widgets/chatinput/component';
import { RoomChatInputStyleSelectorComponent } from './widgets/chatinput/styleselector/component';
import { RoomInfoStandComponent } from './widgets/infostand/component';
import { RoomChatItemComponent } from './widgets/roomchat/chatitem/component';
import { RoomChatComponent } from './widgets/roomchat/component';

@NgModule({
	imports: [
        SharedModule
    ],
    exports: [
        RoomComponent,
        RoomChatInputComponent,
        RoomChatComponent,
        RoomChatItemComponent,
        RoomChatInputStyleSelectorComponent,
        RoomInfoStandComponent
    ],
    providers: [
    ],
    declarations: [
        RoomComponent,
        RoomChatInputComponent,
        RoomChatComponent,
        RoomChatItemComponent,
        RoomChatInputStyleSelectorComponent,
        RoomInfoStandComponent
    ]
})
export class RoomModule {} 