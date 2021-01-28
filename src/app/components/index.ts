import { NgModule } from '@angular/core';
import { SharedModule } from '../shared';
import { AchievementsModule } from './achievements/achievements.module';
import { AvatarEditorModule } from './avatar-editor/avatar-editor.module';
import { CallForHelpModule } from './call-for-help/call-for-help.module';
import { CatalogModule } from './catalog/catalog.module';
import { MainComponent } from './component';
import { FriendListModule } from './friendlist/friendlist.module';
import { HabbopediaModule } from './habbopedia/habbopedia.module';
import { HotelViewModule } from './hotelview';
import { InventoryModule } from './inventory/inventory.module';
import { NavigatorModule } from './navigator/navigator.module';
import { NotificationModule } from './notification/notification.module';
import { PurseModule } from './purse/purse.module';
import { RoomModule } from './room/room.module';
import { ToolbarModule } from './toolbar/toolbar.module';
import { WiredModule } from './wired/wired.module';

@NgModule({
    imports: [
        SharedModule,
        NotificationModule,
        AvatarEditorModule,
        CallForHelpModule,
        CatalogModule,
        FriendListModule,
        HabbopediaModule,
        HotelViewModule,
        InventoryModule,
        NavigatorModule,
        PurseModule,
        RoomModule,
        ToolbarModule,
        WiredModule,
        AchievementsModule
    ],
    exports: [
        MainComponent
    ],
    declarations: [
        MainComponent
    ]
})
export class ComponentsModule
{ }