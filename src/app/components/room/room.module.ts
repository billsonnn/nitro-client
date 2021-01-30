import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared';
import { RoomComponent } from './room.component';
import { RoomAvatarInfoAvatarComponent } from './widgets/avatarinfo/avatar/component';
import { RoomAvatarInfoComponent } from './widgets/avatarinfo/component';
import { RoomAvatarInfoNameComponent } from './widgets/avatarinfo/name/component';
import { RoomAvatarInfoOwnAvatarComponent } from './widgets/avatarinfo/ownavatar/component';
import { RoomChatInputComponent } from './widgets/chatinput/component';
import { RoomChatInputStyleSelectorComponent } from './widgets/chatinput/styleselector/component';
import { ChooserWidgetBaseComponent } from './widgets/choosers/base/base.component';
import { ChooserWidgetFurniComponent } from './widgets/choosers/furni/furni.component';
import { ChooserWidgetUserComponent } from './widgets/choosers/user/user.component';
import { FurnitureWidgetCreditComponent } from './widgets/furniture/credit/credit.component';
import { CustomStackHeightComponent } from './widgets/furniture/customstackheight/component';
import { DimmerFurniComponent } from './widgets/furniture/dimmer/component';
import { FurnitureWidgetTrophyComponent } from './widgets/furniture/trophies/trophy.component';
import { RoomInfoStandBotComponent } from './widgets/infostand/components/bot/bot.component';
import { RoomInfoStandFurniComponent } from './widgets/infostand/components/furni/furni.component';
import { RoomInfoStandMainComponent } from './widgets/infostand/components/main/main.component';
import { RoomInfoStandPetComponent } from './widgets/infostand/components/pet/pet.component';
import { RoomInfoStandRentableBotComponent } from './widgets/infostand/components/rentablebot/rentablebot.component';
import { RoomInfoStandUserComponent } from './widgets/infostand/components/user/user.component';
import { DoorbellWidgetComponent } from './widgets/navigator/doorbell/doorbell.component';
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
        RoomInfoStandMainComponent,
        RoomInfoStandBotComponent,
        RoomInfoStandFurniComponent,
        RoomInfoStandPetComponent,
        RoomInfoStandRentableBotComponent,
        RoomInfoStandUserComponent,
        RoomAvatarInfoComponent,
        RoomAvatarInfoAvatarComponent,
        RoomAvatarInfoNameComponent,
        RoomAvatarInfoOwnAvatarComponent,
        CustomStackHeightComponent,
        DimmerFurniComponent,
        FurnitureWidgetTrophyComponent,
        FurnitureWidgetCreditComponent,
        ChooserWidgetBaseComponent,
        ChooserWidgetFurniComponent,
        ChooserWidgetUserComponent,
        DoorbellWidgetComponent
    ],
    declarations: [
        RoomComponent,
        RoomChatInputComponent,
        RoomChatComponent,
        RoomChatItemComponent,
        RoomChatInputStyleSelectorComponent,
        RoomInfoStandMainComponent,
        RoomInfoStandBotComponent,
        RoomInfoStandFurniComponent,
        RoomInfoStandPetComponent,
        RoomInfoStandRentableBotComponent,
        RoomInfoStandUserComponent,
        RoomAvatarInfoComponent,
        RoomAvatarInfoAvatarComponent,
        RoomAvatarInfoNameComponent,
        RoomAvatarInfoOwnAvatarComponent,
        CustomStackHeightComponent,
        DimmerFurniComponent,
        FurnitureWidgetTrophyComponent,
        FurnitureWidgetCreditComponent,
        ChooserWidgetBaseComponent,
        ChooserWidgetFurniComponent,
        ChooserWidgetUserComponent,
        DoorbellWidgetComponent
    ]
})
export class RoomModule
{}
