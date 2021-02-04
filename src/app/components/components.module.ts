import { NgModule } from '@angular/core';
import { SharedModule } from '../shared';
import { AchievementsModule } from './achievements/achievements.module';
import { AvatarEditorModule } from './avatar-editor/avatar-editor.module';
import { CallForHelpModule } from './call-for-help/call-for-help.module';
import { CatalogModule } from './catalog/catalog.module';
import { ChatHistoryModule } from './chat-history/chat-history.module';
import { FriendListModule } from './friendlist/friendlist.module';
import { HabbopediaModule } from './habbopedia/habbopedia.module';
import { HotelViewModule } from './hotelview';
import { InventoryModule } from './inventory/inventory.module';
import { MainComponent } from './main/main.component';
import { NavigatorModule } from './navigator/navigator.module';
import { NotificationModule } from './notification/notification.module';
import { PurseModule } from './purse/purse.module';
import { RoomModule } from './room/room.module';
import { ToolbarModule } from './toolbar/toolbar.module';
import { UserProfileModule } from './user-profile/user-profile.module';
import { WiredModule } from './wired/wired.module';
import { ModToolModule } from './mod-tool/mod-tool.module';

@NgModule({
    imports: [
        SharedModule,
        AchievementsModule,
        AvatarEditorModule,
        CallForHelpModule,
        CatalogModule,
        FriendListModule,
        HabbopediaModule,
        HotelViewModule,
        InventoryModule,
        NavigatorModule,
        NotificationModule,
        PurseModule,
        RoomModule,
        ToolbarModule,
        WiredModule,
        ModToolModule,
        UserProfileModule,
        WiredModule,
        ChatHistoryModule
    ],
    exports: [
        MainComponent
    ],
    declarations: [
        MainComponent
    ]
})
export class ComponentsModule
{}
